import type { MetadataRoute } from "next";
import { AREAS } from "@/data/areas";
import { CUISINES, cuisineByKey } from "@/data/cuisines";
import { DISHES } from "@/data/dishes";
import { publishedOccasions } from "@/data/occasions";
import { publishedGuides } from "@/data/guides";
import { publishedAreaCuisine } from "@/data/area-cuisine";
import { SITE } from "@/data/site";

export const dynamic = "force-static";

// Only pages that pass the Publication_Gate (published flags) are listed here,
// and the same filtered arrays drive the page routes, so the sitemap can never
// disagree with what the build actually generates. /credits/ is intentionally
// excluded (it is noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  const base = SITE.url;
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number) =>
    entries.push({ url: base + path, lastModified: built, changeFrequency: "monthly", priority });

  // Core pages
  add("/", 1);
  for (const p of ["/menu/", "/enquire/", "/about/", "/bengaluru/", "/occasions/", "/guides/"]) add(p, 0.8);

  // Cuisine hubs + every dish
  for (const c of CUISINES) add(`/${c.slug}/`, 0.8);
  for (const d of DISHES) {
    const c = cuisineByKey(d.cuisine);
    if (c) add(`/${c.slug}/${d.slug}/`, 0.6);
  }

  // Areas + curated area-cuisine pages
  for (const a of AREAS) add(`/bengaluru/${a.slug}/`, 0.6);
  for (const e of publishedAreaCuisine()) {
    const c = cuisineByKey(e.cuisine);
    if (c) add(`/bengaluru/${e.areaSlug}/${c.slug}/`, 0.6);
  }

  // Occasions + guides
  for (const o of publishedOccasions()) add(`/occasions/${o.slug}/`, 0.7);
  for (const g of publishedGuides()) add(`/guides/${g.slug}/`, 0.6);

  return entries;
}
