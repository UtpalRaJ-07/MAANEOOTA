import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Offers in Bengaluru",
  description: "Current homemade-food offers with transparent terms. Best eligible offer means the largest valid saving for your basket.",
  alternates: { canonical: "/offers/bengaluru" },
};

export default async function Offers() {
  const now = new Date();
  const offers = await prisma.promotion.findMany({ where: { active: true, endAt: { gte: now } } });
  return (
    <div className="container">
      <nav className="breadcrumbs"><Link href="/">Home</Link> → Offers</nav>
      <h1>Offers in Bengaluru</h1>
      <p className="muted">&ldquo;Best eligible offer&rdquo; is the largest valid saving among our applicable offers for your current basket — not a lowest-market-price guarantee.</p>
      {offers.length === 0 ? <p className="empty">No active offers right now.</p> : (
        <div className="grid cards">
          {offers.map((o) => (
            <div key={o.id} className="card">
              <h3>{o.code} <span className="tag warn">staging</span></h3>
              <p>{o.amountPaise ? `${formatINR(o.amountPaise)} off` : `${o.percentage}% off`} on a minimum food subtotal of {formatINR(o.minSubtotalPaise)}.</p>
              <p className="muted" style={{ fontSize: ".85rem" }}>One redemption per customer · budgeted campaign · terms {o.termsVersion}. Illustrative only, not an approved live offer.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
