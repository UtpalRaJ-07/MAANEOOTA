import Link from "next/link";
import type { AreaCuisineEntry } from "@/data/area-cuisine";
import type { Area } from "@/data/areas";
import type { CuisineDef } from "@/data/cuisines";
import { byCuisine } from "@/data/dishes";
import { zoneName } from "@/data/areas";
import { SITE } from "@/data/site";
import { DishList } from "./DishCard";
import { Faq } from "./Faq";
import { Steps } from "./Steps";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { HIGH_PRIORITY, breadcrumbLd } from "@/lib/meta";
import { areaCuisineSeo } from "@/lib/seo-strings";

export function AreaCuisinePage({ entry, area, cuisine }: { entry: AreaCuisineEntry; area: Area; cuisine: CuisineDef }) {
  const seo = areaCuisineSeo(entry, area, cuisine);
  const dishes = byCuisine(cuisine.cuisine);
  const rep = dishes.find((d) => d.featured) ?? dishes[0];
  const quote = `/enquire/?area=${area.slug}${rep ? `&dish=${rep.slug}` : ""}`;
  const faq = entry.faq ?? [
    { q: `Do you deliver ${cuisine.name.toLowerCase()} in ${area.name}?`, a: `Yes. We take ${cuisine.name.toLowerCase()} orders across ${area.name} and ${zoneName(area.zone)}. Share your address when you enquire and we'll confirm delivery with your quote.` },
    { q: "How is the price decided?", a: "Every order gets a custom quote based on the dishes, quantity, date and delivery location. There's no fixed price list." },
  ];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Bengaluru", path: "/bengaluru/" }, { name: area.name, path: `/bengaluru/${area.slug}/` }, { name: cuisine.name, path: seo.path }]),
      { "@type": "Service", name: `${cuisine.name} orders in ${area.name}, Bengaluru`, serviceType: `Bulk ${cuisine.name} orders`, provider: { "@type": "FoodEstablishment", name: SITE.name, url: SITE.url + "/" }, areaServed: { "@type": "Place", name: `${area.name}, Bengaluru, Karnataka` }, url: SITE.url + seo.path },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">›</span>
            <Link href="/bengaluru/">Bengaluru</Link><span aria-hidden="true">›</span>
            <Link href={`/bengaluru/${area.slug}/`}>{area.name}</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{cuisine.name}</span>
          </nav>
          <p className="eyebrow">{cuisine.name} in {area.name}</p>
          <h1 className="display sm">{seo.h1}</h1>
          <p className="lead">{entry.extraParagraph}</p>
          <div className="cta-row">
            <Link className="pill" href={quote}>Get a quote for {area.name}</Link>
            <Link className="link-more" href={`/${cuisine.slug}/`}>All {cuisine.name.toLowerCase()}</Link>
          </div>
        </div>
        <div className="hero-media"><div className="frame">
          <img src={cuisine.heroImage.src} width={cuisine.heroImage.w} height={cuisine.heroImage.h} alt={cuisine.heroImage.alt} {...HIGH_PRIORITY} />
        </div></div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">{cuisine.name} you can order in {area.name}.</h2>
          <p className="sub reveal">Cooked fresh for your date, in the quantity you need.</p>
          <div className="reveal" style={{ textAlign: "left", marginTop: 40 }}><DishList dishes={dishes} /></div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">How ordering works.</h2>
          <div style={{ textAlign: "left" }}><Steps /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">Questions from {area.name}.</h2>
          <Faq items={faq} />
          <div className="cta-row reveal">
            <Link className="link-more" href={`/bengaluru/${area.slug}/`}>All food in {area.name}</Link>
            <Link className="link-more" href={`/${cuisine.slug}/`}>{cuisine.name} across Bengaluru</Link>
          </div>
        </div>
      </section>

      <CtaBand href={quote} title={`Planning ${cuisine.name.toLowerCase()} in ${area.name}?`} />
    </>
  );
}
