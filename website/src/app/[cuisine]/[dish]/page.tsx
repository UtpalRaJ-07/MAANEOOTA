import { notFound } from "next/navigation";
import { CUISINES, cuisineBySlug } from "@/data/cuisines";
import { DISHES, byCuisine, dishBySlug } from "@/data/dishes";
import { DishDetailPage } from "@/components/DishDetailPage";
import { dishSeo } from "@/lib/seo-strings";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { cuisine: string; dish: string }[] = [];
  for (const c of CUISINES) for (const d of byCuisine(c.cuisine)) params.push({ cuisine: c.slug, dish: d.slug });
  return params;
}

export function generateMetadata({ params }: { params: { cuisine: string; dish: string } }) {
  const c = cuisineBySlug(params.cuisine);
  const d = dishBySlug(params.dish);
  if (!c || !d || d.cuisine !== c.cuisine) return {};
  const seo = dishSeo(d, c);
  return pageMeta({ title: seo.title, description: seo.description, path: seo.path, image: d.image ?? c.heroImage.src });
}

export default function DishPage({ params }: { params: { cuisine: string; dish: string } }) {
  const c = cuisineBySlug(params.cuisine);
  const d = dishBySlug(params.dish);
  // A dish is only valid under its own cuisine's URL — one canonical URL per dish.
  if (!c || !d || d.cuisine !== c.cuisine) notFound();
  return <DishDetailPage dish={d} cuisine={c} />;
}
