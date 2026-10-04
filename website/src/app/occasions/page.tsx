import Link from "next/link";
import { publishedOccasions } from "@/data/occasions";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Occasions We Cater in Bengaluru",
  description: "Bulk food for office lunches, family functions, festivals and large gatherings across Bengaluru. See typical orders and get a custom quote.",
  path: "/occasions/",
});

export default function Occasions() {
  const occasions = publishedOccasions();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Occasions", path: "/occasions/" }])} />
      <section className="hero compact">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Occasions</span></nav>
          <p className="eyebrow">Occasions</p>
          <h1 className="display sm">Food for every occasion.</h1>
          <p className="lead">From office lunches to festivals and family functions, we cook to your headcount. Pick the occasion closest to yours.</p>
        </div>
      </section>
      <section className="section tight-top">
        <div className="wrap">
          <div className="cards3" style={{ textAlign: "left" }}>
            {occasions.map((o) => (
              <div className="reveal" key={o.slug}>
                <Link className="card" href={`/occasions/${o.slug}/`}>
                  <div className="card-body">
                    <h3>{o.name}</h3>
                    <p>{o.shortDescription}</p>
                    <span className="link-more">See details</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand alt />
    </>
  );
}
