import Link from "next/link";
import type { Occasion } from "@/data/occasions";
import { DISHES } from "@/data/dishes";
import { SITE } from "@/data/site";
import { DishList } from "./DishCard";
import { Faq } from "./Faq";
import { Steps } from "./Steps";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { HIGH_PRIORITY, WIDE, breadcrumbLd } from "@/lib/meta";
import { occasionSeo } from "@/lib/seo-strings";

export function OccasionPage({ occasion }: { occasion: Occasion }) {
  const seo = occasionSeo(occasion);
  const quote = `/enquire/?occasion=${occasion.slug}`;
  const dishes = occasion.recommendedDishSlugs.map((s) => DISHES.find((d) => d.slug === s)).filter(Boolean) as typeof DISHES;
  const ld = breadcrumbLd([{ name: "Home", path: "/" }, { name: "Occasions", path: "/occasions/" }, { name: occasion.name, path: seo.path }]);

  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">›</span>
            <Link href="/occasions/">Occasions</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{occasion.name}</span>
          </nav>
          <p className="eyebrow">{occasion.eyebrow}</p>
          <h1 className="display sm">{occasion.name}</h1>
          <p className="lead">{occasion.intro}</p>
          <div className="cta-row">
            <Link className="pill" href={quote}>Get a quote</Link>
            <Link className="link-more" href="/menu/">See the menu</Link>
          </div>
        </div>
        <div className="hero-media"><div className="frame">
          <img src={WIDE.buffet.src} width={WIDE.buffet.w} height={WIDE.buffet.h} alt={WIDE.buffet.alt} {...HIGH_PRIORITY} />
        </div></div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="h2 reveal center">{occasion.workedExample.title}</h2>
          <p className="sub reveal center">A typical order for about {occasion.workedExample.headcount} guests.</p>
          <div className="reveal" style={{ maxWidth: 720, margin: "40px auto 0" }}>
            <ul className="menu-list" style={{ gridTemplateColumns: "1fr" }}>
              {occasion.workedExample.lines.map((line) => (
                <li key={line} style={{ gridTemplateColumns: "1fr" }}><div><h3 style={{ fontWeight: 500 }}>{line}</h3></div></li>
              ))}
            </ul>
            <p className="fine" style={{ marginTop: 16 }}>{occasion.workedExample.notes}</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">Dishes that work well.</h2>
          <p className="sub reveal">A good starting point — mix and match for your {occasion.name.toLowerCase()}.</p>
          <div className="reveal" style={{ textAlign: "left", marginTop: 40 }}><DishList dishes={dishes} /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">How ordering works.</h2>
          <div style={{ textAlign: "left" }}><Steps /></div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">Good to know.</h2>
          <Faq items={occasion.faq} />
        </div>
      </section>

      <CtaBand href={quote} title={`Planning ${occasion.name.toLowerCase()}?`} />
    </>
  );
}
