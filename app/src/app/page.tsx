import Link from "next/link";
import { LocationPicker } from "@/components/LocationPicker";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishedAreas = await prisma.seoPage.findMany({
    where: { state: "published", locationId: { not: null } },
    include: { location: true },
    take: 12,
  });

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Food that tastes like home.</h1>
          <p className="lead">Find homemade meals from local cooks in Bengaluru. Enter your area to see menus and delivery options.</p>
          <LocationPicker />
          <div className="cta-row">
            <Link className="btn secondary" href="/bengaluru/bulk-food-orders">Order in Bulk</Link>
            <Link className="btn secondary" href="/how-it-works">How it works</Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>Browse by meal</h2>
        <div className="grid cards">
          {["breakfast", "lunch", "dinner"].map((m) => (
            <Link key={m} className="card" href={`/bengaluru/${m}`} style={{ textDecoration: "none" }}>
              <h3 style={{ textTransform: "capitalize" }}>{m}</h3>
              <p className="muted">Home {m} across Bengaluru where kitchens are available.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2>Plans &amp; group food</h2>
        <div className="grid cards">
          <Link className="card" href="/bengaluru/weekly-meal-plans" style={{ textDecoration: "none" }}>
            <h3>Weekly meal plans</h3><p className="muted">Prepaid fixed packs where partners offer them.</p>
          </Link>
          <Link className="card" href="/bengaluru/office-meals" style={{ textDecoration: "none" }}>
            <h3>Office meals</h3><p className="muted">Meals arriving together for teams.</p>
          </Link>
          <Link className="card" href="/bengaluru/function-food" style={{ textDecoration: "none" }}>
            <h3>Function food</h3><p className="muted">Quote-led catering for events.</p>
          </Link>
        </div>
      </section>

      <section className="section container">
        <h2>Where we currently serve</h2>
        {publishedAreas.length === 0 ? (
          <p className="empty">No areas are published yet. Coverage opens area by area as verified kitchens come online.</p>
        ) : (
          <div className="grid cards">
            {publishedAreas.map((p) => (
              <Link key={p.id} className="card" href={p.route} style={{ textDecoration: "none" }}>
                <h3>{p.location?.name}</h3>
                <span className="tag">Serving now</span>
              </Link>
            ))}
          </div>
        )}
        <p style={{ marginTop: 12 }}><Link href="/bengaluru/areas">See all area candidates →</Link></p>
      </section>

      <section className="section container">
        <h2>How it works</h2>
        <ol className="muted">
          <li>Enter your area to check serviceability.</li>
          <li>Pick a meal and slot from a verified local kitchen.</li>
          <li>See the full price before you pay — food, packaging, delivery and any offer.</li>
          <li>Track your order from acceptance to delivery.</li>
        </ol>
      </section>

      <section className="section container">
        <div className="card">
          <h3>Are you a home cook?</h3>
          <p className="muted">List your kitchen, manage your menu and receive orders.</p>
          <Link className="btn" href="/partners">Become a Food Partner</Link>
        </div>
      </section>
    </>
  );
}
