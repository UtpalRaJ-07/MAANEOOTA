// Checkout — atomic capacity + offer-budget reservation with idempotency.
// Master plan sections 11, 14, 21 and the critical demonstrations in the brief:
//  - two customers cannot both buy the same last capacity
//  - repeated taps / repeated payment events cannot duplicate orders
import { prisma } from "@/lib/db";
import { buildQuote } from "./pricing";
import { createPaymentIntent } from "./adapters/payments";

let orderSeq = Date.now();
function publicId(): string {
  orderSeq += 1;
  return "MO" + orderSeq.toString(36).toUpperCase();
}

export interface PlaceOrderInput {
  userId: string;
  kitchenId: string;
  slotId: string;
  items: { menuItemId: string; qty: number }[];
  addressSnapshot: string;
  areaSlug?: string;
  deliveryFeePaise: number;
  idempotencyKey: string;
  applyOffers?: boolean;
}

export interface PlaceOrderResult {
  order: { id: string; publicId: string; totalPaise: number; paymentState: string; fulfilmentState: string };
  payment: { providerRef: string; amountPaise: number; sandbox: boolean };
  reused: boolean;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const totalUnits = input.items.reduce((n, i) => n + i.qty, 0);
  if (totalUnits <= 0) throw new Error("Empty order");

  // Idempotency: a repeated tap with the same key returns the existing order.
  const existing = await prisma.order.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    include: { payments: true },
  });
  if (existing) {
    const p = existing.payments[0];
    return {
      order: { id: existing.id, publicId: existing.publicId, totalPaise: existing.totalPaise, paymentState: existing.paymentState, fulfilmentState: existing.fulfilmentState },
      payment: { providerRef: p?.providerRef ?? "", amountPaise: p?.amountPaise ?? existing.totalPaise, sandbox: true },
      reused: true,
    };
  }

  const quote = await buildQuote({
    items: input.items,
    areaSlug: input.areaSlug,
    deliveryFeePaise: input.deliveryFeePaise,
    userId: input.userId,
    applyOffers: input.applyOffers,
  });

  // Transaction: reserve slot capacity with optimistic version check, reserve
  // offer budget, create order + payment intent. SQLite serialises writes; the
  // version guard is what makes the last-unit race safe under Postgres too.
  const result = await prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUnique({ where: { id: input.slotId } });
    if (!slot) throw new Error("Slot not found");
    if (slot.committed + totalUnits > slot.capacity) {
      const err: any = new Error("SLOT_CAPACITY_EXCEEDED");
      err.code = "CONFLICT";
      throw err;
    }

    // Optimistic concurrency: only update if version unchanged.
    const updated = await tx.slot.updateMany({
      where: { id: slot.id, version: slot.version },
      data: { committed: { increment: totalUnits }, version: { increment: 1 } },
    });
    if (updated.count !== 1) {
      const err: any = new Error("SLOT_VERSION_CONFLICT");
      err.code = "CONFLICT";
      throw err;
    }

    // Reserve offer budget atomically.
    if (quote.offerId && quote.discountPaise > 0) {
      const promo = await tx.promotion.findUnique({ where: { id: quote.offerId } });
      if (!promo) throw new Error("Offer vanished");
      const remaining = promo.totalBudgetPaise - promo.usedBudgetPaise - promo.heldBudgetPaise;
      if (quote.discountPaise > remaining) {
        const err: any = new Error("OFFER_BUDGET_EXCEEDED");
        err.code = "CONFLICT";
        throw err;
      }
      await tx.promotion.update({
        where: { id: promo.id },
        data: { heldBudgetPaise: { increment: quote.discountPaise } },
      });
    }

    const pid = publicId();
    const order = await tx.order.create({
      data: {
        publicId: pid,
        userId: input.userId,
        kitchenId: input.kitchenId,
        slotId: input.slotId,
        idempotencyKey: input.idempotencyKey,
        addressSnapshot: input.addressSnapshot,
        foodPaise: quote.foodPaise,
        packagingPaise: quote.packagingPaise,
        deliveryPaise: quote.deliveryPaise,
        platformFeePaise: quote.platformFeePaise,
        discountPaise: quote.discountPaise,
        taxPaise: quote.taxPaise,
        totalPaise: quote.totalPaise,
        offerId: quote.offerId,
        paymentState: "pending",
        fulfilmentState: "awaiting_payment",
        items: {
          create: quote.lines.map((l) => ({
            menuItemId: l.menuItemId,
            nameSnapshot: l.name,
            qty: l.qty,
            pricePaise: l.pricePaise,
          })),
        },
        statusEvents: {
          create: [{ kind: "fulfilment", toState: "awaiting_payment", actor: "system" }],
        },
      },
    });

    if (quote.offerId && quote.discountPaise > 0) {
      await tx.redemption.create({
        data: {
          promotionId: quote.offerId,
          orderId: order.id,
          userId: input.userId,
          amountPaise: quote.discountPaise,
          state: "reserved",
        },
      });
    }

    const intent = createPaymentIntent(pid, quote.totalPaise);
    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: intent.provider,
        providerRef: intent.providerRef,
        amountPaise: intent.amountPaise,
        status: "pending",
      },
    });

    return { order, intent };
  });

  return {
    order: {
      id: result.order.id,
      publicId: result.order.publicId,
      totalPaise: result.order.totalPaise,
      paymentState: result.order.paymentState,
      fulfilmentState: result.order.fulfilmentState,
    },
    payment: { providerRef: result.intent.providerRef, amountPaise: result.intent.amountPaise, sandbox: result.intent.sandbox },
    reused: false,
  };
}
