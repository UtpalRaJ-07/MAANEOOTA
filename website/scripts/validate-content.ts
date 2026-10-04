/**
 * Content_Validator (Publication Gate). Runs as the npm `prebuild` step, so a
 * bad content change fails `npm run build` before `next build` runs and can
 * never reach the exported site. See .kiro/specs/seo-growth/design.md.
 *
 * The core `validateContent()` is pure (takes data in, returns error strings)
 * so it can be tested against fixtures without touching the real data files.
 */
import type { Dish } from "@/data/dishes";
import type { CuisineDef } from "@/data/cuisines";
import type { Area } from "@/data/areas";
import type { Occasion } from "@/data/occasions";
import type { Guide } from "@/data/guides";
import type { AreaCuisineEntry } from "@/data/area-cuisine";
import {
  areaSeo, areaCuisineSeo, cuisineHubSeo, dishSeo, guideSeo, occasionSeo, STATIC_SEO, type Seo,
} from "@/lib/seo-strings";

export interface ValidationInput {
  dishes: Dish[];
  cuisines: CuisineDef[];
  areas: Area[];
  occasions: Occasion[];
  guides: Guide[];
  areaCuisine: AreaCuisineEntry[];
}

const DESC_MIN = 12;
const LONG_MIN = 40;
const GUIDE_MIN = 200;
const AREA_CUISINE_CAP_RATIO = 0.2;
const SHINGLE = 12;

const HEALTH_TERMS = [
  "diabetic", "gluten-free", "gluten free", "allergen-free", "allergen free",
  "sugar-free", "sugar free", "keto", "low-oil", "low oil", "cholesterol",
  "weight loss", "weight-loss", "cures", "healthy for", "medicinal",
];
const NEAR_ME_TERMS = ["near me", "nearby"];
const hasNearMe = (s: string) => NEAR_ME_TERMS.some((t) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").includes(t));

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const wc = (s: string) => words(s).length;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

function shingles(s: string, n = SHINGLE): Set<string> {
  const w = norm(s).split(" ");
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

export function validateContent(input: ValidationInput): string[] {
  const errors: string[] = [];
  const { dishes, cuisines, areas, occasions, guides, areaCuisine } = input;
  const cuisineKeys = new Set(cuisines.map((c) => c.cuisine));
  const areaSlugs = new Set(areas.map((a) => a.slug));
  const dishSlugSet = new Set(dishes.map((d) => d.slug));

  // 1. Dish required fields + min lengths + health-claim guard (checks 1 & 3)
  for (const d of dishes) {
    const where = `dishes.ts: "${d.slug || "(no slug)"}"`;
    for (const f of ["slug", "name", "cuisine", "diet", "unit", "desc", "longDescription"] as const) {
      if (!d[f] || String(d[f]).trim() === "") errors.push(`${where} — missing required field "${f}".`);
    }
    if (d.desc && wc(d.desc) < DESC_MIN) errors.push(`${where} — desc is ${wc(d.desc)} words, needs at least ${DESC_MIN}.`);
    if (d.longDescription && wc(d.longDescription) < LONG_MIN) errors.push(`${where} — longDescription is ${wc(d.longDescription)} words, needs at least ${LONG_MIN}.`);
    if (d.cuisine && !cuisineKeys.has(d.cuisine)) errors.push(`${where} — cuisine "${d.cuisine}" is not defined in cuisines.ts.`);
    const blob = `${d.desc || ""} ${d.longDescription || ""}`.toLowerCase();
    for (const term of HEALTH_TERMS) {
      if (blob.includes(term) && !d.healthClaimConfirmed) {
        errors.push(`${where} — copy contains the health/diet claim "${term}" but healthClaimConfirmed is not set to true.`);
      }
    }
    if (hasNearMe(d.slug + " " + d.name)) errors.push(`${where} — dish name/slug contains a near-me phrase (no near-me variant pages allowed).`);
  }

  // 2. Dish slug uniqueness (check 2)
  const seen = new Map<string, number>();
  for (const d of dishes) seen.set(d.slug, (seen.get(d.slug) || 0) + 1);
  for (const [slug, n] of seen) if (n > 1) errors.push(`dishes.ts: slug "${slug}" is used ${n} times (slugs must be unique).`);

  // Occasion / guide structural + slug uniqueness + near-me guard
  const occSlugs = new Map<string, number>();
  for (const o of occasions) {
    occSlugs.set(o.slug, (occSlugs.get(o.slug) || 0) + 1);
    const where = `occasions.ts: "${o.slug || "(no slug)"}"`;
    if (!o.name?.trim()) errors.push(`${where} — missing name.`);
    if (!o.shortDescription?.trim()) errors.push(`${where} — missing shortDescription.`);
    if (!o.workedExample || !o.workedExample.lines?.length) errors.push(`${where} — missing a worked example.`);
    for (const s of o.recommendedDishSlugs || []) if (!dishSlugSet.has(s)) errors.push(`${where} — recommended dish "${s}" does not exist in dishes.ts.`);
    if (hasNearMe(o.slug + " " + o.name)) errors.push(`${where} — contains a near-me phrase.`);
  }
  for (const [slug, n] of occSlugs) if (n > 1) errors.push(`occasions.ts: slug "${slug}" used ${n} times.`);

  const guideSlugs = new Map<string, number>();
  for (const g of guides) {
    guideSlugs.set(g.slug, (guideSlugs.get(g.slug) || 0) + 1);
    const where = `guides.ts: "${g.slug || "(no slug)"}"`;
    if (!g.title?.trim()) errors.push(`${where} — missing title.`);
    if (!g.description?.trim()) errors.push(`${where} — missing description.`);
    const bodyWords = wc((g.body || []).join(" "));
    if (bodyWords < GUIDE_MIN) errors.push(`${where} — body is ${bodyWords} words, needs at least ${GUIDE_MIN}.`);
    if (!(g.relatedLinks || []).length) errors.push(`${where} — needs at least one related link.`);
    if (hasNearMe(g.slug + " " + g.title)) errors.push(`${where} — contains a near-me phrase.`);
  }
  for (const [slug, n] of guideSlugs) if (n > 1) errors.push(`guides.ts: slug "${slug}" used ${n} times.`);

  // 5 & 6. Area-cuisine cap + distinct paragraph + referential integrity
  const publishedAC = areaCuisine.filter((e) => e.published);
  const cap = Math.floor(areas.length * AREA_CUISINE_CAP_RATIO);
  if (publishedAC.length > cap) {
    errors.push(`area-cuisine.ts — ${publishedAC.length} published entries exceeds the cap of ${cap} (20% of ${areas.length} areas).`);
  }
  for (const e of areaCuisine) {
    const where = `area-cuisine.ts: "${e.areaSlug}/${e.cuisine}"`;
    if (!areaSlugs.has(e.areaSlug)) errors.push(`${where} — areaSlug "${e.areaSlug}" does not exist in areas.ts.`);
    if (!cuisineKeys.has(e.cuisine)) errors.push(`${where} — cuisine "${e.cuisine}" does not exist in cuisines.ts.`);
    if (e.published && (!e.extraParagraph || !e.extraParagraph.trim())) {
      errors.push(`${where} — published entry must have a non-empty extraParagraph of distinct local content.`);
    }
  }

  // 4. Title / description uniqueness across all indexable pages (checks 4 / 12.3)
  const seoList: Seo[] = [...STATIC_SEO];
  for (const c of cuisines) seoList.push(cuisineHubSeo(c));
  for (const d of dishes) {
    const c = cuisines.find((x) => x.cuisine === d.cuisine);
    if (c) seoList.push(dishSeo(d, c));
  }
  for (const a of areas) seoList.push(areaSeo(a));
  for (const e of publishedAC) {
    const a = areas.find((x) => x.slug === e.areaSlug);
    const c = cuisines.find((x) => x.cuisine === e.cuisine);
    if (a && c) seoList.push(areaCuisineSeo(e, a, c));
  }
  for (const o of occasions.filter((x) => x.published)) seoList.push(occasionSeo(o));
  for (const g of guides.filter((x) => x.published)) seoList.push(guideSeo(g));

  const byTitle = new Map<string, string[]>();
  const byDesc = new Map<string, string[]>();
  for (const s of seoList) {
    (byTitle.get(s.title) ?? byTitle.set(s.title, []).get(s.title)!).push(s.path);
    (byDesc.get(s.description) ?? byDesc.set(s.description, []).get(s.description)!).push(s.path);
  }
  for (const [title, paths] of byTitle) if (paths.length > 1) errors.push(`Duplicate <title> "${title}" on: ${paths.join(", ")}.`);
  for (const [desc, paths] of byDesc) if (paths.length > 1) errors.push(`Duplicate meta description on: ${paths.join(", ")}.`);

  // 8. Guide vs parent-page copy overlap (check 8) + guide-vs-guide overlap
  const parentTexts: { label: string; text: string }[] = [];
  for (const c of cuisines) parentTexts.push({ label: `cuisine "${c.slug}"`, text: `${c.lead} ${c.intro}` });
  if (areas[0]) parentTexts.push({ label: "area page template", text: `Biryani by the kilo, North Indian curries and South Indian favourites for homes, offices and functions in ${areas[0].name}, Bengaluru. Every order gets a custom quote.` });
  for (const g of guides) {
    const gsh = shingles(g.body.join(" "));
    for (const pt of parentTexts) {
      for (const sh of shingles(pt.text)) {
        if (gsh.has(sh)) { errors.push(`guides.ts: "${g.slug}" shares a ${SHINGLE}-word run with ${pt.label}: "${sh}".`); break; }
      }
    }
  }
  for (let i = 0; i < guides.length; i++) {
    for (let j = i + 1; j < guides.length; j++) {
      const a = shingles(guides[i].body.join(" "));
      for (const sh of shingles(guides[j].body.join(" "))) {
        if (a.has(sh)) { errors.push(`guides.ts: "${guides[i].slug}" and "${guides[j].slug}" share a ${SHINGLE}-word run: "${sh}".`); break; }
      }
    }
  }

  return errors;
}

// ---- CLI wrapper: load real data, run, report, exit ----
async function main() {
  const [{ DISHES }, { CUISINES }, { AREAS }, { OCCASIONS }, { GUIDES }, { AREA_CUISINE_ENTRIES }] = await Promise.all([
    import("@/data/dishes"), import("@/data/cuisines"), import("@/data/areas"),
    import("@/data/occasions"), import("@/data/guides"), import("@/data/area-cuisine"),
  ]);
  const errors = validateContent({
    dishes: DISHES, cuisines: CUISINES, areas: AREAS,
    occasions: OCCASIONS, guides: GUIDES, areaCuisine: AREA_CUISINE_ENTRIES,
  });
  if (errors.length) {
    console.error(`\nContent check FAILED with ${errors.length} problem(s):\n`);
    for (const e of errors) console.error("  - " + e);
    console.error("\nFix the items above, then build again.\n");
    process.exit(1);
  }
  console.log(`Content check passed: ${DISHES.length} dishes, ${CUISINES.length} cuisines, ${AREAS.length} areas, ${OCCASIONS.length} occasions, ${GUIDES.length} guides, ${AREA_CUISINE_ENTRIES.filter((e) => e.published).length} area-cuisine pages.`);
}

// Run only when invoked directly (not when imported by the test).
const invokedDirectly = process.argv[1] && /validate-content\.ts$/.test(process.argv[1]);
if (invokedDirectly) main();
