import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { WIDE, pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "About MAANE OOTA — Home Food, Cooked in Bulk",
  description: "MAANE OOTA means home food in Kannada. We cook biryani, North Indian and South Indian dishes in bulk for homes, offices and functions across Bengaluru.",
  path: "/about/",
  image: WIDE.southLeaf.src,
});

const VALUES = [
  { t: "Cooked to order", d: "Your food is prepared for your date and your quantity, not taken from a counter." },
  { t: "Priced for your order", d: "No fixed price list. Every enquiry gets a quote for exactly what you asked for." },
  { t: "Across Bengaluru", d: "We take orders from North, South, East, West, Central and Outer Bengaluru." },
];

export default function About() {
  return (
    <>
      <section className="hero compact">
        <div className="wrap">
          <p className="eyebrow">About us</p>
          <h1 className="display sm">MAANE OOTA means home food.</h1>
          <p className="lead">In Kannada, <em>maane</em> is home and <em>oota</em> is a meal. That idea is behind everything we cook.</p>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div className="split-media reveal">
            <img src={WIDE.southLeaf.src} width={WIDE.southLeaf.w} height={WIDE.southLeaf.h} alt={WIDE.southLeaf.alt} loading="lazy" decoding="async" />
          </div>
          <div className="prose">
            <h2 className="h2 reveal">Food that tastes like home, even for a crowd.</h2>
            <p className="reveal">We cook biryani, North Indian curries and breads, and South Indian and Karnataka dishes in bulk. That can be a couple of kilos for a family dinner or a large order for a function or office.</p>
            <p className="reveal">We don’t have a booking app or a fixed price list. Every order is different, so every order gets its own quote, based on what you want, how much, when and where.</p>
            <p className="reveal"><Link className="link-more" href="/menu/">See what we cook</Link></p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap center">
          <h2 className="h2 reveal">How we work.</h2>
          <div className="cards3" style={{ textAlign: "left" }}>
            {VALUES.map((v) => (
              <div className="reveal" key={v.t}>
                <div className="card"><div className="card-body"><h3>{v.t}</h3><p>{v.d}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand alt />
    </>
  );
}
