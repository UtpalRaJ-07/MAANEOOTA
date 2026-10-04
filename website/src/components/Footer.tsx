import Link from "next/link";
import { HAS_PHONE, HAS_WHATSAPP, SITE, telLink, waLink } from "@/data/site";
import { CUISINES, cuisineSlug } from "@/data/cuisines";
import { DISHES } from "@/data/dishes";
import { publishedOccasions } from "@/data/occasions";
import { publishedGuides } from "@/data/guides";

// Curated, not exhaustive: a handful of popular dishes, not all 78.
const POPULAR = ["chicken-biryani", "mutton-biryani", "veg-biryani", "butter-chicken", "paneer-butter-masala", "bisi-bele-bath"];

export function Footer() {
  const hasContact = HAS_PHONE || HAS_WHATSAPP || SITE.email || SITE.instagram;
  const popular = POPULAR.map((s) => DISHES.find((d) => d.slug === s)).filter(Boolean) as typeof DISHES;
  const occasions = publishedOccasions();
  const guides = publishedGuides().slice(0, 4);
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="footer-note">
          Every order is cooked to your requirement and priced with a custom quote. This website doesn’t take bookings or payments.
          Food photos are illustrative.
        </p>
        <div className="footer-cols">
          <div>
            <h2>Food</h2>
            <ul>
              <li><Link href="/menu/">Full menu</Link></li>
              {CUISINES.map((c) => <li key={c.slug}><Link href={`/${c.slug}/`}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2>Popular dishes</h2>
            <ul>
              {popular.map((d) => <li key={d.slug}><Link href={`/${cuisineSlug(d.cuisine)}/${d.slug}/`}>{d.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2>Occasions</h2>
            <ul>
              {occasions.map((o) => <li key={o.slug}><Link href={`/occasions/${o.slug}/`}>{o.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2>Guides</h2>
            <ul>
              {guides.map((g) => <li key={g.slug}><Link href={`/guides/${g.slug}/`}>{g.title}</Link></li>)}
              <li><Link href="/guides/">All guides</Link></li>
            </ul>
          </div>
          <div>
            <h2>Areas</h2>
            <ul>
              <li><Link href="/bengaluru/">All areas</Link></li>
              <li><Link href="/bengaluru/#north">North Bengaluru</Link></li>
              <li><Link href="/bengaluru/#south">South Bengaluru</Link></li>
              <li><Link href="/bengaluru/#east">East Bengaluru</Link></li>
              <li><Link href="/bengaluru/#west">West Bengaluru</Link></li>
            </ul>
          </div>
          <div>
            <h2>MAANE OOTA</h2>
            <ul>
              <li><Link href="/about/">About us</Link></li>
              <li><Link href="/enquire/">Get a quote</Link></li>
              <li><Link href="/credits/">Photo credits</Link></li>
              {HAS_PHONE && <li><a href={telLink()}>{SITE.phone}</a></li>}
              {HAS_WHATSAPP && <li><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
              {SITE.email && <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
              {SITE.instagram && <li><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
              {!hasContact && <li><Link href="/enquire/">Send an enquiry</Link></li>}
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} MAANE OOTA. Bengaluru, Karnataka.</span>
          <span>Home-style food, cooked to order.</span>
        </div>
      </div>
    </footer>
  );
}
