import Link from "next/link";
import { AREAS, ZONES, areasInZone } from "@/data/areas";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Bulk Food Delivery Areas in Bengaluru",
  description: `Bulk biryani and home-style food orders in ${AREAS.length} areas across North, South, East, West, Central and Outer Bengaluru (Bangalore). Find your area and get a custom quote.`,
  path: "/bengaluru/",
});

export default function AreasIndex() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Bengaluru", path: "/bengaluru/" }])} />
      <section className="hero compact">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Bengaluru</span></nav>
          <p className="eyebrow">Areas we serve</p>
          <h1 className="display sm">Every corner of Bengaluru.</h1>
          <p className="lead">Choose your area to see what you can order there. Don’t see yours? Enquire anyway. We take orders from across the city.</p>
          <div className="cta-row"><Link className="pill" href="/enquire/">Get a custom quote</Link></div>
        </div>
      </section>
      <nav className="subnav" aria-label="Zones">
        <ul>{ZONES.map((z) => <li key={z.id}><a href={`#${z.id}`}>{z.name}</a></li>)}</ul>
      </nav>
      <section className="section tight-top">
        <div className="wrap">
          {ZONES.map((z) => {
            const list = areasInZone(z.id);
            return (
              <div key={z.id} id={z.id} className="zone-block">
                <h2 className="reveal">{z.name}</h2>
                <p className="count reveal">{list.length} areas</p>
                <ul className="area-cols reveal">
                  {list.map((a) => <li key={a.slug}><Link href={`/bengaluru/${a.slug}/`}>{a.name}</Link></li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      <CtaBand alt />
    </>
  );
}
