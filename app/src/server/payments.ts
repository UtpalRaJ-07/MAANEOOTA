// Payment webhook processing + order state machine + ledger.
// Master plan section 21. Server verification is authoritative; the browser
// callback is never trusted. Events are deduplicated by provider event ID.
import { prisma } from "@/lib/db";
import { verifySignature } from "./adapters/payments";

const COMMISSION_PCT = 20; // sandbox commission on food value

export interface WebhookResult { accepted: boolean; reason?: string; duplicate?: boolean; }

export async function processWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
  if (!verifySignature(rawBody, signature)) {
    return { accepted: false, reason: "invalid_signature" };
  }
  let event: { eventId: string; type: string; providerRef: string };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { accepted: false, reason: "bad_payload" };
  }
  if (!event.eventId || !event.providerRef) return { accepted: false, reason: "missing_fields" };

  // Deduplicate: replayed or out-of-order deliveries are safe.
  const seen = await prisma.processedEvent.findUnique({ where: { eventId: event.eventId } });
  if (seen) return { accepted: true, duplicate: true };

  const payment = await prisma.payment.findUnique({ where: { providerRef: event.providerRef }, include: { order: true } });
  if (!payment) {
    // Record the event so a later reconciliation can pick it up; ack to stop retries.
    await prisma.processedEvent.create({ data: { eventId: event.eventId } });
    return { accepted: true, reason: "unknown_payment_recorded_for_reconciliation" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.processedEvent.create({ data: { eventId: event.eventId } });
    await tx.paymentEvent.create({
      data: { paymentId: payment.id, providerEventId: event.eventId, type: event.type, payload: rawBody },
    });

    if (event.type === "payment.captured" && payment.status !== "captured") {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "captured" } });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentState: "captured", fulfilmentState: "awaiting_acceptance" },
      });
      await tx.orderStatusEvent.createMany({
        data: [
          { orderId: payment.orderId, kind: "payment", toState: "captured", actor: "gateway" },
          { orderId: payment.orderId, kind: "fulfilment", fromState: "awaiting_payment", toState: "awaiting_acceptance", actor: "system" },
        ],
      });

      // Convert reserved offer budget to used.
      const redemption = await tx.redemption.findFirst({ where: { orderId: payment.orderId, state: "reserved" } });
      if (redemption) {
        await tx.redemption.update({ where: { id: redemption.id }, data: { state: "redeemed" } });
        await tx.promotion.update({
          where: { id: redemption.promotionId },
          data: {
            heldBudgetPaise: { decrement: redemption.amountPaise },
            usedBudgetPaise: { increment: redemption.amountPaise },
          },
        });
      }

      // Ledger: captured revenue split into platform + partner payable.
      const order = payment.order;
      const partnerPayable = Math.round((order.foodPaise * (100 - COMMISSION_PCT)) / 100);
      const commission = order.foodPaise - partnerPayable;
      await tx.ledgerEntry.createMany({
        data: [
          { orderId: order.id, account: "platform_revenue", amountPaise: commission, memo: "commission" },
          { orderId: order.id, account: "partner_payable", amountPaise: partnerPayable, memo: "food payout" },
          { orderId: order.id, account: "delivery_cost", amountPaise: -order.deliveryPaise, memo: "delivery" },
        ],
      });
    } else if (event.type === "payment.failed" && payment.status === "pending") {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
      await tx.order.update({ where: { id: payment.orderId }, data: { paymentState: "failed" } });
      await releaseReservations(tx, payment.orderId);
    }
  });

  return { accepted: true };
}

// Release slot capacity and offer budget for an unpaid/cancelled order.
async function releaseReservations(tx: any, orderId: string) {
  const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return;
  const units = order.items.reduce((n: number, i: any) => n + i.qty, 0);
  await tx.slot.update({ where: { id: order.slotId }, data: { committed: { decrement: units } } });
  const redemption = await tx.redemption.findFirst({ where: { orderId, state: "reserved" } });
  if (redemption) {
    await tx.redemption.update({ where: { id: redemption.id }, data: { state: "released" } });
    await tx.promotion.update({
      where: { id: redemption.promotionId },
      data: { heldBudgetPaise: { decrement: redemption.amountPaise } },
    });
  }
}

// Refund with reconciliation into the ledger (append-only reversal).
export async function recordRefund(params: { orderId: string; amountPaise: number; reason: string; approver: string }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: params.orderId } });
    if (!order) throw new Error("Order not found");
    if (order.paymentState !== "captured" && order.paymentState !== "partially_refunded") {
      throw new Error("Only captured orders can be refunded");
    }
    const priorRefunds = await tx.refund.aggregate({ where: { orderId: order.id }, _sum: { amountPaise: true } });
    const alreadyRefunded = priorRefunds._sum.amountPaise ?? 0;
    if (alreadyRefunded + params.amountPaise > order.totalPaise) {
      throw new Error("Refund exceeds captured amount");
    }
    const refund = await tx.refund.create({
      data: { orderId: order.id, amountPaise: params.amountPaise, reason: params.reason, approver: params.approver, status: "processed" },
    });
    const newTotal = alreadyRefunded + params.amountPaise;
    await tx.order.update({
      where: { id: order.id },
      data: { paymentState: newTotal >= order.totalPaise ? "refunded" : "partially_refunded" },
    });
    await tx.ledgerEntry.create({
      data: { orderId: order.id, account: "refund", amountPaise: -params.amountPaise, memo: params.reason },
    });
    return refund;
  });
}

export const PAYMENT_CONSTANTS = { COMMISSION_PCT };
