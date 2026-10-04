// Single source of truth for page titles, meta descriptions and H1s.
// BOTH the page templates AND the build-time content validator import these,
// so "every page follows one consistent pattern" (Req 8) is guaranteed by
// shared code, and the validator checks the exact strings pages will emit.
import type { Dish } from "@/data/dishes";
import type { CuisineDef } from "@/data/cuisines";
import type { Area } from "@/data/areas";
import type { Occasion } from "@/data/occasions";
import type { Guide } from "@/data/guides";
import type { AreaCuisineEntry } from "@/data/area-cuisine";

export interface Seo { title: string; description: string; h1: string; path: string }

const CITY = "Bengaluru";

export function cuisineHubSeo(c: CuisineDef): Seo {
  return {
    title: `${c.name} in Bulk in ${CITY} — Order by the Kg`,
    description: `${c.lead} Tell us what you need and get a custom quote.`.slice(0, 300),
    h1: c.title,
    path: `/${c.slug}/`,
  };
}

export function dishSeo(d: Dish, c: CuisineDef): Seo {
  return {
    title: `${d.name} in Bulk in ${CITY} — ${c.name} Orders`,
    description: `Order ${d.name.toLowerCase()} in bulk anywhere in ${CITY}. ${d.desc} Get a custom quote for your quantity.`.slice(0, 300),
    h1: `${d.name} in ${CITY}`,
    path: `/${c.slug}/${d.slug}/`,
  };
}

export function areaSeo(a: Area): Seo {
  return {
    title: `Bulk Biryani & Food Orders in ${a.name}, ${CITY}`,
    description: `Order biryani by the kilo and North & South Indian dishes in bulk in ${a.name}, ${CITY}. For homes, offices and functions. Tell us what you need and get a custom quote.`,
    h1: `Bulk food orders in ${a.name}.`,
    path: `/bengaluru/${a.slug}/`,
  };
}

export function areaCuisineSeo(e: AreaCuisineEntry, a: Area, c: CuisineDef): Seo {
  return {
    title: `${c.name} in ${a.name}, ${CITY} — Bulk Orders`,
    description: `Order ${c.name.toLowerCase()} in bulk in ${a.name}, ${CITY}. ${c.intro} Cooked fresh for your date, priced with a custom quote.`.slice(0, 300),
    h1: `${c.name} in ${a.name}`,
    path: `/bengaluru/${a.slug}/${c.slug}/`,
  };
}

export function occasionSeo(o: Occasion): Seo {
  return {
    title: `${o.name} in ${CITY} — Bulk Food Catering`,
    description: `${o.shortDescription} Tell us your headcount and date, and get a custom quote.`.slice(0, 300),
    h1: o.name,
    path: `/occasions/${o.slug}/`,
  };
}

export function guideSeo(g: Guide): Seo {
  return {
    title: `${g.title} | ${CITY} Bulk Food Guide`,
    description: g.description,
    h1: g.title,
    path: `/guides/${g.slug}/`,
  };
}

// Static pages that don't come from a data list, listed so the validator can
// include them in the sitewide uniqueness check.
export const STATIC_SEO: Seo[] = [
  { title: "MAANE OOTA — Bulk Biryani & Home-Style Food Orders in Bengaluru", description: "Order biryani by the kilo and North & South Indian dishes in bulk anywhere in Bengaluru (Bangalore). For homes, offices and functions. Enquire for a custom quote.", h1: "Food that tastes like home. By the kilo.", path: "/" },
  { title: "Menu — Biryani, North Indian & South Indian Dishes", description: "The full MAANE OOTA menu: biryani by the kg, North Indian curries and breads, South Indian and Karnataka dishes, and sweets. Every order is priced by custom quote.", h1: "Everything we cook.", path: "/menu/" },
  { title: "Get a Custom Quote for Bulk Food in Bengaluru", description: "Tell us the dishes, quantity, date and area. We’ll reply with a custom quote for biryani, North Indian or South Indian food anywhere in Bengaluru.", h1: "Tell us what you’re planning.", path: "/enquire/" },
  { title: "About MAANE OOTA — Home Food, Cooked in Bulk", description: "MAANE OOTA means home food in Kannada. We cook biryani, North Indian and South Indian dishes in bulk for homes, offices and functions across Bengaluru.", h1: "MAANE OOTA means home food.", path: "/about/" },
  { title: "Bulk Food Delivery Areas in Bengaluru", description: "Bulk biryani and home-style food orders across North, South, East, West, Central and Outer Bengaluru (Bangalore). Find your area and get a custom quote.", h1: "Every corner of Bengaluru.", path: "/bengaluru/" },
  { title: "Occasions We Cater in Bengaluru", description: "Bulk food for office lunches, family functions, festivals and large gatherings across Bengaluru. See typical orders and get a custom quote.", h1: "Food for every occasion.", path: "/occasions/" },
  { title: "Bulk Food Ordering Guides for Bengaluru", description: "Practical guides for ordering bulk food in Bengaluru: how much biryani per guest, planning for a headcount, and veg vs non-veg quantities.", h1: "Plan your order with confidence.", path: "/guides/" },
  { title: "Photo Credits", description: "Credits and licences for the food photographs used on the MAANE OOTA website.", h1: "Photo credits.", path: "/credits/" },
];
