import Link from "next/link";
import { notFound } from "next/navigation";
import { AREAS, areaBySlug, areasInZone, zoneName } from "@/data/areas";
import { publishedAreaCuisine } from "@/data/area-cuisine";
import { cuisineByKey } from "@/data/cuisines";
import { SITE } from "@/data/site";
import { Steps } from "@/components/Steps";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { HIGH_PRIORITY, WIDE, breadcrumbLd, pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export function generateMetadata({ params }: { params: { area: string } }) {
  const a = areaBySlug(params.area);
  if (!a) return {};
  return pageMeta({
    title: `Bulk Biryani & Food Orders in ${a.name}, Bengaluru`,
    description: `Order biryani by the kilo and North & South Indian dishes in bulk in ${a.name}, Bengaluru. For homes, offices and functions. Tell us what you need and get a custom quote.`,
    path: `/bengaluru/${a.slug}/`,
  });
}

const CUISINES = [
  { href: "/biryani/", img: "/images/chicken-biryani.jpg", t: "Biryani", d: "Chicken, mutton, Donne, egg, paneer and veg, by the kg." },
  { href: "/north-indian/", img: "/images/butter-chicken.jpg", t: "North Indian", d: "Butter chicken, paneer, dal makhani, chole and chapatis." },
  { href: "/south-indian/", img: "/images/bisi-bele-bath.jpg", t: "South Indian", d: "Bisi bele bath, chitranna, idli, vada, sambar and more." },
];

export default function AreaPage({ params }: { params: { area: string } }) {
  const a = areaBySlug(params.area);
  if (!a) notFound();
  const zone = zoneName(a.zone);
  const nearby = areasInZone(a.zone).filter((x) => x.slug !== a.slug);
  const path = `/bengaluru/${a.slug}/`;
  const quote = `/enquire/?area=${a.slug}`;

  const localCuisines = publishedAreaCuisine()
    .filter((e) => e.areaSlug === a.slug)
    .map((e) => cuisineByKey(e.cuisine)!)
    .filter(Boolean);

  const faq = [
    { q: `Do you deliver bulk food to ${a.name}?`, a: `Yes. We take orders from ${a.name} and across ${zone}. Share your exact address when you enquire and we’ll confirm delivery with your quote.` },
    { q: `Can I order just 1 or 2 kg of biryani in ${a.name}?`, a: "Yes. Small orders like 1 or 2 kg are welcome, as are large orders for functions and offices." },
    { q: "How much will my order cost?", a: "Every order gets a custom quote based on the dishes, quantity, date and delivery location. There’s no fixed price list." },
    { q: "How do I place an order?", a: "This website doesn’t take bookings. Send an enquiry with what you need, and we’ll reply with a price and confirm the order with you directly." },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Bengaluru", path: "/bengaluru/" }, { name: a.name, path }]),
      {
        "@type": "Service",
        name: `Bulk food orders in ${a.name}, Bengaluru`,
        serviceType: "Bulk food and biryani orders",
        provider: { "@type": "FoodEstablishment", name: SITE.name, url: SITE.url + "/" },
        areaServed: { "@type": "Place", name: `${a.name}, Bengaluru, Karnataka` },
        url: SITE.url + path,
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
            <Link href="/bengaluru/">Bengaluru</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{a.name}</span>
          </nav>
          <p className="eyebrow">{zone}</p>
          <h1 className="display sm">Bulk food orders in {a.name}.</h1>
          <p className="lead">
            Biryani by the kilo, North Indian curries and South Indian favourites for homes, offices and functions in {a.name}, Bengaluru.
            Every order gets a custom quote.
          </p>
          {a.aka && <p className="fine" style={{ marginTop: 12 }}>Also known as {a.aka.join(", ")}.</p>}
          <div className="cta-row">
            <Link className="pill" href={quote}>Get a quote for {a.name}</Link>
            <Link className="link-more" href="/menu/">See the menu</Link>
          </div>
        </div>
        <div className="hero-media">
          <div className="frame">
            <img src={WIDE.heroBiryani.src} width={WIDE.heroBiryani.w} height={WIDE.heroBiryani.h} alt={WIDE.heroBiryani.alt} {...HIGH_PRIORITY} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">What you can order in {a.name}.</h2>
          <p className="sub reveal">Cooked fresh for your date, in the quantity you need.</p>
          <div className="cards3" style={{ textAlign: "left" }}>
            {CUISINES.map((c) => (
              <div className="reveal" key={c.href}>
                <Link className="card" href={c.href}>
                  <img src={c.img} alt="" width={800} height={600} loading="lazy" decoding="async" />
                  <div className="card-body">
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                    <span className="link-more">Explore {c.t}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">How ordering works.</h2>
          <p className="sub reveal">No online booking. Just tell us what you need.</p>
          <div style={{ textAlign: "left" }}><Steps /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">Questions from {a.name}.</h2>
          <Faq items={faq} />
        </div>
      </section>

      {localCuisines.length > 0 && (
        <section className="section">
          <div className="wrap center">
            <h2 className="h2 reveal">Also available in {a.name}.</h2>
            <p className="sub reveal">Dedicated {a.name} pages for these menus.</p>
            <div className="area-chips reveal">
              {localCuisines.map((c) => (
                <Link key={c.slug} href={`/bengaluru/${a.slug}/${c.slug}/`}>{c.name} in {a.name}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal" style={{ fontSize: "clamp(30px, 4.4vw, 48px)" }}>More areas in {zone}.</h2>
          <div className="area-chips reveal">
            {nearby.map((n) => <Link key={n.slug} href={`/bengaluru/${n.slug}/`}>{n.name}</Link>)}
          </div>
          <div className="cta-row reveal"><Link className="link-more" href="/bengaluru/">All areas in Bengaluru</Link></div>
        </div>
      </section>

      <CtaBand href={quote} title={`Planning something in ${a.name}?`} />
    </>
  );
}
