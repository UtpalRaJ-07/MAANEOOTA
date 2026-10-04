import { notFound } from "next/navigation";
import { CUISINES, cuisineBySlug } from "@/data/cuisines";
import { byCuisine } from "@/data/dishes";
import { CuisinePage } from "@/components/CuisinePage";
import { cuisineHubSeo } from "@/lib/seo-strings";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return CUISINES.map((c) => ({ cuisine: c.slug }));
}

export function generateMetadata({ params }: { params: { cuisine: string } }) {
  const c = cuisineBySlug(params.cuisine);
  if (!c) return {};
  const seo = cuisineHubSeo(c);
  return pageMeta({ title: seo.title, description: seo.description, path: seo.path, image: c.heroImage.src });
}

export default function CuisineHub({ params }: { params: { cuisine: string } }) {
  const c = cuisineBySlug(params.cuisine);
  if (!c) notFound();
  const related = CUISINES.filter((x) => x.cuisine !== c.cuisine).slice(0, 3).map((x) => ({ href: `/${x.slug}/`, label: `${x.name} dishes` }));
  return (
    <CuisinePage
      cuisineSlug={c.slug}
      path={c.slug === "biryani" ? "/biryani/" : `/${c.slug}/`}
      crumb={c.name}
      eyebrow={c.eyebrow}
      title={c.title}
      lead={c.lead}
      image={c.heroImage}
      dishes={byCuisine(c.cuisine)}
      heading={c.heading}
      sub={c.sub}
      faq={c.faq}
      related={related}
    />
  );
}
