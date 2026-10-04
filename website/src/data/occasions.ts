// Occasion pages. `published: false` entries never become routes and never
// enter the sitemap. Each worked example uses real dish slugs from dishes.ts.
export interface Occasion {
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  intro: string;
  workedExample: { title: string; headcount: number; lines: string[]; notes: string };
  recommendedDishSlugs: string[];
  faq: { q: string; a: string }[];
  published: boolean;
}

export const OCCASIONS: Occasion[] = [
  {
    slug: "office-catering",
    name: "Office & Corporate Catering",
    eyebrow: "For workplaces",
    shortDescription: "Bulk food for office parties, team lunches, town halls and corporate events across Bengaluru.",
    intro: "One-off catering for office celebrations, team offsites, product launches and client meetings. Tell us your headcount and we'll plan a menu and quantity that leaves no one hungry.",
    workedExample: {
      title: "A typical team lunch for 40",
      headcount: 40,
      lines: [
        "6 kg chicken biryani and 4 kg veg biryani",
        "3 kg paneer butter masala",
        "80 chapatis and 4 litres of raita",
        "40 gulab jamun to finish",
      ],
      notes: "Roughly 250 g of biryani per head plus a curry and bread works for most office lunches. We adjust the veg / non-veg split to your team.",
    },
    recommendedDishSlugs: ["chicken-biryani", "veg-biryani", "paneer-butter-masala", "chapati", "gulab-jamun"],
    faq: [
      { q: "Can you deliver to an office reception?", a: "Yes. Share the building, floor and a contact number when you enquire and we'll plan delivery and packing accordingly." },
      { q: "Can you split the order into veg and non-veg clearly?", a: "Yes. We label and pack veg and non-veg separately so it's easy to serve." },
      { q: "How much notice do you need?", a: "The earlier the better for large team lunches. Share your date and headcount and we'll confirm what's possible with your quote." },
    ],
    published: true,
  },
  {
    slug: "weekly-office-lunch",
    name: "Weekly Office Lunch Orders",
    eyebrow: "For workplaces, every week",
    shortDescription: "Regular weekday lunch for your team, planned as a recurring order with a rotating menu.",
    intro: "For companies that want lunch handled every day or a few days a week. We set up a recurring order with a rotating menu so your team gets variety without you re-planning each time. This is different from one-off event catering: it's a standing arrangement.",
    workedExample: {
      title: "A standing order for 30, every weekday",
      headcount: 30,
      lines: [
        "A rotating daily main: biryani, curd rice, North Indian thali or South Indian meals",
        "One curry and a bread or rice on each day",
        "Packed in individual boxes or in bulk trays, your choice",
        "A weekly menu agreed in advance so there are no surprises",
      ],
      notes: "Recurring orders are quoted per head per day, with the rotating weekly menu fixed with you up front. Minimum headcounts and days per week are agreed in the quote.",
    },
    recommendedDishSlugs: ["veg-biryani", "curd-rice", "dal-tadka", "chapati", "bisi-bele-bath"],
    faq: [
      { q: "Is this different from one-off office catering?", a: "Yes. This is a standing, repeating order with a planned weekly menu, rather than food for a single event. It's meant for regular daily or weekly team lunches." },
      { q: "Can we fix the weekly menu in advance?", a: "Yes. We agree a rotating menu with you up front so your team knows what's coming and you don't re-plan every day." },
      { q: "Can we pause during holidays?", a: "Yes. Tell us your working days and any holidays and we'll plan around them. Everything is confirmed directly with you, not booked through the site." },
    ],
    published: true,
  },
  {
    slug: "family-functions",
    name: "Family Functions & Celebrations",
    eyebrow: "For home celebrations",
    shortDescription: "Bulk food for birthdays, anniversaries, housewarmings, naming ceremonies and family get-togethers.",
    intro: "Food for the celebrations that bring family together at home. From an intimate birthday dinner to a housewarming for the whole extended family, we cook to your headcount and your taste.",
    workedExample: {
      title: "A housewarming lunch for 60",
      headcount: 60,
      lines: [
        "10 kg chicken biryani and 6 kg veg biryani",
        "4 kg paneer butter masala and 4 kg dal makhani",
        "120 chapatis, raita and salad",
        "5 litres payasam and 60 gulab jamun",
      ],
      notes: "For a full sit-down family meal, plan a biryani or rice, one or two curries, bread, a raita and a sweet. We help you balance veg and non-veg for your guests.",
    },
    recommendedDishSlugs: ["chicken-biryani", "veg-biryani", "paneer-butter-masala", "dal-makhani", "payasam"],
    faq: [
      { q: "Can you cook a fully vegetarian menu for a pooja?", a: "Yes. Tell us it's for a pooja or a vegetarian occasion and we'll plan a complete veg menu with rice, curries, sides and sweets." },
      { q: "Can you handle a small family dinner too?", a: "Yes. Small orders are welcome. Tell us the number of guests and we'll suggest quantities." },
      { q: "Do you make traditional festival sweets?", a: "Yes. We make gulab jamun, payasam, kesari bath, Mysore pak and more. Order sweets alongside your meal." },
    ],
    published: true,
  },
  {
    slug: "festival-orders",
    name: "Festival Bulk Orders",
    eyebrow: "For festival days",
    shortDescription: "Order ahead for Ugadi, Deepavali, Ganesha Chaturthi, Ramzan, Christmas and other festivals.",
    intro: "Festival days are our busiest, so ordering ahead matters. Whether it's a traditional vegetarian festive spread or a celebration feast, plan early and we'll reserve your date.",
    workedExample: {
      title: "A festival lunch for 50",
      headcount: 50,
      lines: [
        "8 kg veg biryani or a full South Indian meals spread",
        "4 kg mixed vegetable curry and 4 kg dal",
        "100 chapatis or 8 kg rice",
        "5 kg Mysore pak and 5 litres payasam",
      ],
      notes: "Festival dates book up fast. Confirm your order well in advance so we can lock in your date and quantity for you.",
    },
    recommendedDishSlugs: ["veg-biryani", "bisi-bele-bath", "mysore-pak", "payasam", "kesari-bath"],
    faq: [
      { q: "How early should I order for a festival?", a: "As early as you can. Festival dates fill up quickly, so the sooner you share your date and headcount, the more likely we can confirm it." },
      { q: "Can you cook a traditional vegetarian festive menu?", a: "Yes. We plan complete traditional veg spreads with rice dishes, curries, palya, sweets and payasam for festival days." },
      { q: "Can you deliver on the festival morning?", a: "Timing on busy festival days is agreed in advance in your quote. Share your preferred delivery time when you enquire." },
    ],
    published: true,
  },
  {
    slug: "large-gatherings",
    name: "Food for Large Gatherings",
    eyebrow: "By headcount",
    shortDescription: "Plan bulk food by the number of people, from 20 to 500 guests and beyond.",
    intro: "Not sure how much to order? Start from your headcount. Tell us how many people you're feeding and the kind of menu you want, and we'll work out quantities and a quote for the whole group.",
    workedExample: {
      title: "Planning for 100 guests",
      headcount: 100,
      lines: [
        "About 25 kg of biryani (split veg and non-veg to taste)",
        "8-10 kg of curries across one or two options",
        "200 chapatis or extra rice",
        "A sweet by the kg or piece, and raita by the litre",
      ],
      notes: "As a rough guide, plan around 250 g of a rice main per head plus curry, bread and a sweet. We refine the exact quantities with you based on the full menu.",
    },
    recommendedDishSlugs: ["chicken-biryani", "veg-biryani", "paneer-butter-masala", "chapati", "gulab-jamun"],
    faq: [
      { q: "How much food do I need for 50 / 100 / 200 people?", a: "It depends on the full menu, but we'll give you a clear per-head plan when you share your headcount and the dishes you'd like. See our guides for rough estimates." },
      { q: "Can you handle 500+ guests?", a: "Large orders are welcome with enough notice. Share your date, headcount and venue and we'll confirm what's possible in your quote." },
      { q: "Can you deliver to an event venue?", a: "Yes. Share the venue address and a contact number, and we'll plan delivery and packing for the gathering." },
    ],
    published: true,
  },
];

export const occasionBySlug = (slug: string) => OCCASIONS.find((o) => o.slug === slug);
export const publishedOccasions = () => OCCASIONS.filter((o) => o.published);
