import Link from "next/link";
import type { Dish } from "@/data/dishes";
import { DishCard, DishList } from "./DishCard";
import { DietLegend } from "./DietMark";
import { Steps } from "./Steps";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { HIGH_PRIORITY, breadcrumbLd, type WideImage } from "@/lib/meta";

export function CuisinePage(props: {
  cuisineSlug?: string; path: string; crumb: string; eyebrow: string; title: string; lead: string; image: WideImage;
  dishes: Dish[]; heading: string; sub: string; faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
}) {
  const withImage = props.dishes.filter((d) => d.image);
  const rest = props.dishes.filter((d) => !d.image);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: props.crumb, path: props.path }])} />
      <section className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">{props.crumb}</span></nav>
          <p className="eyebrow">{props.eyebrow}</p>
          <h1 className="display sm">{props.title}</h1>
          <p className="lead">{props.lead}</p>
          <div className="cta-row">
            <Link className="pill" href="/enquire/">Get a custom quote</Link>
            <Link className="link-more" href="/menu/">Full menu</Link>
          </div>
        </div>
        <div className="hero-media">
          <div className="frame"><img src={props.image.src} width={props.image.w} height={props.image.h} alt={props.image.alt} {...HIGH_PRIORITY} /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">{props.heading}</h2>
          <p className="sub reveal">{props.sub}</p>
          <DietLegend />
          <div className={`grid ${withImage.length === 3 ? "three" : ""}`} style={{ textAlign: "left" }}>
            {withImage.map((d) => <DishCard key={d.slug} dish={d} />)}
          </div>
          {rest.length > 0 && (
            <div style={{ textAlign: "left", marginTop: 72 }}>
              <h3 className="reveal" style={{ fontSize: 28, letterSpacing: "-.03em" }}>Also on the menu</h3>
              <div className="reveal"><DishList dishes={rest} /></div>
            </div>
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">How ordering works.</h2>
          <p className="sub reveal">No online booking. Every order gets a custom quote.</p>
          <div style={{ textAlign: "left" }}><Steps /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">Good to know.</h2>
          <Faq items={props.faq} />
          <div className="cta-row reveal">
            {props.related.map((r) => <Link key={r.href} className="link-more" href={r.href}>{r.label}</Link>)}
          </div>
        </div>
      </section>

      <CtaBand alt />
    </>
  );
}
