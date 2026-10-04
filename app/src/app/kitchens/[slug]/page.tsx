import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const k = await prisma.kitchen.findUnique({ where: { slug: params.slug } });
  if (!k) return { title: "Kitchen not found" };
  return {
    title: k.name,
    robots: k.state === "approved" ? { index: true } : { index: false, follow: true },
    alternates: { canonical: `/kitchens/${k.slug}` },
  };
}

export default async function Kitchen({ params }: { params: { slug: string } }) {
  const k = await prisma.kitchen.findUnique({
    where: { slug: params.slug },
    include: { menuItems: { where: { isListed: true } }, reviews: true },
  });
  if (!k || k.state !== "approved") notFound();
  return (
    <div className="container">
      <nav className="breadcrumbs"><Link href="/">Home</Link> → Kitchens → {k.name}</nav>
      <h1>{k.name}</h1>
      <p><span className="tag">{k.kitchenType.replace(/-/g, " ")}</span>{k.isFixture && <span className="tag warn">fixture</span>}</p>
      <p className="muted">{k.publicSummary}</p>
      <p className="muted" style={{ fontSize: ".85rem" }}>Verification scope: {k.verificationScope}</p>
      <h2>Menu</h2>
      <div className="grid cards">
        {k.menuItems.map((m) => (
          <div key={m.id} className="card"><h3>{m.name}</h3>
            <p className="price">{formatINR(m.pricePaise)}</p>
            <p><span className="tag">{m.dietTags}</span><span className="tag">{m.mealType}</span></p>
          </div>
        ))}
      </div>
      <h2>Reviews</h2>
      {k.reviews.length === 0 ? <p className="muted">No reviews yet. Reviews are shown only from delivered orders.</p> : (
        <ul>{k.reviews.filter((r)=>r.state==="published").map((r) => <li key={r.id}>{"★".repeat(r.rating)} {r.text}</li>)}</ul>
      )}
    </div>
  );
}
