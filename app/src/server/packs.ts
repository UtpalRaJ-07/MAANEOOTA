// Fixed meal packs and entitlement ledger — master plan section 13.
// A skipped meal cannot both remain available and be refunded/credited.
import { prisma } from "@/lib/db";

export async function purchasePack(input: { mealPackId: string; userId: string; startDate: string }) {
  const pack = await prisma.mealPack.findUnique({ where: { id: input.mealPackId } });
  if (!pack || !pack.active) throw new Error("Pack unavailable");
  return prisma.packPurchase.create({
    data: { mealPackId: pack.id, userId: input.userId, startDate: input.startDate, entitlement: pack.mealCount, state: "active" },
  });
}

// Skip a scheduled delivery. Guards against double-counting entitlement.
export async function skipDelivery(input: { packPurchaseId: string; serviceDate: string; asCredit: boolean }) {
  return prisma.$transaction(async (tx) => {
    const pp = await tx.packPurchase.findUnique({ where: { id: input.packPurchaseId } });
    if (!pp) throw new Error("Pack purchase not found");
    const existing = await tx.packDelivery.findUnique({
      where: { packPurchaseId_serviceDate: { packPurchaseId: pp.id, serviceDate: input.serviceDate } },
    });
    if (existing && existing.state !== "scheduled") {
      const e: any = new Error("DELIVERY_NOT_SKIPPABLE"); e.code = "CONFLICT"; throw e;
    }
    const newState = input.asCredit ? "credited" : "skipped";
    if (existing) {
      await tx.packDelivery.update({ where: { id: existing.id }, data: { state: newState } });
    } else {
      await tx.packDelivery.create({ data: { packPurchaseId: pp.id, serviceDate: input.serviceDate, state: newState } });
    }
    // Exactly one accounting effect: either skip (entitlement preserved for
    // extension) or credit (balance recorded). Never both.
    await tx.packPurchase.update({
      where: { id: pp.id },
      data: input.asCredit ? { credited: { increment: 1 } } : { skipped: { increment: 1 } },
    });
    return { serviceDate: input.serviceDate, state: newState };
  });
}
