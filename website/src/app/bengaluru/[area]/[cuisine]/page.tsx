import { notFound } from "next/navigation";
import { publishedAreaCuisine, AREA_CUISINE_ENTRIES } from "@/data/area-cuisine";
import { areaBySlug } from "@/data/areas";
import { cuisineByKey, cuisineBySlug } from "@/data/cuisines";
import { AreaCuisinePage } from "@/components/AreaCuisinePage";
import { areaCuisineSeo } from "@/lib/seo-strings";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedAreaCuisine().map((e) => ({ area: e.areaSlug, cuisine: cuisineByKey(e.cuisine)!.slug }));
}

function resolve(areaSlug: string, cuisineSlugParam: string) {
  const c = cuisineBySlug(cuisineSlugParam);
  if (!c) return null;
  const entry = AREA_CUISINE_ENTRIES.find((e) => e.published && e.areaSlug === areaSlug && e.cuisine === c.cuisine);
  const area = areaBySlug(areaSlug);
  if (!entry || !area) return null;
  return { entry, area, cuisine: c };
}

export function generateMetadata({ params }: { params: { area: string; cuisine: string } }) {
  const r = resolve(params.area, params.cuisine);
  if (!r) return {};
  const seo = areaCuisineSeo(r.entry, r.area, r.cuisine);
  return pageMeta({ title: seo.title, description: seo.description, path: seo.path, image: r.cuisine.heroImage.src });
}

export default function Page({ params }: { params: { area: string; cuisine: string } }) {
  const r = resolve(params.area, params.cuisine);
  if (!r) notFound();
  return <AreaCuisinePage entry={r.entry} area={r.area} cuisine={r.cuisine} />;
}
