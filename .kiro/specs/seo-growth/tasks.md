# Implementation Plan

## Overview

Each task is small, testable, and builds on the previous ones. Every task edits the
static Next.js site under `website/`. Tasks are ordered so the site stays buildable
after each one, and so the Content_Validator (task 3) exists before the page types it
guards are added. Requirement references point back to `requirements.md`; the design
they implement is in `design.md`.

Guiding constraints carried from the design:
- Static export only (`output: "export"`), no server, no CMS, no login/cart/payment.
- Every new page type reuses the existing `EnquiryForm`, `CtaBand`, `JsonLd`/breadcrumb, and metadata utilities.
- Gated page types (area+cuisine, occasion, guide) are driven by a `published` flag that feeds both `generateStaticParams()` and the sitemap, so the two can never disagree.

## Task Dependency Graph

```
1 (seo-strings + cuisines data)
├── 2 (dish model + catalog) ──┐
│   2.1 → 2.2                  │
├── 3 (validator) ────────────┤   3.1 → 3.2 → 3.3
│                             │
4 (data-driven cuisine hubs)  │   needs 1, 2
5 (dish detail pages)         │   needs 1, 2, 4
│   5.1 → 5.2                 │
6 (occasion pages)                needs 1, 2
7 (guide pages)                   needs 1
8 (area+cuisine pages)            needs 1, 2, 4
9 (structured data + linking)     needs 4, 5, 6, 7, 8
10 (sitemap)                      needs 5, 6, 7, 8
11 (honesty guardrails review)    needs 6, 7, 8, 9
12 (full verification)            needs all above; 3 must be wired in
```

Critical path: 1 → 2 → 4 → 5 → 8 → 9 → 10 → 12. Tasks 3, 6 and 7 can be done in parallel once their inputs exist.

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2.1", "3.1", "7"] },
    { "wave": 3, "tasks": ["2.2", "3.2"] },
    { "wave": 4, "tasks": ["3.3", "4", "6"] },
    { "wave": 5, "tasks": ["5.1", "8"] },
    { "wave": 6, "tasks": ["5.2"] },
    { "wave": 7, "tasks": ["9"] },
    { "wave": 8, "tasks": ["10", "11"] },
    { "wave": 9, "tasks": ["12"] }
  ],
  "dependencies": {
    "1": [],
    "2.1": ["1"],
    "2.2": ["2.1"],
    "3.1": ["1"],
    "3.2": ["3.1"],
    "3.3": ["3.2"],
    "4": ["1", "2.2"],
    "5.1": ["2.2"],
    "5.2": ["4", "5.1"],
    "6": ["1", "2.2"],
    "7": ["1"],
    "8": ["4", "2.2"],
    "9": ["4", "5.2", "6", "7", "8"],
    "10": ["5.2", "6", "7", "8"],
    "11": ["6", "7", "8", "9"],
    "12": ["3.3", "9", "10", "11"]
  }
}
```

## Tasks

- [x] 1. Add the shared SEO string builders and extend the cuisine data model
  - Create `website/src/lib/seo-strings.ts` with pure functions that build the title, meta description and H1 for every page type (home, cuisine hub, dish, area, area+cuisine, occasion, guide). These are the single source of truth reused by both the page templates and the validator.
  - Create `website/src/data/cuisines.ts` with a `CuisineDef` array covering the existing `biryani`, `north-indian`, `south-indian` slugs plus `sweets` and `starters`, each with `slug`, `name`, `intro`, and a `heroImage` referencing an existing `WIDE` image.
  - Keep the existing `Cuisine` union in `dishes.ts` in sync (add `"starters"`).
  - _Requirements: 1.2, 8.1, 8.2, 8.3, 8.5_

- [x] 2. Extend the Dish model and expand the catalog to 70+ confirmed dishes
- [x] 2.1 Extend the `Dish` type and migrate existing entries
  - Add `aka?`, `longDescription` (>=40 words, distinct from `desc`), and `healthClaimConfirmed?` fields to the `Dish` interface in `website/src/data/dishes.ts`.
  - Backfill `longDescription` and any well-known alternate names for all existing dishes.
  - _Requirements: 1.3, 1.6, 3.2_
- [x] 2.2 Add new dishes across the 5 categories to reach at least 70 total
  - Add dishes to biryani, north, south, sweets and the new starters category, each with all required fields and a >=15-word `desc` and >=40-word `longDescription`.
  - Only include dishes the business prepares; leave a clear `// CONFIRM WITH OWNER` comment marker on any speculative additions so they can be reviewed/removed before launch.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1_

- [x] 3. Build the Content_Validator script and its tests
- [x] 3.1 Write the validator with an in-memory-testable core
  - Create `website/scripts/validate-content.ts` exporting a pure `validateContent(data)` function plus a thin CLI wrapper that loads the real data files and calls it.
  - Implement checks: required fields/min lengths, dish slug uniqueness, health-claim guard, title/description uniqueness (via `seo-strings.ts`), area-cuisine 20% cap, area-cuisine distinct-paragraph presence, near-me slug/name guard, guide/area copy-overlap heuristic. Collect and print ALL failures, exit non-zero on any.
  - _Requirements: 2.2, 2.3, 4.2, 4.3, 6.4, 7.3, 12.1, 12.2, 12.3, 12.4_
- [x] 3.2 Write validator tests against fixtures
  - Create `website/scripts/validate-content.test.ts` (or a runnable script) asserting the validator PASSES on valid fixture arrays and FAILS on each broken case: missing field, too-short description, duplicate title, over-cap area-cuisine count, unconfirmed health claim, near-me slug.
  - _Requirements: 12.1, 12.2, 12.3_
- [x] 3.3 Wire the validator into the build
  - Add a `prebuild` npm script running `tsx scripts/validate-content.ts`, and a standalone `validate` script, in `website/package.json`, so `npm run build` fails before `next build` if content is invalid.
  - _Requirements: 12.1_

- [x] 4. Convert cuisine hubs to a single data-driven dynamic route
  - Rename/generalize `website/src/components/CuisinePage.tsx` to render from a `CuisineDef` + `byCuisine(slug)`.
  - Create `website/src/app/[cuisine]/page.tsx` with `generateStaticParams()` over `CUISINES` and `dynamicParams = false`; use `seo-strings.ts` for metadata.
  - Remove the hardcoded `biryani/`, `north-indian/`, `south-indian/` page files, confirming the same URLs still render via the dynamic route (no redirects needed).
  - _Requirements: 1.5, 8.3, 8.4, 13.3, 13.4_

- [x] 5. Build Dish Detail pages
- [x] 5.1 Create the `RelatedDishes` component
  - Create `website/src/components/RelatedDishes.tsx` that picks >=2 related dishes (same cuisine first, then same diet) and renders them with the existing `DishCard`.
  - _Requirements: 3.5_
- [x] 5.2 Create the dish detail template and route
  - Create `website/src/components/DishDetailPage.tsx` (breadcrumb, hero with photo-or-cuisine-fallback, `longDescription`, diet/unit/cuisine row, `RelatedDishes`, `CtaBand` to `/enquire/?dish={slug}`).
  - Create `website/src/app/[cuisine]/[dish]/page.tsx` with `generateStaticParams()` over cuisine×dish, `dynamicParams = false`, and `notFound()` when `dish.cuisine !== cuisine` segment.
  - Link dish cards on the cuisine hub and menu page to the new dish route.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 8.4, 13.1, 13.2, 13.4_

- [x] 6. Build Occasion pages
  - Create `website/src/data/occasions.ts` with 5 entries (one-off office/corporate, recurring/weekly office lunch, family functions, festival bulk, headcount-based bulk), each with a distinct `workedExample`, `recommendedDishSlugs`, `faq`, and `published`.
  - Create `website/src/components/OccasionPage.tsx` and routes `website/src/app/occasions/page.tsx` (index) and `website/src/app/occasions/[occasion]/page.tsx`.
  - Add `?occasion=` pre-fill support to `EnquiryForm.tsx` (pre-fills the notes field).
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 14.1, 14.2_

- [x] 7. Build Guide pages
  - Create `website/src/data/guides.ts` with at least the three required guides (quantity per guest for biryani/curries, planning for a headcount, veg vs non-veg quantity), each `body` >=200 words with >=1 related link and `published`.
  - Create `website/src/components/GuidePage.tsx` and routes `website/src/app/guides/page.tsx` (index) and `website/src/app/guides/[guide]/page.tsx`.
  - _Requirements: 6.1, 6.2, 6.3, 13.3, 13.4_

- [x] 8. Build the curated Area+Cuisine pages
  - Create `website/src/data/area-cuisine.ts` with a small curated set (<= 20% of areas), each with a hand-written `extraParagraph`, optional `faq`, and `published`.
  - Create `website/src/components/AreaCuisinePage.tsx` and route `website/src/app/bengaluru/[area]/[cuisine]/page.tsx` generating only `published` entries; link back to parent area and cuisine pages; CTA pre-fills area + representative dish.
  - Add an "Also available" link block to the area page that appears only for areas with a published area-cuisine entry.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2, 7.3, 10.3_

- [x] 9. Extend structured data and internal linking across the site
  - Ensure every new template emits `BreadcrumbList` via the existing `breadcrumbLd`/`JsonLd`; confirm homepage business schema still describes cuisines and area served.
  - Add curated footer sections (Popular dishes, Occasions, Guides) and a homepage "Planning something specific?" block linking the 5 occasions and `/guides/`, so every new page is reachable from `/`.
  - Keep footer area links a curated subset, not all 156.
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.4_

- [x] 10. Extend the sitemap to all published pages
  - Update `website/src/app/sitemap.ts` to enumerate cuisine hubs, all dishes, and the `published` area-cuisine/occasion/guide entries, each with a `lastModified`, using the same filtered arrays the routes consume.
  - Confirm `robots.ts` still allows everything in the sitemap.
  - _Requirements: 6.5, 11.1, 11.2, 11.3, 11.4_

- [x] 11. Confirm honesty guardrails and non-goals hold
  - Review all new data files and templates: no rating/review/order-count fields or copy; coverage/volume framed as aspiration; no booking/cart/payment/login introduced anywhere.
  - _Requirements: 9.3, 14.3, 15.1, 15.2, 15.3_

- [x] 12. Full verification pass
  - Run `npm run typecheck`, `npm run validate`, and `npm run build`; fix any failures.
  - Run a post-build script asserting every `sitemap.xml` URL exists in `out/` and a sample of unpublished occasion/guide/area-cuisine slugs are absent (404).
  - Preview the site and manually check one instance of each new page type for breadcrumb, related-link, and enquiry pre-fill correctness.
  - _Requirements: 8.1, 8.2, 10.2, 11.1, 11.2, 13.1, 13.2, 13.3_

## Notes

- The site has no test framework yet. Task 3.2's validator tests run as a plain `tsx` script that exits non-zero on failure (matching the project's lightweight, script-based approach) rather than pulling in a heavy test runner.
- Dish authenticity (Requirement 2.1) cannot be verified by code — the validator only checks structure. Any dish marked `// CONFIRM WITH OWNER` must be reviewed by the business owner before launch.
- Existing cuisine URLs (`/biryani/`, `/north-indian/`, `/south-indian/`) are preserved by making their slugs entries in the new dynamic `[cuisine]` route, so no redirects are needed and existing inbound links keep working.
- The 20% area-cuisine cap on 156 areas is 31 pages maximum; start with far fewer, only where genuinely distinct local content exists.
