import { notFound } from "next/navigation";
import { OCCASIONS, occasionBySlug, publishedOccasions } from "@/data/occasions";
import { OccasionPage } from "@/components/OccasionPage";
import { occasionSeo } from "@/lib/seo-strings";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedOccasions().map((o) => ({ occasion: o.slug }));
}

export function generateMetadata({ params }: { params: { occasion: string } }) {
  const o = occasionBySlug(params.occasion);
  if (!o || !o.published) return {};
  const seo = occasionSeo(o);
  return pageMeta({ title: seo.title, description: seo.description, path: seo.path });
}

export default function Page({ params }: { params: { occasion: string } }) {
  const o = occasionBySlug(params.occasion);
  if (!o || !o.published) notFound();
  return <OccasionPage occasion={o} />;
}
