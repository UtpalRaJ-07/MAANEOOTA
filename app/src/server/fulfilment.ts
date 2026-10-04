// Fulfilment state machine — master plan section 21.
import { prisma } from "@/lib/db";

const TRANSITIONS: Record<string, string[]> = {
  awaiting_acceptance: ["accepted", "rejected"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready"],
  ready: ["out_for_delivery"],
  out_for_delivery: ["delivered", "exception"],
};

export async function transitionFulfilment(params: {
  orderId: string; to: string; actor: string; reason?: string; kitchenId: string;
}) {
  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) throw new Error("Order not found");
  // Ownership: a partner can only act on their own kitchen's orders.
  if (order.kitchenId !== params.kitchenId) {
    const err: any = new Error("FORBIDDEN"); err.code = "FORBIDDEN"; throw err;
  }
  const allowed = TRANSITIONS[order.fulfilmentState] ?? [];
  if (!allowed.includes(params.to)) {
    const err: any = new Error(`Illegal transition ${order.fulfilmentState} -> ${params.to}`);
    err.code = "CONFLICT"; throw err;
  }
  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: order.id }, data: { fulfilmentState: params.to } });
    await tx.orderStatusEvent.create({
      data: { orderId: order.id, kind: "fulfilment", fromState: order.fulfilmentState, toState: params.to, actor: params.actor, reason: params.reason },
    });
  });
  return { from: order.fulfilmentState, to: params.to };
}
