import Link from "next/link";
import { CUISINES } from "@/data/cuisines";
import { byCuisine } from "@/data/dishes";
import { DishList } from "@/components/DishCard";
import { DietLegend } from "@/components/DietMark";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Menu — Biryani, North Indian & South Indian Dishes",
  description: "The full MAANE OOTA menu: biryani by the kg, North Indian curries and breads, South Indian and Karnataka dishes, starters and sweets. Every order is priced by custom quote.",
  path: "/menu/",
});

export default function Menu() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Menu", path: "/menu/" }])} />
      <section className="hero compact">
        <div className="wrap">
          <p className="eyebrow">Menu</p>
          <h1 className="display sm">Everything we cook.</h1>
          <p className="lead">All dishes are cooked to order and priced by custom quote. Order by the kg, litre or piece.</p>
          <DietLegend />
        </div>
      </section>
      <nav className="subnav" aria-label="Menu sections">
        <ul>{CUISINES.map((c) => <li key={c.slug}><a href={`#${c.slug}`}>{c.name}</a></li>)}</ul>
      </nav>
      <div className="wrap" style={{ paddingBottom: 40 }}>
        {CUISINES.map((c) => (
          <section key={c.slug} id={c.slug} className="menu-section" aria-labelledby={`h-${c.slug}`}>
            <div className="menu-head reveal">
              <h2 id={`h-${c.slug}`}>{c.name}</h2>
              <Link className="link-more" href={`/${c.slug}/`}>More about {c.name}</Link>
            </div>
            <div className="menu-banner reveal">
              <img src={c.heroImage.src} width={c.heroImage.w} height={c.heroImage.h} alt={c.heroImage.alt} loading="lazy" decoding="async" />
            </div>
            <div className="reveal"><DishList dishes={byCuisine(c.cuisine)} /></div>
          </section>
        ))}
      </div>
      <CtaBand title="Found what you like?" text="Send us the dishes and quantities. We’ll reply with a custom quote." />
    </>
  );
}
