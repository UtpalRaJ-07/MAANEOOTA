import { notFound } from "next/navigation";
import { guideBySlug, publishedGuides } from "@/data/guides";
import { GuidePage } from "@/components/GuidePage";
import { guideSeo } from "@/lib/seo-strings";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGuides().map((g) => ({ guide: g.slug }));
}

export function generateMetadata({ params }: { params: { guide: string } }) {
  const g = guideBySlug(params.guide);
  if (!g || !g.published) return {};
  const seo = guideSeo(g);
  return pageMeta({ title: seo.title, description: seo.description, path: seo.path });
}

export default function Page({ params }: { params: { guide: string } }) {
  const g = guideBySlug(params.guide);
  if (!g || !g.published) notFound();
  return <GuidePage guide={g} />;
}
