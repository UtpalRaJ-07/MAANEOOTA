import Link from "next/link";
import { DISHES, byCuisine } from "@/data/dishes";
import { AREAS, FEATURED_AREAS, ZONES, areaBySlug } from "@/data/areas";
import { publishedOccasions } from "@/data/occasions";
import { SITE, HAS_PHONE } from "@/data/site";
import { DishCard } from "@/components/DishCard";
import { DietLegend } from "@/components/DietMark";
import { Steps } from "@/components/Steps";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { HIGH_PRIORITY, WIDE, pageMeta } from "@/lib/meta";
// Opening brand film styles: homepage only (see components/brand-intro/config.ts).
import "@/components/brand-intro/brand-intro.css";

export const metadata = pageMeta({
  title: "MAANE OOTA — Bulk Biryani & Home-Style Food Orders in Bengaluru",
  absoluteTitle: true,
  description: "Order biryani by the kilo and North & South Indian dishes in bulk anywhere in Bengaluru (Bangalore). For homes, offices and functions. Enquire for a custom quote.",
  path: "/",
});

const FAVOURITES = ["butter-chicken", "paneer-butter-masala", "dal-makhani", "kadai-chicken", "bisi-bele-bath", "idli", "medu-vada", "gulab-jamun"];


const FAQ = [
  { q: "Can I book or pay on this website?", a: "No. This website is for enquiries only. Send us your requirement and we’ll reply with a custom quote. You then confirm the order directly with us." },
  { q: "Can I order just 1 or 2 kg?", a: "Yes. You can enquire for small quantities like 1 kg or 2 kg of biryani, as well as large orders for functions and offices." },
  { q: "How is the price decided?", a: "Every quote is based on the dishes, the quantity, your date and your delivery location. Tell us what you need and we’ll give you the exact price for your order." },
  { q: "Do you deliver to my area?", a: "We take orders from across Bengaluru. Share your area when you enquire and we’ll confirm delivery in your quote." },
  { q: "Do you cook both veg and non-veg?", a: "Yes. Every dish on the menu is marked veg or non-veg. If you need a vegetarian-only order, just mention it in your enquiry." },
  { q: "How early should I enquire?", a: "The earlier the better, especially for large orders and festival dates. Tell us your date and we’ll confirm availability with your quote." },
];

export default function Home() {
  const biryani = byCuisine("biryani").filter((d) => d.image).slice(0, 3);
  const favourites = FAVOURITES.map((s) => DISHES.find((d) => d.slug === s)!).filter(Boolean);
  const occasions = publishedOccasions();
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: SITE.name, url: SITE.url + "/" },
      {
        "@type": "FoodEstablishment",
        name: SITE.name,
        url: SITE.url + "/",
        image: SITE.url + WIDE.heroBiryani.src,
        description: "Bulk biryani, North Indian and South Indian food orders by custom quote in Bengaluru.",
        servesCuisine: ["Biryani", "North Indian", "South Indian", "Karnataka", "Indian sweets"],
        areaServed: { "@type": "City", name: "Bengaluru" },
        ...(HAS_PHONE ? { telephone: SITE.phone } : {}),
      },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Bulk food orders · Bengaluru</p>
          <h1 className="display">Food that tastes like home. By the kilo.</h1>
          <p className="lead">Biryani, North Indian curries and South Indian favourites, cooked fresh for your family, office or function. Tell us what you need and we’ll send a custom quote.</p>
          <div className="cta-row">
            <Link className="pill" href="/enquire/">Get a custom quote</Link>
            <Link className="link-more" href="/menu/">Explore the menu</Link>
          </div>
        </div>
        <div className="hero-media">
          <div className="frame">
            <img src={WIDE.heroBiryani.src} width={WIDE.heroBiryani.w} height={WIDE.heroBiryani.h} alt={WIDE.heroBiryani.alt} {...HIGH_PRIORITY} />
          </div>
        </div>
      </section>

      <section className="section dark" style={{ marginTop: 120 }}>
        <div className="wrap center">
          <p className="eyebrow reveal">Biryani</p>
          <h2 className="h2 reveal">Order it by the kilo.</h2>
          <p className="sub reveal">Chicken, mutton, Donne, egg, paneer and veg biryani. From a 1 kg family dinner to a big order for a function, priced for your exact quantity.</p>
          <div className="sizes reveal" aria-label="Order sizes">
            {["1 kg", "2 kg", "5 kg", "10 kg", "Larger orders"].map((s) => <span className="size" key={s}>{s}</span>)}
          </div>
          <div className="grid three" style={{ textAlign: "left" }}>
            {biryani.map((d) => <DishCard key={d.slug} dish={d} />)}
          </div>
          <div className="cta-row reveal">
            <Link className="link-more" href="/biryani/">See all biryani</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">Two cuisines. Cooked the way home does.</h2>
          <p className="sub reveal">Rich North Indian gravies and breads. South Indian rice dishes, tiffin and Karnataka favourites.</p>
          <div className="tiles" style={{ textAlign: "left" }}>
            <Link href="/north-indian/" className="tile reveal">
              <img src={WIDE.northThali.src} width={WIDE.northThali.w} height={WIDE.northThali.h} alt={WIDE.northThali.alt} loading="lazy" decoding="async" />
              <div className="tile-body">
                <p className="tile-eyebrow">North Indian</p>
                <h3>Butter chicken, paneer, dal and more.</h3>
                <span className="link-more">Explore North Indian</span>
              </div>
            </Link>
            <Link href="/south-indian/" className="tile reveal">
              <img src={WIDE.southLeaf.src} width={WIDE.southLeaf.w} height={WIDE.southLeaf.h} alt={WIDE.southLeaf.alt} loading="lazy" decoding="async" />
              <div className="tile-body">
                <p className="tile-eyebrow">South Indian</p>
                <h3>Bisi bele bath, idli, vada and more.</h3>
                <span className="link-more">Explore South Indian</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">Made fresh for every order.</h2>
          <p className="sub reveal">A few favourites from our kitchen. See the full menu for everything we cook.</p>
          <DietLegend />
          <div className="grid" style={{ textAlign: "left" }}>
            {favourites.map((d) => <DishCard key={d.slug} dish={d} />)}
          </div>
          <div className="cta-row reveal"><Link className="link-more" href="/menu/">See the full menu</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">No booking. Just a quote.</h2>
          <p className="sub reveal">The website doesn’t take orders. You tell us what you want, and we price it for you.</p>
          <div style={{ textAlign: "left" }}><Steps /></div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">Planning something specific?</h2>
          <p className="sub reveal">Whether it&rsquo;s an office lunch, a family function or a festival, we&rsquo;ll plan the quantities with you.</p>
          <div className="cards3" style={{ textAlign: "left", marginTop: 48 }}>
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
          <div className="cta-row reveal">
            <Link className="link-more" href="/occasions/">All occasions</Link>
            <Link className="link-more" href="/guides/">Ordering guides</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">Delivered across Bengaluru.</h2>
          <p className="sub reveal">From Yelahanka to Electronic City, Whitefield to Kengeri. Find your area.</p>
          <div className="zones" style={{ textAlign: "left" }}>
            {ZONES.map((z) => (
              <div className="zone reveal" key={z.id}>
                <h3><Link href={`/bengaluru/#${z.id}`}>{z.name}</Link></h3>
                <ul>
                  {FEATURED_AREAS[z.id].map((s) => {
                    const a = areaBySlug(s)!;
                    return <li key={s}><Link href={`/bengaluru/${s}/`}>{a.name}</Link></li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="cta-row reveal"><Link className="link-more" href="/bengaluru/">See all {AREAS.length} areas</Link></div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap center">
          <h2 className="h2 reveal">Questions, answered.</h2>
          <Faq items={FAQ} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
