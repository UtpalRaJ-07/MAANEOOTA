import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { checkServiceability } from "@/server/serviceability";
import { formatINR } from "@/lib/money";
import { OrderPanel } from "@/components/OrderPanel";

export const dynamic = "force-dynamic";

async function loadArea(slug: string) {
  const city = await prisma.city.findUnique({ where: { slug: "bengaluru" } });
  if (!city) return null;
  const location = await prisma.location.findFirst({
    where: { cityId: city.id, slug },
    include: {
      seoPage: true,
      kitchenCoverage: {
        include: { kitchen: { include: { menuItems: { where: { isListed: true } }, slots: true, reviews: true } } },
      },
    },
  });
  return location;
}

export async function generateMetadata({ params }: { params: { area: string } }): Promise<Metadata> {
  const loc = await loadArea(params.area);
  if (!loc) return { title: "Area not found" };
  const published = loc.seoPage?.state === "published";
  return {
    title: `Homemade Food Delivery in ${loc.name}`,
    description: loc.seoPage?.description ?? undefined,
    // Only published pages are indexable; drafts stay noindex.
    robots: published ? { index: true, follow: true } : { index: false, follow: true },
    alternates: { canonical: `/home-food-delivery/bengaluru/${loc.slug}` },
  };
}

export default async function AreaPage({ params }: { params: { area: string } }) {
  const loc = await loadArea(params.area);
  if (!loc) notFound(); // genuine 404 for unknown slug

  const service = await checkServiceability({ locationSlug: loc.slug, mealType: "lunch" });
  const approved = loc.kitchenCoverage.filter((c) => c.kitchen.state === "approved");
  const isPublished = loc.seoPage?.state === "published";

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> → <Link href="/home-food-delivery/bengaluru">Bengaluru Home Food</Link> → {loc.name}
      </nav>

      <h1>Homemade Food Delivery in {loc.name}</h1>

      {!isPublished && (
        <p className="tag warn" role="status">
          Draft page — not indexed. {approved.length === 0 ? "No verified kitchen serves this area yet." : "Pending editorial review."}
        </p>
      )}

      <p className={`state-badge state-${service.state}`}>{service.state === "available" ? "Open for orders. Choose a slot below to see meals and the full price." : service.message}</p>

      {approved.length === 0 ? (
        <section className="section">
          <div className="empty">
            <p>We do not have a verified kitchen serving {loc.name} yet.</p>
            <p className="muted">Join the waitlist or suggest a home cook and we will follow up when supply is ready.</p>
            <Link className="btn secondary" href="/bengaluru/bulk-food-orders">Request bulk food instead</Link>
          </div>
        </section>
      ) : (
        <>
          <section className="section">
            <h2>Available kitchens &amp; meals</h2>
            <div className="grid cards">
              {approved.map((c) => (
                <div key={c.kitchen.id} className="card">
                  <h3>{c.kitchen.name}</h3>
                  <p><span className="tag">{c.kitchen.kitchenType.replace(/-/g, " ")}</span>
                    {c.kitchen.isFixture && <span className="tag warn">fixture</span>}</p>
                  <p className="muted" style={{ fontSize: ".9rem" }}>{c.kitchen.publicSummary}</p>
                  <ul style={{ paddingLeft: 18 }}>
                    {c.kitchen.menuItems.slice(0, 4).map((m) => (
                      <li key={m.id}>{m.name} — <span className="price">{formatINR(m.pricePaise)}</span>
                        {" "}<span className="tag">{m.dietTags}</span></li>
                    ))}
                  </ul>
                  <Link href={`/kitchens/${c.kitchen.slug}`}>View kitchen →</Link>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>Order for a slot</h2>
            <OrderPanel areaSlug={loc.slug} />
          </section>
        </>
      )}

      <section className="section">
        <h2>Meal slots &amp; delivery</h2>
        <p className="muted">Delivery fee and exact availability are rechecked at checkout for your confirmed address. Cutoffs apply per kitchen and slot.</p>
      </section>

      <section className="section">
        <h2>Common questions</h2>
        <details><summary>What is the cutoff for lunch in {loc.name}?</summary>
          <p className="muted">Each kitchen sets its own cutoff; it is shown on the slot before you order.</p></details>
        <details><summary>Do you deliver to every street in {loc.name}?</summary>
          <p className="muted">Coverage depends on the kitchen&apos;s service zone and delivery feasibility. Confirm your exact address at checkout.</p></details>
        <details><summary>Can I order in bulk for {loc.name}?</summary>
          <p className="muted">Yes — use the bulk enquiry with your locality prefilled.</p></details>
      </section>

      <section className="section">
        <h2>Nearby &amp; city links</h2>
        <p><Link href="/bengaluru/areas">All areas</Link> · <Link href="/bengaluru/lunch">Lunch in Bengaluru</Link> · <Link href="/bengaluru/bulk-food-orders">Bulk food</Link></p>
      </section>
    </div>
  );
}
