import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Only canonical, published, indexable pages appear in the sitemap.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://example.invalid";
  const staticRoutes = ["/", "/home-food-delivery/bengaluru", "/bengaluru/areas", "/offers/bengaluru", "/partners", "/about", "/how-it-works", "/food-safety", "/contact"];
  const published = await prisma.seoPage.findMany({ where: { state: "published", sitemapIncluded: true } });
  return [
    ...staticRoutes.map((r) => ({ url: base + r, lastModified: new Date() })),
    ...published.map((p) => ({ url: base + p.route, lastModified: p.lastMaterialUpdate ?? p.updatedAt })),
  ];
}
