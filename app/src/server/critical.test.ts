import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "@/lib/db";
import { placeOrder } from "./checkout";
import { processWebhook, recordRefund } from "./payments";
import { signPayload } from "./adapters/payments";
import { transitionFulfilment } from "./fulfilment";
import { evaluatePublicationGate, publishSeoPage } from "./publication";
import { addQuoteVersion, acceptQuote, createBulkRequest } from "./bulk";
import { purchasePack, skipDelivery } from "./packs";
import { checkServiceability } from "./serviceability";
import { buildQuote } from "./pricing";

let customerId: string;
let customer2Id: string;
let kitchenId: string;
let otherKitchenId: string;
let lunchSlotId: string;
let menuItemId: string;
const RUN = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Mint an isolated slot with fresh capacity so tests never depend on
// cumulative seed/smoke-test consumption.
async function freshSlot(kId: string, capacity: number) {
  return prisma.slot.create({
    data: { kitchenId: kId, serviceDate: `T-${RUN}-${Math.random().toString(36).slice(2, 8)}`, mealType: "lunch", cutoff: new Date(Date.now() + 9e10), capacity, committed: 0 },
  });
}

beforeAll(async () => {
  const c1 = await prisma.user.findUnique({ where: { phone: "+910000000001" } });
  customerId = c1!.id;
  const c2 = await prisma.user.upsert({ where: { phone: "+910000000099" }, update: {}, create: { phone: "+910000000099", name: "C2", role: "customer", phoneVerified: true } });
  customer2Id = c2.id;
  const k = await prisma.kitchen.findUnique({ where: { slug: "hsr-layout-fixture-kitchen-1" } });
  kitchenId = k!.id;
  const ok = await prisma.kitchen.findUnique({ where: { slug: "koramangala-fixture-kitchen-1" } });
  otherKitchenId = ok!.id;
  const mi = await prisma.menuItem.findFirst({ where: { kitchenId, mealType: "lunch" } });
  menuItemId = mi!.id;
  // Dedicated high-capacity slot for the sequential order/payment/refund tests.
  const slot = await freshSlot(kitchenId, 100);
  lunchSlotId = slot.id;
});

describe("checkout & capacity", () => {
  it("creates an order and reserves capacity", async () => {
    const r = await placeOrder({
      userId: customerId, kitchenId, slotId: lunchSlotId,
      items: [{ menuItemId, qty: 2 }], addressSnapshot: "HSR test", areaSlug: "hsr-layout",
      deliveryFeePaise: 2500, idempotencyKey: `idem-A-${RUN}`, applyOffers: false,
    });
    expect(r.order.totalPaise).toBeGreaterThan(0);
    expect(r.reused).toBe(false);
  });

  it("is idempotent — same key returns same order, no double reservation", async () => {
    const before = await prisma.slot.findUnique({ where: { id: lunchSlotId } });
    const r = await placeOrder({
      userId: customerId, kitchenId, slotId: lunchSlotId,
      items: [{ menuItemId, qty: 2 }], addressSnapshot: "HSR test", areaSlug: "hsr-layout",
      deliveryFeePaise: 2500, idempotencyKey: `idem-A-${RUN}`, applyOffers: false,
    });
    const after = await prisma.slot.findUnique({ where: { id: lunchSlotId } });
    expect(r.reused).toBe(true);
    expect(after!.committed).toBe(before!.committed);
  });

  it("prevents two customers buying the same last capacity", async () => {
    // fresh slot with capacity 1
    const k = await prisma.kitchen.findUnique({ where: { slug: "whitefield-fixture-kitchen-1" } });
    const mi = await prisma.menuItem.findFirst({ where: { kitchenId: k!.id, mealType: "lunch" } });
    const slot = await freshSlot(k!.id, 1);
    const results = await Promise.allSettled([
      placeOrder({ userId: customerId, kitchenId: k!.id, slotId: slot.id, items: [{ menuItemId: mi!.id, qty: 1 }], addressSnapshot: "a", deliveryFeePaise: 2500, idempotencyKey: `race-1-${RUN}`, applyOffers: false }),
      placeOrder({ userId: customer2Id, kitchenId: k!.id, slotId: slot.id, items: [{ menuItemId: mi!.id, qty: 1 }], addressSnapshot: "b", deliveryFeePaise: 2500, idempotencyKey: `race-2-${RUN}`, applyOffers: false }),
    ]);
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    expect(ok).toBe(1);
    expect(failed).toBe(1);
    const finalSlot = await prisma.slot.findUnique({ where: { id: slot.id } });
    expect(finalSlot!.committed).toBe(1);
  });
});

describe("payments webhook", () => {
  it("verifies signature, captures payment, and dedupes replays", async () => {
    const r = await placeOrder({
      userId: customerId, kitchenId, slotId: lunchSlotId,
      items: [{ menuItemId, qty: 1 }], addressSnapshot: "x", deliveryFeePaise: 2500, idempotencyKey: `pay-1-${RUN}`, applyOffers: false,
    });
    const body = JSON.stringify({ eventId: `evt-1-${RUN}`, type: "payment.captured", providerRef: r.payment.providerRef });
    const sig = signPayload(body);
    const res1 = await processWebhook(body, sig);
    expect(res1.accepted).toBe(true);
    const res2 = await processWebhook(body, sig); // replay
    expect(res2.duplicate).toBe(true);
    const order = await prisma.order.findFirst({ where: { publicId: r.order.publicId } });
    expect(order!.paymentState).toBe("captured");
    expect(order!.fulfilmentState).toBe("awaiting_acceptance");
  });

  it("rejects a forged signature", async () => {
    const body = JSON.stringify({ eventId: "evt-forge", type: "payment.captured", providerRef: "x" });
    const res = await processWebhook(body, "deadbeef");
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe("invalid_signature");
  });
});

describe("fulfilment ownership & transitions", () => {
  it("blocks a partner acting on another kitchen's order", async () => {
    const r = await placeOrder({ userId: customerId, kitchenId, slotId: lunchSlotId, items: [{ menuItemId, qty: 1 }], addressSnapshot: "x", deliveryFeePaise: 2500, idempotencyKey: `own-1-${RUN}`, applyOffers: false });
    const body = JSON.stringify({ eventId: `evt-own-${RUN}`, type: "payment.captured", providerRef: r.payment.providerRef });
    await processWebhook(body, signPayload(body));
    const order = await prisma.order.findFirst({ where: { publicId: r.order.publicId } });
    await expect(transitionFulfilment({ orderId: order!.id, to: "accepted", actor: "partner", kitchenId: otherKitchenId })).rejects.toThrow("FORBIDDEN");
  });

  it("rejects an illegal state transition", async () => {
    const r = await placeOrder({ userId: customerId, kitchenId, slotId: lunchSlotId, items: [{ menuItemId, qty: 1 }], addressSnapshot: "x", deliveryFeePaise: 2500, idempotencyKey: `trans-1-${RUN}`, applyOffers: false });
    const order = await prisma.order.findFirst({ where: { publicId: r.order.publicId } });
    // still awaiting_payment -> cannot jump to delivered
    await expect(transitionFulfilment({ orderId: order!.id, to: "delivered", actor: "partner", kitchenId })).rejects.toThrow();
  });
});

describe("refunds", () => {
  it("records a refund and never exceeds captured amount", async () => {
    const r = await placeOrder({ userId: customerId, kitchenId, slotId: lunchSlotId, items: [{ menuItemId, qty: 1 }], addressSnapshot: "x", deliveryFeePaise: 2500, idempotencyKey: `refund-1-${RUN}`, applyOffers: false });
    const body = JSON.stringify({ eventId: `evt-refund-${RUN}`, type: "payment.captured", providerRef: r.payment.providerRef });
    await processWebhook(body, signPayload(body));
    const order = await prisma.order.findFirst({ where: { publicId: r.order.publicId } });
    await recordRefund({ orderId: order!.id, amountPaise: 1000, reason: "partial", approver: "admin" });
    await expect(recordRefund({ orderId: order!.id, amountPaise: order!.totalPaise, reason: "too much", approver: "admin" })).rejects.toThrow();
  });
});

describe("bulk quotes", () => {
  it("supersedes prior versions and refuses accepting an old version", async () => {
    const req = await createBulkRequest({ headcount: 50, serviceDate: "2099-02-" + RUN, mealType: "lunch", contactPhone: "+910000000001" });
    const v1 = await addQuoteVersion({ bulkRequestId: req.id, totalPaise: 500000, perHeadPaise: 10000, menuSummary: "v1", validHours: 48 });
    await addQuoteVersion({ bulkRequestId: req.id, totalPaise: 520000, perHeadPaise: 10400, menuSummary: "v2", validHours: 48 });
    await expect(acceptQuote(v1.id)).rejects.toThrow("QUOTE_NOT_ACCEPTABLE");
  });
});

describe("meal packs", () => {
  it("skip cannot double-count entitlement", async () => {
    const pack = await prisma.mealPack.findFirst();
    const skipDate = "2099-04-" + RUN;
    const pp = await purchasePack({ mealPackId: pack!.id, userId: customerId, startDate: "2099-03-01" });
    await skipDelivery({ packPurchaseId: pp.id, serviceDate: skipDate, asCredit: false });
    await expect(skipDelivery({ packPurchaseId: pp.id, serviceDate: skipDate, asCredit: true })).rejects.toThrow("DELIVERY_NOT_SKIPPABLE");
  });
});

describe("serviceability", () => {
  it("returns location_unclear with no locality", async () => {
    const r = await checkServiceability({});
    expect(r.state).toBe("location_unclear");
  });
  it("returns available for a served area with capacity", async () => {
    const r = await checkServiceability({ locationSlug: "koramangala", mealType: "lunch" });
    expect(["available", "available_later"]).toContain(r.state);
    expect(r.kitchens.length).toBeGreaterThan(0);
  });
  it("returns not_served for an area without approved kitchens", async () => {
    const r = await checkServiceability({ locationSlug: "hebbal" });
    expect(r.state).toBe("not_served");
  });
});

describe("SEO publication gate", () => {
  it("keeps a draft area without supply out of publication", async () => {
    const loc = await prisma.location.findFirst({ where: { slug: "hebbal" } });
    const gate = await evaluatePublicationGate(loc!.id);
    expect(gate.passed).toBe(false);
  });
  it("passes the gate for a fully supplied, reviewed area", async () => {
    const page = await prisma.seoPage.findUnique({ where: { route: "/home-food-delivery/bengaluru/koramangala" } });
    const result = await publishSeoPage(page!.id, "content-tester");
    expect(result.passed).toBe(true);
    const after = await prisma.seoPage.findUnique({ where: { id: page!.id } });
    expect(after!.state).toBe("published");
    expect(after!.sitemapIncluded).toBe(true);
  });
});

describe("offers", () => {
  it("applies the staging offer once per customer and later quotes reflect it", async () => {
    const first = await buildQuote({ items: [{ menuItemId, qty: 2 }], deliveryFeePaise: 2500, userId: customer2Id });
    expect(first.discountPaise).toBe(3000);
    const r = await placeOrder({ userId: customer2Id, kitchenId, slotId: lunchSlotId, items: [{ menuItemId, qty: 2 }], addressSnapshot: "x", deliveryFeePaise: 2500, idempotencyKey: `offer-1-${RUN}`, applyOffers: true });
    expect(r.order.totalPaise).toBe(first.totalPaise);
    const body = JSON.stringify({ eventId: `evt-offer-${RUN}`, type: "payment.captured", providerRef: r.payment.providerRef });
    await processWebhook(body, signPayload(body));
    const second = await buildQuote({ items: [{ menuItemId, qty: 2 }], deliveryFeePaise: 2500, userId: customer2Id });
    expect(second.discountPaise).toBe(0);
  });
});
