/**
 * Tests for the Content_Validator. No test framework is used (matching this
 * project's lightweight tooling); this is a plain tsx script that exits
 * non-zero if any assertion fails.  Run with: npm run test:content
 */
import { validateContent, type ValidationInput } from "./validate-content";
import type { Dish } from "@/data/dishes";

const img = { src: "/images/hero-biryani.jpg", w: 1800, h: 1200, alt: "biryani" };
const longText = (n: number) => Array.from({ length: n }, (_, i) => `info${i}`).join(" ");

function makeValid(): ValidationInput {
  const dish: Dish = {
    slug: "chicken-biryani", name: "Chicken Biryani", cuisine: "biryani", diet: "nonveg", unit: "kg",
    desc: "Long grain basmati rice layered with marinated chicken and whole spices for a rich meal.",
    longDescription: longText(45),
  };
  const areas = Array.from({ length: 10 }, (_, i) => ({ name: `Area ${i}`, slug: `area-${i}`, zone: "south" as const }));
  return {
    dishes: [dish, { ...dish, slug: "veg-biryani", name: "Veg Biryani", diet: "veg", desc: "Mixed vegetables and whole spices layered with long grain basmati rice and fresh herbs together.", longDescription: longText(46) }],
    cuisines: [{ cuisine: "biryani", slug: "biryani", name: "Biryani", eyebrow: "e", title: "Biryani title", lead: "Biryani lead sentence here.", intro: "Biryani intro.", heading: "h", sub: "s", heroImage: img, faq: [] }],
    areas,
    occasions: [{ slug: "office-catering", name: "Office Catering", eyebrow: "e", shortDescription: "Bulk office food.", intro: "i", workedExample: { title: "t", headcount: 40, lines: ["6 kg biryani"], notes: "n" }, recommendedDishSlugs: ["chicken-biryani"], faq: [], published: true }],
    guides: [{ slug: "guide-a", title: "Guide A", description: "Guide A description.", intro: "i", body: [longText(210)], relatedLinks: [{ href: "/enquire/", label: "Quote" }], published: true }],
    areaCuisine: [{ areaSlug: "area-0", cuisine: "biryani", extraParagraph: "Distinct local content for area zero biryani orders that does not repeat parent copy.", published: true }],
  };
}

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) { console.log("  PASS", name); }
  else { console.error("  FAIL", name); failures++; }
}

// Valid fixture must pass clean.
const validErrors = validateContent(makeValid());
check("valid fixture produces no errors", validErrors.length === 0);
if (validErrors.length) console.error("    unexpected:", validErrors);

// Each broken case must produce at least one error.
let f = makeValid(); (f.dishes[0] as any).name = "";
check("missing dish field fails", validateContent(f).length > 0);

f = makeValid(); f.dishes[0].desc = "too short desc";
check("short desc fails", validateContent(f).length > 0);

f = makeValid(); f.dishes[0].longDescription = longText(10);
check("short longDescription fails", validateContent(f).length > 0);

f = makeValid(); f.dishes.push({ ...f.dishes[0], slug: "chicken-biryani-2" });
check("duplicate title fails", validateContent(f).some((e) => e.includes("Duplicate <title>")));

f = makeValid();
f.areaCuisine = Array.from({ length: 5 }, (_, i) => ({ areaSlug: `area-${i}`, cuisine: "biryani" as const, extraParagraph: `distinct local text number ${i} for testing the cap rule here`, published: true }));
check("over-cap area-cuisine fails", validateContent(f).some((e) => e.includes("exceeds the cap")));

f = makeValid(); f.dishes[0].desc = "This diabetic friendly biryani is great for health conscious guests at any function today.";
check("unconfirmed health claim fails", validateContent(f).some((e) => e.includes("health/diet claim")));
f = makeValid(); f.dishes[0].desc = "This diabetic friendly biryani is great for health conscious guests at any function today."; f.dishes[0].healthClaimConfirmed = true;
check("confirmed health claim passes", !validateContent(f).some((e) => e.includes("health/diet claim")));

f = makeValid(); f.dishes[0].slug = "biryani-near-me";
check("near-me dish slug fails", validateContent(f).some((e) => e.includes("near-me")));

f = makeValid(); f.areaCuisine[0].areaSlug = "does-not-exist";
check("area-cuisine unknown area fails", validateContent(f).some((e) => e.includes("does not exist in areas")));

f = makeValid(); f.guides[0].body = [longText(20)];
check("short guide body fails", validateContent(f).some((e) => e.includes("body is")));

console.log(failures === 0 ? "\nAll validator tests passed." : `\n${failures} validator test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
