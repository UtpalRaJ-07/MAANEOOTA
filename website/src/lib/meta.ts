import type { Metadata } from "next";
import { SITE } from "@/data/site";

export function pageMeta(opts: { title: string; description: string; path: string; image?: string; absoluteTitle?: boolean; noindex?: boolean }): Metadata {
  const image = opts.image ?? "/images/hero-biryani.jpg";
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: { type: "website", siteName: SITE.name, locale: "en_IN", title: opts.title, description: opts.description, url: opts.path, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE.url + it.path })),
  };
}

// Wide photos used for page heroes.
export const WIDE = {
  heroBiryani: { src: "/images/hero-biryani.jpg", w: 1800, h: 1200, alt: "Chicken biryani garnished with fresh herbs" },
  northThali: { src: "/images/north-thali.jpg", w: 1200, h: 1200, alt: "North Indian thali with curries, rice and naan" },
  southLeaf: { src: "/images/south-banana-leaf.jpg", w: 1400, h: 930, alt: "South Indian festive meal served on a banana leaf" },
  buffet: { src: "/images/functions-buffet.jpg", w: 1400, h: 933, alt: "Indian dishes laid out in copper serving bowls" },
};
export type WideImage = (typeof WIDE)[keyof typeof WIDE];

// React 18 has no typed prop for fetchpriority; pass it through as a plain attribute.
export const HIGH_PRIORITY = { fetchpriority: "high" } as Record<string, string>;
