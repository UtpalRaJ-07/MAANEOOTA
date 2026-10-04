import type { Cuisine } from "@/data/dishes";

// Curated area + cuisine pages. This is DELIBERATELY a small, hand-written set,
// not every area x cuisine combination (that would be thin doorway pages).
// The validator enforces a hard cap of 20% of all areas and requires a
// non-empty, distinct `extraParagraph` on every published entry.
// `areaSlug` must exist in areas.ts and `cuisine` must exist in cuisines.ts.
export interface AreaCuisineEntry {
  areaSlug: string;
  cuisine: Cuisine;
  extraParagraph: string; // genuinely local content, not repeated from parent pages
  faq?: { q: string; a: string }[];
  published: boolean;
}

export const AREA_CUISINE_ENTRIES: AreaCuisineEntry[] = [
  {
    areaSlug: "koramangala", cuisine: "biryani", published: true,
    extraParagraph: "Koramangala's mix of startups, PGs and young families means biryani orders here range from a single 2 kg order for a small team to large weekend party spreads. We take orders across all the blocks, and office biryani lunches around the startup offices are among our most frequent Koramangala requests.",
    faq: [{ q: "Do you take office biryani orders in Koramangala?", a: "Yes. Team lunches and office parties around Koramangala's startup offices are a regular order for us. Share your headcount and block and we'll quote for it." }],
  },
  {
    areaSlug: "hsr-layout", cuisine: "biryani", published: true,
    extraParagraph: "HSR Layout's sectors are largely residential with a strong apartment and young-family crowd, so biryani orders here are often for birthdays, house parties and weekend get-togethers. We deliver across the sectors and can split an order into chicken, mutton and veg biryani to suit a mixed group of guests.",
  },
  {
    areaSlug: "whitefield", cuisine: "biryani", published: true,
    extraParagraph: "Whitefield's tech parks and large apartment complexes mean we see everything here from office team biryani lunches to big community-hall functions. Because Whitefield is spread out, we plan delivery timing carefully so hot biryani reaches your office reception or apartment clubhouse ready to serve.",
    faq: [{ q: "Can you deliver biryani to a Whitefield tech park?", a: "Yes. Share the park, building and a contact number, and we'll plan the delivery time so the biryani arrives ready to serve." }],
  },
  {
    areaSlug: "electronic-city", cuisine: "biryani", published: true,
    extraParagraph: "Electronic City is dominated by IT offices and apartment townships, so bulk biryani here is often for corporate team lunches and society events. With enough notice we handle large office orders across Phase 1 and Phase 2, packed in individual boxes for desks or in trays for a shared team lunch.",
  },
  {
    areaSlug: "marathahalli", cuisine: "biryani", published: true,
    extraParagraph: "Marathahalli's busy mix of offices, PGs and apartments makes it one of our steadier East Bengaluru areas for biryani. Whether it's a small PG group order or a larger office function, we plan quantities and delivery around Marathahalli's traffic so your food arrives on time.",
  },
  {
    areaSlug: "btm-layout", cuisine: "biryani", published: true,
    extraParagraph: "BTM Layout's dense mix of PGs, working professionals and families means biryani orders here span quick weekday group orders to weekend celebrations. We deliver across both stages of BTM Layout and can keep veg and non-veg biryani clearly separated for shared PG and flatmate orders.",
  },
  {
    areaSlug: "indiranagar", cuisine: "north", published: true,
    extraParagraph: "Indiranagar's mix of established homes and a lively social scene means North Indian spreads here are popular for house parties and get-togethers. Butter chicken, paneer dishes, dal makhani and fresh naan travel well across Indiranagar, and we can plan a full North Indian menu for your gathering.",
  },
  {
    areaSlug: "jayanagar", cuisine: "south", published: true,
    extraParagraph: "Jayanagar is one of Bengaluru's most traditional residential neighbourhoods, and South Indian and Karnataka dishes are especially popular here for poojas and family functions. Bisi bele bath, chitranna, vangi bath, palya and payasam are frequent Jayanagar orders, and we can plan a complete traditional vegetarian spread.",
    faq: [{ q: "Can you cook a traditional South Indian pooja meal in Jayanagar?", a: "Yes. Traditional vegetarian spreads for poojas and functions are among our most common Jayanagar orders. Tell us your headcount and we'll plan the full menu." }],
  },
  {
    areaSlug: "malleshwaram", cuisine: "south", published: true,
    extraParagraph: "Malleshwaram's traditional, largely vegetarian character makes it a natural fit for our South Indian and Karnataka menu. From idli, vada and set dosa for morning functions to full meals with bisi bele bath and payasam, we cook the classics that Malleshwaram households know and expect.",
  },
  {
    areaSlug: "jp-nagar", cuisine: "biryani", published: true,
    extraParagraph: "JP Nagar's phases are a settled residential belt where biryani is a weekend and celebration favourite. We deliver across the phases and handle everything from a family-sized 3 kg order to biryani for a full house function, split across chicken, mutton, egg and veg to suit your guests.",
  },
  {
    areaSlug: "bellandur", cuisine: "north", published: true,
    extraParagraph: "Bellandur's high-rise apartments and nearby offices make North Indian catering popular for both housewarmings and office celebrations. Rich gravies like butter chicken, paneer butter masala and dal makhani with fresh naan are easy to serve at a clubhouse party, and we plan delivery around Bellandur's peak traffic.",
  },
  {
    areaSlug: "rajajinagar", cuisine: "south", published: true,
    extraParagraph: "Rajajinagar is an established West Bengaluru neighbourhood with a strong traditional food culture, so South Indian and Karnataka dishes are a natural choice for functions here. We cook everything from tiffin items for morning events to full meals with sagu, palya and sweets for family celebrations.",
  },
];

export const publishedAreaCuisine = () => AREA_CUISINE_ENTRIES.filter((e) => e.published);
