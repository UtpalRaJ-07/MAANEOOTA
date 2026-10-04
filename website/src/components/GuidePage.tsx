import Link from "next/link";
import type { Guide } from "@/data/guides";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/meta";
import { guideSeo } from "@/lib/seo-strings";

export function GuidePage({ guide }: { guide: Guide }) {
  const seo = guideSeo(guide);
  const ld = breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }, { name: guide.title, path: seo.path }]);
  return (
    <>
      <JsonLd data={ld} />
      <section className="hero compact">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">›</span>
            <Link href="/guides/">Guides</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{guide.title}</span>
          </nav>
          <p className="eyebrow">Ordering guide</p>
          <h1 className="display sm">{guide.title}</h1>
          <p className="lead">{guide.intro}</p>
        </div>
      </section>
      <section className="section tight-top">
        <div className="wrap">
          <div className="prose reveal" style={{ maxWidth: 720, margin: "0 auto" }}>
            {guide.body.map((para, i) => <p key={i}>{para}</p>)}
            <p style={{ marginTop: 28 }}>
              {guide.relatedLinks.map((r, i) => (
                <span key={r.href}>{i > 0 ? " · " : ""}<Link className="link-more" href={r.href}>{r.label}</Link></span>
              ))}
            </p>
          </div>
        </div>
      </section>
      <CtaBand alt title="Ready to order?" text="Tell us the dishes, quantity, date and area, and we'll send a custom quote." />
    </>
  );
}
