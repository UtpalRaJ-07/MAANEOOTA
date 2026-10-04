// Bulk enquiries and versioned quotes — master plan section 12.
// Accepted quotes are immutable; a change creates a new version and supersedes
// prior sent versions. Acceptance of an expired/superseded version is refused.
import { prisma } from "@/lib/db";

export async function createBulkRequest(input: {
  userId?: string; headcount: number; serviceDate: string; locationSlug?: string;
  mealType: string; cuisine?: string; vegSplit?: string; budgetPerHeadPaise?: number;
  packaging?: string; contactPhone: string; notes?: string;
}) {
  const publicRef = "BULK" + Date.now().toString(36).toUpperCase();
  return prisma.bulkRequest.create({ data: { ...input, publicRef, state: "received" } });
}

export async function addQuoteVersion(input: {
  bulkRequestId: string; totalPaise: number; perHeadPaise: number; menuSummary: string; validHours: number;
}) {
  return prisma.$transaction(async (tx) => {
    const last = await tx.quoteVersion.findFirst({
      where: { bulkRequestId: input.bulkRequestId }, orderBy: { version: "desc" },
    });
    // Any previously "sent" version is superseded by a new one.
    await tx.quoteVersion.updateMany({
      where: { bulkRequestId: input.bulkRequestId, state: "sent" }, data: { state: "superseded" },
    });
    const version = (last?.version ?? 0) + 1;
    const quote = await tx.quoteVersion.create({
      data: {
        bulkRequestId: input.bulkRequestId,
        version,
        totalPaise: input.totalPaise,
        perHeadPaise: input.perHeadPaise,
        menuSummary: input.menuSummary,
        acceptanceExpiry: new Date(Date.now() + input.validHours * 3600 * 1000),
        state: "sent",
      },
    });
    await tx.bulkRequest.update({ where: { id: input.bulkRequestId }, data: { state: "quoted" } });
    return quote;
  });
}

export async function acceptQuote(quoteId: string) {
  return prisma.$transaction(async (tx) => {
    const quote = await tx.quoteVersion.findUnique({ where: { id: quoteId } });
    if (!quote) throw new Error("Quote not found");
    if (quote.state !== "sent") { const e: any = new Error("QUOTE_NOT_ACCEPTABLE"); e.code = "CONFLICT"; throw e; }
    if (quote.acceptanceExpiry < new Date()) {
      await tx.quoteVersion.update({ where: { id: quote.id }, data: { state: "expired" } });
      const e: any = new Error("QUOTE_EXPIRED"); e.code = "CONFLICT"; throw e;
    }
    const accepted = await tx.quoteVersion.update({ where: { id: quote.id }, data: { state: "accepted", acceptedAt: new Date() } });
    await tx.bulkRequest.update({ where: { id: quote.bulkRequestId }, data: { state: "accepted" } });
    return accepted;
  });
}
