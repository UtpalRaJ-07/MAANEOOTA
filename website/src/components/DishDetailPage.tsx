import Link from "next/link";
import { type Dish, unitLabel } from "@/data/dishes";
import type { CuisineDef } from "@/data/cuisines";
import { SITE } from "@/data/site";
import { DietMark } from "./DietMark";
import { RelatedDishes } from "./RelatedDishes";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { HIGH_PRIORITY, breadcrumbLd } from "@/lib/meta";
import { dishSeo } from "@/lib/seo-strings";

export function DishDetailPage({ dish, cuisine }: { dish: Dish; cuisine: CuisineDef }) {
  const seo = dishSeo(dish, cuisine);
  const hero = dish.image ?? cuisine.heroImage.src;
  const quote = `/enquire/?dish=${dish.slug}`;
  const dietLabel = dish.diet === "veg" ? "Vegetarian" : "Non-vegetarian";

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([{ name: "Home", path: "/" }, { name: cuisine.name, path: `/${cuisine.slug}/` }, { name: dish.name, path: seo.path }]),
      {
        "@type": "MenuItem",
        name: dish.name,
        description: dish.longDescription,
        menuAddOn: undefined,
        suitableForDiet: dish.diet === "veg" ? "https://schema.org/VegetarianDiet" : undefined,
        offers: undefined, // no fabricated prices — every order is a custom quote
        url: SITE.url + seo.path,
      },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">›</span>
            <Link href={`/${cuisine.slug}/`}>{cuisine.name}</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{dish.name}</span>
          </nav>
          <p className="eyebrow">{cuisine.name}</p>
          <h1 className="display sm">{seo.h1}</h1>
          <p className="lead">{dish.longDescription}</p>
          <p className="legend" style={{ justifyContent: "flex-start" }}>
            <span><DietMark diet={dish.diet} /> {dietLabel}</span>
            <span>{unitLabel(dish.unit)}</span>
          </p>
          {dish.aka && dish.aka.length > 0 && <p className="fine">Also known as {dish.aka.join(", ")}.</p>}
          <div className="cta-row">
            <Link className="pill" href={quote}>Get a quote for {dish.name}</Link>
            <Link className="link-more" href={`/${cuisine.slug}/`}>All {cuisine.name.toLowerCase()}</Link>
          </div>
        </div>
        <div className="hero-media">
          <div className="frame">
            <img src={hero} width={1600} height={1067} alt={dish.name} {...HIGH_PRIORITY} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">You might also like.</h2>
          <p className="sub reveal">More dishes that go well in the same order.</p>
          <RelatedDishes dish={dish} />
        </div>
      </section>

      <CtaBand href={quote} title={`Planning an order with ${dish.name}?`} />
    </>
  );
}
