import Link from "next/link";
import { publishedGuides } from "@/data/guides";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Bulk Food Ordering Guides for Bengaluru",
  description: "Practical guides for ordering bulk food in Bengaluru: how much biryani per guest, planning for a headcount, and veg vs non-veg quantities.",
  path: "/guides/",
});

export default function Guides() {
  const guides = publishedGuides();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }])} />
      <section className="hero compact">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Guides</span></nav>
          <p className="eyebrow">Guides</p>
          <h1 className="display sm">Plan your order with confidence.</h1>
          <p className="lead">Short, practical guides to help you order the right dishes and the right quantities for your gathering.</p>
        </div>
      </section>
      <section className="section tight-top">
        <div className="wrap">
          <div className="cards3" style={{ textAlign: "left" }}>
            {guides.map((g) => (
              <div className="reveal" key={g.slug}>
                <Link className="card" href={`/guides/${g.slug}/`}>
                  <div className="card-body">
                    <h3>{g.title}</h3>
                    <p>{g.description}</p>
                    <span className="link-more">Read guide</span>
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
