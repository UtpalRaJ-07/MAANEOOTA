import Link from "next/link";
import { HAS_PHONE, HAS_WHATSAPP, SITE, telLink, waLink } from "@/data/site";

export function CtaBand({
  title = "Tell us what you’re planning.",
  text = "Share the dishes, quantity, date and area. We’ll reply with a custom quote.",
  href = "/enquire/",
  alt = false,
}: { title?: string; text?: string; href?: string; alt?: boolean }) {
  return (
    <section className={`section${alt ? " alt" : ""}`}>
      <div className="wrap center">
        <h2 className="h2 reveal">{title}</h2>
        <p className="sub reveal">{text}</p>
        <div className="cta-row reveal">
          <Link className="pill" href={href}>Get a custom quote</Link>
          {HAS_WHATSAPP && (
            <a className="link-more" href={waLink("Hi MAANE OOTA, I'd like a quote for an order.")} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          )}
          {HAS_PHONE && <a className="link-more" href={telLink()}>Call {SITE.phone}</a>}
        </div>
      </div>
    </section>
  );
}
