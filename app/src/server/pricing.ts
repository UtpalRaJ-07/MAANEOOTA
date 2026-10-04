// Server-side pricing and offer selection. Master plan sections 11 & 14.
// The client never supplies a trusted total. "Best eligible offer" = largest
// valid saving among applicable platform offers for the current basket.
import { prisma } from "@/lib/db";
import { percentOff } from "@/lib/money";

const PLATFORM_FEE_PAISE = 900; // transparent flat platform fee (sandbox default)
const PACKAGING_PAISE = 1500;

export interface PriceLine { menuItemId: string; name: string; qty: number; pricePaise: number; }

export interface QuoteResult {
  foodPaise: number;
  packagingPaise: number;
  deliveryPaise: number;
  platformFeePaise: number;
  discountPaise: number;
  taxPaise: number;
  totalPaise: number;
  offerId?: string;
  offerCode?: string;
  lines: PriceLine[];
}

// Select the single best eligible offer (no stacking by default).
export async function selectBestOffer(params: {
  subtotalPaise: number;
  areaSlug?: string;
  userId?: string;
}): Promise<{ id: string; code: string; discountPaise: number } | null> {
  const now = new Date();
  const offers = await prisma.promotion.findMany({
    where: { active: true, startAt: { lte: now }, endAt: { gte: now } },
  });

  let best: { id: string; code: string; discountPaise: number } | null = null;
  for (const o of offers) {
    if (params.subtotalPaise < o.minSubtotalPaise) continue;
    if (o.eligibleAreas && params.areaSlug && !o.eligibleAreas.split(",").includes(params.areaSlug)) continue;
    // budget check
    if (o.usedBudgetPaise + o.heldBudgetPaise >= o.totalBudgetPaise) continue;
    // per-user limit
    if (params.userId) {
      const used = await prisma.redemption.count({
        where: { promotionId: o.id, userId: params.userId, state: { in: ["reserved", "redeemed"] } },
      });
      if (used >= o.perUserLimit) continue;
    }
    let discount = 0;
    if (o.amountPaise != null) discount = Math.min(o.amountPaise, params.subtotalPaise);
    else if (o.percentage != null) discount = percentOff(params.subtotalPaise, o.percentage, o.maxSavingPaise ?? undefined);
    // do not exceed remaining budget
    const remaining = o.totalBudgetPaise - o.usedBudgetPaise - o.heldBudgetPaise;
    discount = Math.min(discount, remaining);
    if (discount > 0 && (!best || discount > best.discountPaise)) {
      best = { id: o.id, code: o.code, discountPaise: discount };
    }
  }
  return best;
}

export async function buildQuote(params: {
  items: { menuItemId: string; qty: number }[];
  areaSlug?: string;
  deliveryFeePaise: number;
  userId?: string;
  applyOffers?: boolean;
}): Promise<QuoteResult> {
  const lines: PriceLine[] = [];
  let foodPaise = 0;
  for (const it of params.items) {
    const mi = await prisma.menuItem.findUnique({ where: { id: it.menuItemId } });
    if (!mi || !mi.isListed) throw new Error(`Item unavailable: ${it.menuItemId}`);
    if (it.qty <= 0) throw new Error("Invalid quantity");
    lines.push({ menuItemId: mi.id, name: mi.name, qty: it.qty, pricePaise: mi.pricePaise });
    foodPaise += mi.pricePaise * it.qty;
  }

  const packagingPaise = PACKAGING_PAISE;
  const deliveryPaise = params.deliveryFeePaise;
  const platformFeePaise = PLATFORM_FEE_PAISE;

  let discountPaise = 0;
  let offerId: string | undefined;
  let offerCode: string | undefined;
  if (params.applyOffers !== false) {
    const best = await selectBestOffer({ subtotalPaise: foodPaise, areaSlug: params.areaSlug, userId: params.userId });
    if (best) {
      discountPaise = best.discountPaise;
      offerId = best.id;
      offerCode = best.code;
    }
  }

  // Tax intentionally 0 in sandbox: rates must be confirmed with a CA (plan §26).
  const taxPaise = 0;

  const totalPaise = foodPaise + packagingPaise + deliveryPaise + platformFeePaise - discountPaise + taxPaise;

  return { foodPaise, packagingPaise, deliveryPaise, platformFeePaise, discountPaise, taxPaise, totalPaise, offerId, offerCode, lines };
}

export const PRICING_CONSTANTS = { PLATFORM_FEE_PAISE, PACKAGING_PAISE };
