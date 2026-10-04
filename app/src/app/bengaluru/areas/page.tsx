import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Bengaluru areas — coverage directory",
  description: "Browse Bengaluru localities. Pages open for ordering as verified kitchens and delivery become available.",
  alternates: { canonical: "/bengaluru/areas" },
};

const GROUPS: [string, string][] = [
  ["north", "North"], ["south", "South / Southeast"], ["east", "East"],
  ["west", "West"], ["central", "Central"], ["outer", "Outer catchments"],
];

export const dynamic = "force-dynamic";

export default async function Areas() {
  const locations = await prisma.location.findMany({ include: { seoPage: true }, orderBy: { name: "asc" } });
  return (
    <div className="container">
      <nav className="breadcrumbs"><Link href="/">Home</Link> → Areas</nav>
      <h1>Bengaluru coverage directory</h1>
      <p className="muted">120 area candidates across six acquisition groups. Only areas with verified supply are open for ordering; the rest are honest waitlist pages.</p>
      {GROUPS.map(([key, label]) => {
        const rows = locations.filter((l) => l.acquisitionGroup === key);
        return (
          <section className="section" key={key}>
            <h2>{label} ({rows.length})</h2>
            <div className="grid cards">
              {rows.map((l) => {
                const published = l.seoPage?.state === "published";
                return (
                  <Link key={l.id} className="card" href={`/home-food-delivery/bengaluru/${l.slug}`} style={{ textDecoration: "none" }}>
                    <h3>{l.name}</h3>
                    {published ? <span className="tag">Serving now</span> : <span className="tag warn">Waitlist / draft</span>}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
