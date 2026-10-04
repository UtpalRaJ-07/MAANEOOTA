// Planning guides. Each `body` is an array of paragraphs; joined length must be
// >= 200 words (checked by the content validator). Original content only.
export interface Guide {
  slug: string;
  title: string;
  description: string;
  intro: string;
  body: string[];
  relatedLinks: { href: string; label: string }[];
  published: boolean;
}

export const GUIDES: Guide[] = [
  {
    slug: "how-much-biryani-per-person",
    title: "How Much Biryani Per Person?",
    description: "A simple guide to estimating how much biryani to order per guest in Bengaluru, whether biryani is the main dish or part of a larger spread.",
    intro: "One of the most common questions we get is how much biryani to order per person. Here's a simple way to plan it.",
    body: [
      "As a rough starting point, plan about 250 to 300 grams of biryani per adult when biryani is the main dish and there are only a couple of sides. That means roughly one kilogram feeds three to four adults comfortably. Children usually eat about half an adult portion, so count two children as one adult when you add up your headcount.",
      "If biryani is only one of several dishes, for example at a function with starters, two or three curries, breads and a sweet, people take less biryani. In that case plan around 150 to 200 grams per head. The more variety on the table, the less of any single dish each guest eats, so a large spread stretches further than the numbers suggest.",
      "Appetite also depends on the crowd and the time of day. A young office team at lunch tends to eat more than a mixed family gathering in the evening. When in doubt, it is better to order a little extra biryani than to run short, because it is the dish guests remember and reach for first.",
      "When you send us an enquiry, just tell us the number of guests and whether biryani is the star of the meal or one dish among many. We'll suggest a quantity in kilograms and split it across chicken, mutton, egg, paneer or veg biryani to match your guests, then give you a custom quote.",
    ],
    relatedLinks: [
      { href: "/biryani/", label: "See all biryani" },
      { href: "/guides/planning-food-for-a-headcount/", label: "Planning food for a headcount" },
      { href: "/enquire/", label: "Get a custom quote" },
    ],
    published: true,
  },
  {
    slug: "planning-food-for-a-headcount",
    title: "How to Plan Bulk Food for Your Headcount",
    description: "How to work out how much food to order for 20, 50, 100 or more guests in Bengaluru, across biryani, curries, breads and sweets.",
    intro: "Planning food by headcount is easier when you break the meal into parts. Here's how we think about it.",
    body: [
      "Start with the rice or biryani, which is usually the centre of the meal. Plan roughly 250 grams per head if it is the main dish, or 150 to 200 grams if there are many other items. For 50 guests that means about 10 to 12 kilograms of biryani when it is the star, or a little less when the spread is large.",
      "Next, add curries. A good rule is one to two curries for a simple meal and two to three for a celebration. Plan about 100 to 150 grams of curry per head per curry. Breads like chapati or naan are counted by the piece, usually two per head, though guests eat fewer breads when there is plenty of rice.",
      "Then think about extras: a raita or salad, a starter or two for functions, and a sweet. Sweets are often counted per piece, such as one or two gulab jamun per guest, or by the kilogram for items like halwa and Mysore pak. Drinks and water are easy to forget, so add them to your plan early.",
      "Finally, always build in a small buffer for unexpected guests and second helpings, especially for family functions where numbers grow. When you enquire, share your headcount and the kind of meal you want, and we'll turn it into an exact per-item plan and a custom quote so nothing is left to guesswork.",
    ],
    relatedLinks: [
      { href: "/occasions/large-gatherings/", label: "Food for large gatherings" },
      { href: "/guides/how-much-biryani-per-person/", label: "How much biryani per person" },
      { href: "/enquire/", label: "Get a custom quote" },
    ],
    published: true,
  },
  {
    slug: "veg-vs-non-veg-quantities",
    title: "Veg and Non-Veg: How to Split Your Order",
    description: "How to decide the veg and non-veg split when ordering bulk food for a mixed group in Bengaluru, so nobody is left short.",
    intro: "Ordering for a mixed group of vegetarians and non-vegetarians? Here's how to split the quantities sensibly.",
    body: [
      "The first step is to estimate how many guests are strictly vegetarian and how many eat non-veg. If you know the rough split, order in that proportion but add a little extra on the vegetarian side, because many non-vegetarians happily eat vegetarian dishes too, while strict vegetarians will only eat the veg options. A common safe split is slightly more veg than the headcount alone suggests.",
      "For biryani, this often means ordering separate veg and non-veg biryani rather than assuming everyone eats the same. Keep them clearly separated in serving and packing, which we always do, so there is no cross-contact and guests can choose confidently. The same applies to curries: pair a paneer or dal dish with a chicken or mutton curry so both groups have a proper main.",
      "For functions with a religious or traditional element, check whether the occasion calls for a fully vegetarian menu. Many poojas and festival meals are entirely vegetarian, in which case the whole order is veg and you can plan richer, more varied vegetarian dishes to make up for it.",
      "When in doubt, tell us your rough veg and non-veg numbers when you enquire. We'll suggest quantities for each side, keep them separate in cooking and packing, and make sure both vegetarian and non-vegetarian guests have plenty to enjoy. You'll get a clear, itemised custom quote for the full order.",
    ],
    relatedLinks: [
      { href: "/menu/", label: "See the full menu" },
      { href: "/guides/planning-food-for-a-headcount/", label: "Planning food for a headcount" },
      { href: "/enquire/", label: "Get a custom quote" },
    ],
    published: true,
  },
  {
    slug: "how-to-order-bulk-food-in-bengaluru",
    title: "How to Order Bulk Food in Bengaluru",
    description: "A step-by-step guide to ordering bulk biryani and home-style food in Bengaluru through MAANE OOTA, from enquiry to delivery.",
    intro: "Ordering bulk food with us is simple and there's no booking app or payment to deal with. Here's how it works.",
    body: [
      "Everything starts with an enquiry, not a booking. You tell us what you'd like, how much, the date and time, and your area in Bengaluru. You can use the quote form on this site, which opens a ready-made message on WhatsApp, or you can call us directly. There is no online payment and no account to create.",
      "Once we have your requirement, we reply with a custom quote. Because every order is different, we price it specifically for your dishes, quantity, date and delivery location rather than from a fixed menu price. If you're not sure about quantities, we'll suggest amounts based on your headcount so you order just the right amount.",
      "When you're happy with the quote, you confirm the order with us directly and we agree the details: final menu, quantity, delivery time and address. For large or festival-date orders, confirming early matters, because popular dates fill up. We'll let you know what's possible for your date when we quote.",
      "On the day, your food is cooked fresh for your slot and delivered to your address, packed with veg and non-veg kept separate. That's the whole process: enquire, get a quote, confirm, and receive your food. Ready to start? Send us your requirement and we'll take it from there.",
    ],
    relatedLinks: [
      { href: "/enquire/", label: "Get a custom quote" },
      { href: "/bengaluru/", label: "Areas we serve" },
      { href: "/menu/", label: "See the full menu" },
    ],
    published: true,
  },
  {
    slug: "office-lunch-catering-guide",
    title: "A Guide to Office Lunch Catering in Bengaluru",
    description: "How to plan office lunch catering in Bengaluru, from one-off team lunches to recurring weekday orders, with tips on quantity and delivery.",
    intro: "Feeding a team at the office? Whether it's a one-off celebration or a regular weekday order, here's how to plan it well.",
    body: [
      "First decide whether you need a one-off order or a recurring one. A one-off suits team lunches, town halls, product launches and celebrations. A recurring order suits companies that want lunch handled every day or a few days a week, with a rotating menu so the team gets variety without anyone re-planning each time. We handle both, and they're quoted differently.",
      "For quantity, office crowds at lunch tend to have a healthy appetite, so plan a full main plus a curry and a bread or rice. Around 250 grams of biryani or rice per head, one curry, and a sweet works well for most teams. Always split clearly into veg and non-veg, and label them, because it makes serving at the office much easier.",
      "Delivery logistics matter at a workplace. Share the building, floor, a contact person and a delivery time when you enquire, so the food arrives ready to serve at the right moment. Individual boxes work well for desks and meetings, while bulk trays suit a shared pantry or a buffet-style team lunch. Tell us which you prefer.",
      "For recurring orders, we fix a weekly menu with you in advance and agree the days and headcount, so it runs smoothly week after week. Everything is confirmed directly with you, never booked through the site. Send us your team size and how often you'd like lunch, and we'll put together a plan and a custom quote.",
    ],
    relatedLinks: [
      { href: "/occasions/office-catering/", label: "Office & corporate catering" },
      { href: "/occasions/weekly-office-lunch/", label: "Weekly office lunch orders" },
      { href: "/enquire/", label: "Get a custom quote" },
    ],
    published: true,
  },
  {
    slug: "festival-food-planning",
    title: "Planning Festival Food Orders in Bengaluru",
    description: "Tips for ordering festival food in Bengaluru, from choosing a traditional vegetarian menu to booking your date early for busy festival days.",
    intro: "Festival days are special and busy. A little planning makes sure your celebration food arrives exactly as you want it.",
    body: [
      "The single most important tip for festival orders is to plan early. Festival dates such as Ugadi, Deepavali, Ganesha Chaturthi, Ramzan and Christmas are our busiest, and dates fill up quickly. The sooner you share your date and headcount, the more likely we can confirm your order and give you the delivery time you want.",
      "Next, decide on the style of menu. Many festivals call for a traditional vegetarian spread with rice dishes, curries, palya, a raita, and sweets like payasam, Mysore pak or kesari bath. Others are celebration feasts where biryani and richer dishes take centre stage. Tell us the festival and your family's tradition, and we'll suggest a fitting menu.",
      "Quantities for festival meals follow the same logic as any large gathering: plan a rice main, one or two curries, breads or extra rice, a raita, and at least one sweet. Sweets in particular are central to festivals, so order a little extra as guests tend to enjoy more than one helping and often take some home.",
      "Finally, confirm delivery timing carefully. On busy festival mornings, timing is agreed in advance so your food arrives when you need it for the celebration. Share your preferred time when you enquire. Send us your festival date, headcount and menu style early, and we'll reserve your slot and prepare a custom quote.",
    ],
    relatedLinks: [
      { href: "/occasions/festival-orders/", label: "Festival bulk orders" },
      { href: "/sweets/", label: "See all sweets" },
      { href: "/enquire/", label: "Get a custom quote" },
    ],
    published: true,
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const publishedGuides = () => GUIDES.filter((g) => g.published);
