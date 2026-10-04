# Design Document

## Overview

This design grows the MAANE OOTA static site (Next.js App Router, `output: "export"`, no server, no CMS, no login) from 4 page types (home, 3 cuisine hubs, area pages, menu, enquire, about, credits) into a larger, still fully static set of page types: cuisine hubs (now data-driven, 5+ cuisines), dish detail pages, a curated set of area+cuisine pages, occasion pages, and guide pages. Every new page type reuses the existing metadata utility (`src/lib/meta.ts`), the existing `JsonLd`/breadcrumb pattern, the existing `EnquiryForm` WhatsApp flow, and the existing visual components (`Faq`, `Steps`, `CtaBand`, `DishCard`/`DishList`, `DietMark`).

Because there is no CMS and no server, "content" is TypeScript data files, and "publication" is a `published: boolean` flag on each data entry, enforced at build time by a new Node script (`scripts/validate-content.ts`) that fails `npm run build` if any Publication_Gate rule is violated. Unpublished candidate pages are simply never generated (they are absent from `generateStaticParams()`), so they 404 rather than existing as thin, unlinked, or accidentally-indexable pages.

## Architecture

```
src/data/
  cuisines.ts        (NEW) registry of cuisine hubs: slug, name, hero image, intro
  dishes.ts          (EXTENDED) 70+ dishes, 5+ cuisines, aka[], longDescription, healthClaimConfirmed
  areas.ts           (UNCHANGED) 156 areas / 6 zones — already sufficient for Requirement scope
  area-cuisine.ts    (NEW) curated Area_Cuisine_Page candidates, each with published: boolean
  occasions.ts       (NEW) 5 Occasion_Page entries
  guides.ts          (NEW) Guide_Page entries

src/app/
  [cuisine]/page.tsx                  (REPLACES biryani/, north-indian/, south-indian/ hardcoded pages)
  [cuisine]/[dish]/page.tsx           (NEW) Dish_Detail_Page
  bengaluru/[area]/[cuisine]/page.tsx (NEW) Area_Cuisine_Page
  occasions/page.tsx                  (NEW) Occasion_Page index
  occasions/[occasion]/page.tsx       (NEW) Occasion_Page
  guides/page.tsx                     (NEW) Guide_Page index
  guides/[guide]/page.tsx             (NEW) Guide_Page
  sitemap.ts                          (EXTENDED) enumerate all published entries
  robots.ts                           (UNCHANGED)

src/components/
  CuisinePage.tsx      (RENAMED CuisineHubPage, made data-driven — same visual output)
  DishDetailPage.tsx   (NEW)
  AreaCuisinePage.tsx  (NEW)
  OccasionPage.tsx     (NEW)
  GuidePage.tsx        (NEW)
  RelatedDishes.tsx    (NEW) small rail used on Dish_Detail_Page

scripts/
  validate-content.ts  (NEW) Content_Validator, run as an npm "prebuild" step
```

`npm run build`'s `prebuild` lifecycle script runs `validate-content.ts` first (via `tsx`). If it exits non-zero, `next build` never runs, so a bad content change cannot reach the exported site. This mirrors how the project already treats `typecheck` as a separate, must-pass step.

## Components and Interfaces

### Cuisine hub becomes data-driven (Requirement 1, 8, 13)

`src/data/cuisines.ts`:

```ts
export interface CuisineDef {
  slug: string;          // "biryani" | "north-indian" | "south-indian" | "sweets" | "starters"
  name: string;          // "Biryani"
  intro: string;         // 1-2 sentence hub intro, unique per cuisine
  heroImage: WideImage;  // reuses existing WIDE image constants
}
export const CUISINES: CuisineDef[] = [ /* 5 entries; see Data Models */ ];
```

`src/app/[cuisine]/page.tsx` replaces the three hand-written hub pages with one dynamic route using `generateStaticParams()` over `CUISINES`, `dynamicParams = false` (same pattern as the existing `bengaluru/[area]/page.tsx`). It renders the renamed `CuisineHubPage` component, which is the existing `CuisinePage.tsx` component unchanged except its dish list, hero image, and copy now come from `cuisines.ts` + `byCuisine(cuisine.slug)` instead of being hardcoded per file. This satisfies Requirement 1.5 (new dishes appear without a page code change) directly, because the hub page already iterates `byCuisine(...)`.

Existing URLs `/biryani/`, `/north-indian/`, `/south-indian/` are preserved exactly (their slugs become entries in `CUISINES`), so no redirects are needed. `sweets` and `starters` become newly reachable hub URLs.

### Dish Detail Page (Requirement 3)

Route: `/{cuisine-slug}/{dish-slug}/`, e.g. `/biryani/chicken-biryani/`, `/sweets/gulab-jamun/`.

Chosen over a flat `/dishes/{slug}/` scheme because it keeps a dish nested under its cuisine in the URL and breadcrumb, satisfies Requirement 3.6 ("reachable from its parent Cuisine_Hub_Page") by construction, and needs no separate collision-checking between a dish namespace and a cuisine namespace.

`src/app/[cuisine]/[dish]/page.tsx`:
- `generateStaticParams()` returns `{ cuisine, dish }` pairs by iterating `CUISINES` × `byCuisine(cuisine.slug)`.
- `dynamicParams = false`.
- Looks up the `Dish` by `(cuisine, dish)` slugs; `notFound()` if either is unknown or the dish's `cuisine` field doesn't match the URL's cuisine segment (prevents a dish being reachable under the wrong cuisine URL).

`DishDetailPage.tsx` (new component), reusing existing pieces:
- Breadcrumb: Home → {Cuisine} → {Dish} (via `breadcrumbLd` + visible `crumbs` nav, same as `CuisinePage.tsx`).
- Hero: dish photo if present, else the cuisine's `heroImage` from `cuisines.ts` (never a broken image).
- Body: `dish.longDescription` (≥40 words, distinct from the short `dish.desc` used on cards) + diet/unit/cuisine fact row using `DietMark`.
- `RelatedDishes.tsx`: picks ≥2 other dishes — first preferring the same cuisine, falling back to dishes sharing a diet classification — rendered with the existing `DishCard`.
- CTA: `CtaBand` linking to `/enquire/?dish={slug}` (existing pre-fill param, unchanged).

### Area + Cuisine Page (Requirement 4)

Route: `/bengaluru/{area-slug}/{cuisine-slug}/`.

Chosen over `/​{cuisine}/{area}/` because it nests under the already-established area namespace (`/bengaluru/{area}/`), so the parent-child relationship in the breadcrumb and in `generateStaticParams` is a straightforward extension of the existing area page, and it cannot collide with the cuisine hub route (`/{cuisine}/`) or the dish route (`/{cuisine}/{dish}/}`) because it always starts with `/bengaluru/`.

`src/data/area-cuisine.ts`:

```ts
export interface AreaCuisineEntry {
  areaSlug: string;      // must exist in AREAS
  cuisine: string;       // must exist in CUISINES
  extraParagraph: string; // required, non-empty, content not on the parent Area_Page or Cuisine_Hub_Page
  faq?: { q: string; a: string }[];
  published: boolean;    // Publication_Gate outcome, set by whoever authors the entry
}
export const AREA_CUISINE_ENTRIES: AreaCuisineEntry[] = [ /* curated, hand-authored */ ];
```

`src/app/bengaluru/[area]/[cuisine]/page.tsx`:
- `generateStaticParams()` returns only entries where `published === true` — this is what makes Requirement 4.3's 20%-of-areas cap and Requirement 12.4's "excluded from sitemap and Internal_Linking" true by construction: an unpublished entry never becomes a route, so it cannot appear in the sitemap or be linked, and visiting its URL is a genuine 404.
- The Content_Validator (below) is the enforcement backstop that fails the build if the *count* of published entries exceeds the cap, or if `extraParagraph` is missing.

`AreaCuisinePage.tsx` (new component): same visual shell as the existing `bengaluru/[area]/page.tsx` (hero, breadcrumb, FAQ, `Steps`, `CtaBand`) but scoped to one cuisine, rendering `extraParagraph` as a distinct lead-in section, and linking back to both `/bengaluru/{area}/` and `/{cuisine}/` (Requirement 4.4). The existing Area_Page gains a small "Also available in {area}: {Cuisine}" link block that only renders for cuisines with a published entry for that area — this is how the area page participates in Requirement 10.2 (homepage-reachable chain) for this page type.

### Occasion Page (Requirement 5)

Route: `/occasions/{occasion-slug}/`, with an index at `/occasions/`.

`src/data/occasions.ts`:

```ts
export interface Occasion {
  slug: string;
  name: string;                     // e.g. "Weekly Office Lunch Orders"
  shortDescription: string;
  workedExample: { headcount: number; suggestedDishSlugs: string[]; notes: string };
  recommendedDishSlugs: string[];
  faq: { q: string; a: string }[];
  published: boolean;
}
export const OCCASIONS: Occasion[] = [ /* 5 entries, see Data Models */ ];
```

`OccasionPage.tsx` (new component): breadcrumb Home → Occasions → {Occasion}; a "typical order" block rendering `workedExample` as plain text/table (no new component needed — a simple `<dl>`/table is enough, avoiding invented UI); a dish-suggestion grid reusing `DishList`; `Faq`; `CtaBand` linking to `/enquire/?occasion={slug}` (new pre-fill param, see Enquiry Pre-fill below).

The one-off "office or corporate orders" and the new "recurring or weekly office lunch orders" occasions each get their own `workedExample` and `recommendedDishSlugs`, which is how Requirement 5.5 (distinctness between the two) is satisfied concretely, and how the Content_Validator's duplicate-title/description check (Requirement 12.3) is expected to pass.

### Guide Page (Requirement 6)

Route: `/guides/{guide-slug}/`, with an index at `/guides/`.

`src/data/guides.ts`:

```ts
export interface Guide {
  slug: string;
  title: string;
  description: string;        // meta description, unique
  body: string[];             // paragraphs, plain text; joined length must be >= 200 words
  relatedLinks: { href: string; label: string }[]; // >=1, cuisine/occasion/enquire
  published: boolean;
}
export const GUIDES: Guide[] = [ /* see Data Models */ ];
```

`GuidePage.tsx` (new component): breadcrumb Home → Guides → {Guide}; renders `body` paragraphs as prose (matching the `.prose` CSS class already used on the About page); a related-links block; `CtaBand`.

### Sitemap and internal linking (Requirements 10, 11)

`sitemap.ts` is extended to also enumerate:
- `CUISINES` (hub URLs),
- every `Dish` under its cuisine (dish URLs),
- `AREA_CUISINE_ENTRIES.filter(e => e.published)`,
- `OCCASIONS.filter(o => o.published)`,
- `GUIDES.filter(g => g.published)`.

Because each of these lists is exactly the same list each page route's `generateStaticParams()` consumes, the sitemap can never list a page the build didn't actually generate, and the build can never generate a page the sitemap omits — there is one source of truth (the `published` flag on the data entry, or unconditional inclusion for cuisines/dishes which have no gate).

Curated internal-linking additions (Requirement 10.3, 10.4), extending the existing `FEATURED_AREAS`-style pattern rather than inventing a new mechanism:
- Footer gains a curated "Popular dishes" list (5-6 hand-picked slugs, like `FEATURED_AREAS`) and an "Occasions" list (all 5, since 5 is already a curated-size number) and a "Guides" list (all guides, same reasoning).
- Homepage gains a short "Planning something specific?" section linking to the 5 occasion pages and to `/guides/`, so every occasion and guide page is reachable within a short click-chain from `/`, satisfying Requirement 10.2.
- Cuisine hub pages already link to every dish in that cuisine (via the existing dish grid) — extending that grid's cards to link to the new dish detail route satisfies "reachable from parent Cuisine_Hub_Page" (Requirement 3.6) with no new component.

### Enquiry pre-fill extension (Requirement 3.7, 4.5, 5.4, 14)

`EnquiryForm.tsx` already reads `?area=` and `?dish=` from the URL on mount and pre-fills accordingly. This is extended, not replaced:

- New query param `occasion`: on mount, if present and matches an `Occasion` slug, pre-fill the notes field with `Occasion: {occasion.name}`.
- Area_Cuisine_Page CTA links to `/enquire/?area={areaSlug}&dish={representativeDishSlug}`, where the representative dish is the first `featured` dish of that cuisine (falling back to the first dish of that cuisine) — reusing the existing `dish` param, no new form logic needed beyond what already exists.
- Occasion_Page CTA links to `/enquire/?occasion={slug}`.
- Dish_Detail_Page CTA links to `/enquire/?dish={slug}` (already supported, unchanged).
- Guide_Page CTAs link to `/enquire/` or to a relevant cuisine/occasion link, per guide content — no pre-fill needed since guides aren't tied to one specific dish/area.

## Data Models

### Extended `Dish` (Requirement 1, 2, 3)

```ts
export type Cuisine = "biryani" | "north" | "south" | "sweets" | "starters";
export interface Dish {
  slug: string;
  name: string;
  aka?: string[];                 // e.g. Kannada/regional alternate names
  cuisine: Cuisine;
  diet: "veg" | "nonveg";
  unit: "kg" | "pieces" | "litres";
  desc: string;                   // short card copy, >= 15 words (existing rule, now enforced by validator)
  longDescription: string;        // detail-page copy, >= 40 words, must differ from desc
  image?: string;
  featured?: boolean;
  healthClaimConfirmed?: boolean; // required true if desc/longDescription contains a flagged health/diet-claim term
}
```

Growing from 36 to 70+ dishes and from 4 to 5 cuisine categories (adding `starters` — bulk-order staples such as veg/non-veg starters — alongside the existing biryani/north/south/sweets) is a data-entry task against this shape, tracked in tasks.md; every new entry's dishes must be confirmed by the business owner as genuinely prepared (Requirement 2.1) before being marked `featured` or otherwise promoted — this is a content-authoring discipline, not something code can verify, so the validator can only check the *structural* rules (fields present, lengths, health-claim flag), never "is this dish real."

### New `Occasion`, `Guide`, `AreaCuisineEntry`, `CuisineDef`

Shapes are given inline above under Components and Interfaces. All four follow the same convention already used by `Dish` and `Area`: plain exported arrays of plain objects, no runtime fetching, no CMS.

## Content_Validator Design (Requirement 2.2, 2.3, 4.2, 4.3, 6.4, 7.3, 12)

`scripts/validate-content.ts`, run via `tsx scripts/validate-content.ts` as the npm `prebuild` script (so `npm run build` always runs it first; a non-zero exit stops the build before `next build` starts).

Inputs: it imports the same data modules the app imports (`dishes.ts`, `cuisines.ts`, `areas.ts`, `area-cuisine.ts`, `occasions.ts`, `guides.ts`) and the same `pageMeta`-style title/description strings each route would generate — computed via small shared "title/description builder" functions extracted into `src/lib/seo-strings.ts` so the validator and the actual pages call the *identical* function (Requirement 8.5's "same pattern" guarantee becomes literal code reuse, not just convention).

Checks, each producing a clearly-worded error (plain language, matching this project's existing tone) and contributing to a non-zero exit code if any check fails:

1. **Required fields / min lengths** (Req 2.2, 6.2, 12.2): every `Dish`, `Occasion`, `Guide`, `AreaCuisineEntry` has all required fields non-empty and meeting its minimum word/character length (dish `desc` ≥ 12 words (concise card copy), `longDescription` ≥ 40 words, guide `body` joined ≥ 200 words, `AreaCuisineEntry.extraParagraph` non-empty).
2. **Slug uniqueness** (Req 1.4): every dish slug is unique across the whole catalog; every occasion/guide slug unique within its own list.
3. **Health-claim guard** (Req 2.3): scans `desc`/`longDescription` for a small fixed list of flagged terms (`diabetic`, `gluten-free`, `allergen-free`, `sugar-free`, `keto`, `low-oil`, "cures", "healthy for") — if found and `healthClaimConfirmed` is not `true`, fails.
4. **Title/description uniqueness** (Req 8.1, 8.2, 12.3): builds the full list of titles and descriptions that will be generated for every indexable route (cuisine hubs, dishes, published area-cuisine entries, published occasions, published guides, area pages, static pages) using the shared `seo-strings.ts` builders, and fails if any two are identical.
5. **Area_Cuisine cap** (Req 4.3): fails if `AREA_CUISINE_ENTRIES.filter(e => e.published).length` exceeds `Math.floor(AREAS.length * 0.2)`.
6. **Area_Cuisine distinct-content presence** (Req 4.2): fails if any *published* entry has an empty/whitespace `extraParagraph`.
7. **No near-me doorway pages** (Req 7.3): fails if any data file's `slug` or `name`/`title` field contains "near me" or "nearby" as a defensive guard, since no page type in this design is allowed to be a near-me variant of an existing page.
8. **Guide/area overlap guard** (Req 6.4): a lightweight heuristic — fails if a guide's `body` text and an existing `Area_Page`'s or `Cuisine_Hub_Page`'s generated copy share a long (≥ 12-word) exact substring, catching accidental copy-paste duplication without needing a full plagiarism engine.

The script prints all failing checks together (not just the first one), each prefixed with the data file and entry slug, so a content author gets one clear list to fix — consistent with Requirement 12.2's intent.

## Traceability

| Requirement | Design section |
|---|---|
| 1. Dish catalog expansion | Extended `Dish` model; data-driven cuisine hub; Content_Validator check 1–2 |
| 2. Dish content integrity | Content_Validator checks 1 and 3; `healthClaimConfirmed` field |
| 3. Dish detail pages | Dish Detail Page section; `RelatedDishes.tsx`; enquiry pre-fill |
| 4. Area+cuisine pages | Area + Cuisine Page section; `area-cuisine.ts`; Content_Validator checks 5–6 |
| 5. Occasion pages | Occasion Page section; `occasions.ts`; worked-example model |
| 6. Guide pages | Guide Page section; `guides.ts`; Content_Validator checks 1 and 8 |
| 7. No near-me doorway pages | Design never creates a near-me page type; Content_Validator check 7 |
| 8. Sitewide metadata consistency | Shared `seo-strings.ts` builders reused by pages and validator |
| 9. Sitewide structured data | Existing `breadcrumbLd`/`JsonLd` reused on every new page type |
| 10. Sitewide internal linking | Sitemap/internal-linking section; footer and homepage additions |
| 11. Sitemap/robots accuracy | Single-source-of-truth `published` flag feeding both `generateStaticParams` and `sitemap.ts` |
| 12. Content Publication Gate | Content_Validator Design section in full |
| 13. Performance budget | Reuses existing `HIGH_PRIORITY`/lazy-loading convention; no new mechanism |
| 14. WhatsApp enquiry reused everywhere | Every new component ends in a `CtaBand`/`EnquiryForm` link; no booking/cart/login introduced |
| 15. Non-goals / honest claims | No rating/order-count fields added to any new data model; occasions/guides describe planning help, not guarantees |

## Correctness Properties

These are the invariants the design relies on; the Content_Validator and the testing strategy below exist to keep them true as content is added over time.

### Property 1: Sitemap equals generated pages

For every page type gated by a `published` flag (Area_Cuisine_Page, Occasion_Page, Guide_Page), the set of URLs in `sitemap.xml` is always exactly equal to the set of URLs actually present in the static export — never a superset (a linked-but-missing page) or a subset (a generated-but-unlisted page). This holds by construction because `sitemap.ts` and each route's `generateStaticParams()` both filter the same underlying data array by the same `published` field.

**Validates: Requirements 11.1, 11.2**

### Property 2: No orphan pages

Every page produced by `generateStaticParams()` across every route is reachable from `/` through some chain of on-page links (Requirement 10.2). This is checked structurally (see Testing Strategy) rather than assumed.

**Validates: Requirements 10.2, 10.3**

### Property 3: No duplicate SEO identity

No two indexable pages ever share a title or meta description, enforced by the Content_Validator computing every page's title/description from the same shared builder functions the pages themselves use, before the build proceeds.

**Validates: Requirements 8.1, 8.2, 12.3**

### Property 4: Unpublished means absent, not hidden

An `AreaCuisineEntry`/`Occasion`/`Guide` with `published: false` never becomes a route (`generateStaticParams` excludes it), so visiting its URL is a genuine 404 rather than a noindex page — there is no "soft-published" state that could be crawled by guessing a URL.

**Validates: Requirements 4.2, 4.3, 11.2, 12.4**

### Property 5: Cuisine/dish namespace safety

A dish is only reachable at `/{cuisine}/{dish}/` when `dish.cuisine === cuisine.slug`; the route rejects any other combination via `notFound()`, so there is exactly one canonical URL per dish.

**Validates: Requirements 3.1, 8.4**

## Error Handling

- **Content_Validator failure**: exits with a non-zero status and prints every failing check (not just the first), each line naming the data file, the entry's slug, and the specific rule violated in plain language (for example: `dishes.ts: "gulab-jamun" — longDescription is 28 words, needs at least 40`). Because it runs as the npm `prebuild` step, `next build` never starts, so a bad content change cannot reach `out/` or a deployed site.
- **Unknown route segments at build time**: `generateStaticParams()` for every dynamic route (`[cuisine]`, `[cuisine]/[dish]`, `bengaluru/[area]/[cuisine]`, `occasions/[occasion]`, `guides/[guide]`) is paired with `dynamicParams = false`, so any URL not present in the corresponding data array (mistyped, unpublished, or removed) resolves to the existing `not-found.tsx` page at request time in `next start`/static hosting, and is simply never generated during `next build` — there is no runtime lookup that could throw.
- **Missing dish photo**: `DishDetailPage` falls back to the parent cuisine's `heroImage` rather than omitting the image or breaking layout, so a newly-added dish without a photo never produces a broken `<img>`.
- **Representative-dish lookup for Area_Cuisine CTA**: if a cuisine has no `featured` dish (should not happen given Requirement 1 minimums, but guarded anyway), the CTA falls back to that cuisine's first catalog entry rather than omitting the `dish` query parameter, so the enquiry form pre-fill never silently degrades to blank.
- **Malformed or missing `site.ts` contact details**: unchanged from the current site — `EnquiryForm` already renders a setup notice instead of failing when `HAS_WHATSAPP`/`HAS_PHONE` are false; every new page type reuses `EnquiryForm`/`CtaBand` as-is, so this behaviour extends automatically without new handling.

## Testing Strategy

- **Build-time gate**: `npm run build` must fail when `scripts/validate-content.ts` is given a deliberately broken fixture (missing field, duplicate title, over-cap area-cuisine count, unconfirmed health claim, near-me slug) and must pass on the real data — verified by a small test harness (`scripts/validate-content.test.ts` or equivalent) that runs the validator against in-memory fixture arrays rather than the real data files.
- **Static export smoke check**: after `next build`, assert (via a script reading the exported `out/` directory) that every URL present in `sitemap.xml` has a corresponding generated HTML file, and that a sample of unpublished `area-cuisine`/`occasions`/`guides` slugs are genuinely absent (404) from `out/`.
- **Manual visual/link review**: as with the existing site, new templates are reviewed in the browser preview (`preview.sh`) before rollout, checking breadcrumb correctness, related-link correctness, and enquiry pre-fill correctness for at least one instance of each new page type.
