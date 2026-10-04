import type { Metadata } from "next";
import Link from "next/link";
import { LocationPicker } from "@/components/LocationPicker";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Homemade Food Delivery in Bengaluru",
  description: "Order homemade meals from local cooks across Bengaluru. Enter your area to see kitchens, menus and delivery slots.",
  alternates: { canonical: "/home-food-delivery/bengaluru" },
};

export const dynamic = "force-dynamic";

export default async function CityHub() {
  const published = await prisma.seoPage.findMany({ where: { state: "published", locationId: { not: null } }, include: { location: true } });
  return (
    <div className="container">
      <nav className="breadcrumbs"><Link href="/">Home</Link> → Bengaluru Home Food</nav>
      <h1>Homemade Food Delivery in Bengaluru</h1>
      <p className="lead">Find homemade meals from verified local cooks. Enter your area to check kitchens, prices and delivery slots.</p>
      <LocationPicker />
      <section className="section">
        <h2>Areas we serve now</h2>
        {published.length === 0 ? <p className="empty">No areas published yet.</p> : (
          <div className="grid cards">
            {published.map((p) => <Link key={p.id} className="card" href={p.route} style={{ textDecoration: "none" }}><h3>{p.location?.name}</h3><span className="tag">Serving now</span></Link>)}
          </div>
        )}
        <p style={{ marginTop: 12 }}><Link href="/bengaluru/areas">Browse all area candidates →</Link></p>
      </section>
    </div>
  );
}
