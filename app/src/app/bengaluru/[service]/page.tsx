import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CITY_SERVICES } from "@/lib/areas";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  if (!CITY_SERVICES.includes(params.service as any)) return { title: "Not found" };
  const page = await prisma.seoPage.findUnique({ where: { route: `/bengaluru/${params.service}` } });
  const label = params.service.replace(/-/g, " ");
  return {
    title: `${label} in Bengaluru`,
    robots: page?.state === "published" ? { index: true } : { index: false, follow: true },
    alternates: { canonical: `/bengaluru/${params.service}` },
  };
}

export default async function ServicePage({ params }: { params: { service: string } }) {
  if (!CITY_SERVICES.includes(params.service as any)) notFound();
  const label = params.service.replace(/-/g, " ");
  const page = await prisma.seoPage.findUnique({ where: { route: `/bengaluru/${params.service}` } });
  const isBulk = params.service === "bulk-food-orders" || params.service === "function-food";
  return (
    <div className="container">
      <nav className="breadcrumbs"><Link href="/">Home</Link> → Bengaluru → {label}</nav>
      <h1 style={{ textTransform: "capitalize" }}>{label} in Bengaluru</h1>
      {page?.state !== "published" && <p className="tag warn">Draft — not indexed until supply and content are verified.</p>}
      <p className="muted">This city service page covers {label} intent across Bengaluru. Local child pages open only where there is meaningfully local inventory.</p>
      {isBulk ? (
        <p><Link className="btn" href="/bulk/request">Start a bulk enquiry</Link></p>
      ) : (
        <p><Link className="btn" href="/home-food-delivery/bengaluru">Enter your area to order</Link></p>
      )}
    </div>
  );
}
