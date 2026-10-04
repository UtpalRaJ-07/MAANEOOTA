import { WIDE, type WideImage } from "@/lib/meta";
import type { Cuisine } from "@/data/dishes";

// One registry for every cuisine hub. `cuisine` matches Dish.cuisine (internal
// key); `slug` is the URL segment. Existing URLs (/biryani/, /north-indian/,
// /south-indian/) are preserved by keeping their slugs here.
export interface CuisineDef {
  cuisine: Cuisine;
  slug: string;
  name: string;
  eyebrow: string;
  title: string;   // hub H1 / hero title
  lead: string;    // hub intro sentence(s)
  intro: string;   // short one-line intro reused in listings
  heading: string; // "Pick your biryani." style section heading
  sub: string;     // section subheading
  heroImage: WideImage;
  faq: { q: string; a: string }[];
}

export const CUISINES: CuisineDef[] = [
  {
    cuisine: "biryani",
    slug: "biryani",
    name: "Biryani",
    eyebrow: "Biryani by the kg",
    title: "Biryani for one family or one hundred guests.",
    lead: "Chicken, mutton, Donne, egg, paneer and veg biryani, cooked fresh for your date. Order 1 kg, 2 kg or as much as your function needs.",
    intro: "Chicken, mutton, Donne, egg, paneer and veg biryani, by the kg.",
    heading: "Pick your biryani.",
    sub: "Mix and match in one order. Tell us how many kilos of each.",
    faq: [{ q: "How many people does 1 kg of biryani serve?", a: "Roughly three to four adults when biryani is the main dish. Tell us your headcount and we’ll suggest a quantity." }, { q: "Can I order just 1 or 2 kg?", a: "Yes. Small orders are welcome, as are large orders for functions and offices." }, { q: "Can I mix chicken, mutton and veg biryani?", a: "Yes. Tell us the quantity of each and we’ll quote for the full order, kept clearly separated." }],
    heroImage: WIDE.heroBiryani,
  },
  {
    cuisine: "north",
    slug: "north-indian",
    name: "North Indian",
    eyebrow: "North Indian",
    title: "Rich gravies. Soft chapatis. Made for sharing.",
    lead: "Butter chicken, paneer, dal makhani, chole and more, cooked in bulk for your family, office or function in Bengaluru.",
    intro: "Butter chicken, paneer, dal makhani, chole and chapatis.",
    heading: "Build your North Indian menu.",
    sub: "Combine curries, dal, rice and chapatis for a complete meal.",
    faq: [{ q: "Can I order chapatis or naan with the curries?", a: "Yes. Breads are counted by the piece — add the number you need to your enquiry." }, { q: "Can you plan a full North Indian menu for a function?", a: "Yes. Share your headcount and we’ll suggest curries, dal, rice and breads with a custom quote." }, { q: "Do you have vegetarian North Indian options?", a: "Yes. Paneer dishes, dal, chole, rajma and mixed veg are all vegetarian." }],
    heroImage: WIDE.northThali,
  },
  {
    cuisine: "south",
    slug: "south-indian",
    name: "South Indian",
    eyebrow: "South Indian",
    title: "Karnataka classics and South Indian favourites.",
    lead: "Bisi bele bath, chitranna, idli, vada, sambar, Chettinad chicken and more, cooked in bulk for any occasion across Bengaluru.",
    intro: "Bisi bele bath, chitranna, idli, vada, sambar and more.",
    heading: "From tiffin to a full meal.",
    sub: "Rice dishes, curries, tiffin items and sweets. Order by the kg, litre or piece.",
    faq: [{ q: "Do you make idli, vada and dosa in bulk?", a: "Yes. Tiffin items are counted by the piece and delivered with sambar and chutney." }, { q: "Which Karnataka dishes do you cook?", a: "Bisi bele bath, chitranna, vangi bath, ragi mudde, palya and more, along with sambar and rasam." }, { q: "Can you cook a vegetarian South Indian meal for a pooja?", a: "Yes. Tell us it’s for a pooja and your headcount, and we’ll plan a full vegetarian spread." }],
    heroImage: WIDE.southLeaf,
  },
  {
    cuisine: "starters",
    slug: "starters",
    name: "Starters & Snacks",
    eyebrow: "Starters & snacks",
    title: "Kebabs, tikkas and snacks for the whole crowd.",
    lead: "Veg and non-veg starters, kebabs and party snacks in bulk, cooked fresh for functions, office parties and get-togethers in Bengaluru.",
    intro: "Kebabs, tikkas, rolls and party snacks by the plate or kg.",
    heading: "Start the meal right.",
    sub: "Order starters by the kg or by the plate. Great alongside biryani for a function.",
    faq: [{ q: "Can I add starters to a biryani order?", a: "Yes. Starters pair well with biryani for functions — order them by the kg or by the piece." }, { q: "Do you have both veg and non-veg starters?", a: "Yes. From paneer tikka and gobi manchurian to chicken tikka, kebabs and fish fry." }, { q: "Are starters good for parties?", a: "Yes. They’re easy to hand round at parties and get-togethers. Tell us your headcount for a quote." }],
    heroImage: WIDE.buffet,
  },
  {
    cuisine: "sweets",
    slug: "sweets",
    name: "Sweets",
    eyebrow: "Sweets & desserts",
    title: "Traditional sweets to finish the meal.",
    lead: "Gulab jamun, kesari bath, payasam and more, made fresh for festivals, functions and family meals across Bengaluru.",
    intro: "Gulab jamun, kesari bath, payasam and festival sweets.",
    heading: "A sweet ending.",
    sub: "Order sweets by the kg, litre or piece to match your headcount.",
    faq: [{ q: "Do you make traditional festival sweets?", a: "Yes. Gulab jamun, Mysore pak, payasam, kesari bath, jalebi and more, made fresh for your date." }, { q: "How are sweets ordered — by weight or piece?", a: "It depends on the sweet: some by the kg, some by the litre, and some by the piece." }, { q: "Can I add sweets to a meal order?", a: "Yes. Add sweets alongside your main order and we’ll include them in one custom quote." }],
    heroImage: WIDE.buffet,
  },
];

export const cuisineBySlug = (slug: string) => CUISINES.find((c) => c.slug === slug);
export const cuisineByKey = (cuisine: Cuisine) => CUISINES.find((c) => c.cuisine === cuisine);
export const cuisineSlug = (cuisine: Cuisine) => cuisineByKey(cuisine)?.slug ?? cuisine;
