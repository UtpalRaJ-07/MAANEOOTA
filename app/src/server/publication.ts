// SEO publication gate — enforces the editorial rules in master plan section 6.
// A page is indexable ONLY when every hard gate passes. This is a product rule,
// not a Google requirement, and it prevents doorway/thin pages.
import { prisma } from "@/lib/db";

export interface GateResult {
  passed: boolean;
  checks: { rule: string; passed: boolean; detail: string }[];
}

export async function evaluatePublicationGate(locationId: string): Promise<GateResult> {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: {
      kitchenCoverage: { include: { kitchen: { include: { menuItems: true, slots: true } } } },
    },
  });

  const checks: GateResult["checks"] = [];
  if (!location) {
    return { passed: false, checks: [{ rule: "location/exists", passed: false, detail: "Location not found" }] };
  }

  // 1. Verified locality identity (geography sourced).
  checks.push({
    rule: "geography/verified",
    passed: Boolean(location.geoVerifiedAt && location.geoSource),
    detail: location.geoVerifiedAt ? `sourced ${location.geoSource}` : "geography not yet sourced/verified",
  });

  // 2. At least one approved operating kitchen serving the locality.
  const approvedKitchens = location.kitchenCoverage.filter((c) => c.kitchen.state === "approved");
  checks.push({
    rule: "supply/kitchen",
    passed: approvedKitchens.length >= 1,
    detail: `${approvedKitchens.length} approved kitchen(s) serving`,
  });

  // 3. At least three real selectable meals OR one substantive plan/bulk offer.
  const mealCount = approvedKitchens.reduce(
    (n, c) => n + c.kitchen.menuItems.filter((m) => m.isListed).length, 0);
  checks.push({
    rule: "supply/meals",
    passed: mealCount >= 3,
    detail: `${mealCount} listed meal(s) across serving kitchens`,
  });

  // 4. Confirmed upcoming availability (a future slot exists).
  const hasSlot = approvedKitchens.some((c) => c.kitchen.slots.some((s) => s.capacity > s.committed));
  checks.push({
    rule: "availability/slot",
    passed: hasSlot,
    detail: hasSlot ? "upcoming slot with capacity" : "no upcoming slot with capacity",
  });

  // 5/8. Editorial: reviewer assigned and page metadata present.
  const seo = await prisma.seoPage.findUnique({ where: { locationId } });
  checks.push({
    rule: "editorial/reviewed",
    passed: Boolean(seo?.reviewer && seo?.reviewedAt && seo?.title && seo?.h1),
    detail: seo?.reviewer ? `reviewed by ${seo.reviewer}` : "no named reviewer / metadata incomplete",
  });

  const passed = checks.every((c) => c.passed);
  return { passed, checks };
}

// Publish only if the gate passes. Records checks and audit trail.
export async function publishSeoPage(seoPageId: string, actor: string): Promise<GateResult> {
  const seo = await prisma.seoPage.findUnique({ where: { id: seoPageId } });
  if (!seo || !seo.locationId) throw new Error("SEO page or location missing");

  const result = await evaluatePublicationGate(seo.locationId);

  await prisma.publicationCheck.deleteMany({ where: { seoPageId } });
  await prisma.publicationCheck.createMany({
    data: result.checks.map((c) => ({ seoPageId, rule: c.rule, passed: c.passed, detail: c.detail })),
  });

  if (result.passed) {
    await prisma.seoPage.update({
      where: { id: seoPageId },
      data: {
        state: "published",
        sitemapIncluded: true,
        reviewedAt: seo.reviewedAt ?? new Date(),
        lastMaterialUpdate: new Date(),
        nextReviewAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      },
    });
    await prisma.auditLog.create({ data: { action: "seo.publish", target: seo.route, reason: `actor:${actor}` } });
  } else {
    await prisma.auditLog.create({ data: { action: "seo.publish_blocked", target: seo.route, reason: `actor:${actor}` } });
  }
  return result;
}
