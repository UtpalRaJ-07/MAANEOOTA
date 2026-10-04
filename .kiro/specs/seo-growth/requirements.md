# Requirements Document

## Introduction

MAANE OOTA's website (`website/`) is a static, no-login, no-payment marketing site for a bulk food business in Bengaluru (biryani, North Indian, South Indian dishes). Every enquiry is handled by WhatsApp or phone; there is no booking, cart or checkout. Today the site has a small menu (36 dishes across 4 categories), 156 area pages, 3 cuisine hub pages, a menu page and a handful of static pages (home, about, enquire, credits).

This feature grows the site's SEO footprint so it can be found for many more searches across Bengaluru, in support of the business goal of far more daily enquiries and orders. That order-volume goal is the *reason* for this work, not something the website itself can guarantee — no acceptance criterion below promises a ranking position, traffic number or order count.

Growth happens in three ways:

1. **More dishes** in the existing data-driven menu, so more specific dish searches match a real page.
2. **More page types**, not just more area pages: a page per dish, a small reviewed set of area+cuisine combination pages, occasion pages (one-off office orders, recurring office lunch orders, functions, festivals, bulk headcounts) and short planning guides.
3. **Consistent SEO mechanics everywhere** — titles, descriptions, H1s, canonicals, structured data, internal links, sitemap and robots — applied the same way on old and new pages, protected by an automated check that blocks thin or duplicate pages.

This spec reuses relevant ideas from `SEO-AREA-AND-KEYWORD-REGISTER.md` and `MAANE-OOTA-MASTER-PLAN.md` (anti-doorway publication gates, keyword-to-page ownership, alias handling, controlled local-intent expansion, honest measurement). Those two documents were written for a different, much larger multi-kitchen marketplace concept with logins, checkout, payments and partner onboarding. That marketplace machinery is explicitly **not** part of this feature — MAANE OOTA today is one kitchen, one static site, one WhatsApp enquiry flow, and this spec keeps it that way while growing its content and search surface.

Because there is no CMS, "content" here means TypeScript data files (`src/data/dishes.ts`, `src/data/areas.ts`, and new data files for occasions/guides) and the page templates that render them at build time. Acceptance criteria are written against that reality.

## Glossary

- **Website**: The MAANE OOTA static Next.js site as a whole — informational pages plus a WhatsApp-based enquiry flow, with no booking, payment or login.
- **Dish_Catalog**: The structured list of dishes in `src/data/dishes.ts` (name, slug, cuisine, diet, unit, description, optional image/alternate names).
- **Area_Directory**: The structured list of Bengaluru areas in `src/data/areas.ts`, grouped into zones.
- **Cuisine_Hub_Page**: A page dedicated to one cuisine/category of dishes (today: `/biryani/`, `/north-indian/`, `/south-indian/`, and the `/menu/` overview).
- **Area_Page**: A page dedicated to one Bengaluru area (`/bengaluru/{area}/`).
- **Dish_Detail_Page**: A new page type dedicated to a single dish from the Dish_Catalog.
- **Area_Cuisine_Page**: A new page type combining one Area_Directory entry with one Cuisine_Hub_Page's cuisine.
- **Occasion_Page**: A new page type addressing one use case or occasion (for example one-off office or corporate orders, recurring or weekly office lunch orders, family functions, festival bulk orders, headcount-based bulk orders).
- **Guide_Page**: A new page type with planning/informational content (for example quantity-per-guest guides) that is not an area, cuisine or dish listing.
- **Metadata_Builder**: The shared utility (`src/lib/meta.ts`) producing page titles, meta descriptions, canonical URLs, and Open Graph/Twitter tags.
- **Structured_Data**: The schema.org JSON-LD markup emitted through the `JsonLd` component.
- **Sitemap_Generator**: The build-time module producing `sitemap.xml` (`src/app/sitemap.ts`).
- **Robots_File**: The build-time module producing `robots.txt` (`src/app/robots.ts`).
- **Enquiry_Form**: The WhatsApp-based enquiry component (`EnquiryForm.tsx`) used across the site.
- **Internal_Linking**: Navigation elements connecting pages — main nav, footer, breadcrumbs, related-page links and nearby-area/nearby-dish links.
- **Publication_Gate**: The set of content-quality rules a candidate new page (dish, area+cuisine, occasion, guide) must satisfy before it is linked internally and included in the sitemap.
- **Content_Validator**: The automated check(s), run during the Build_Process, that enforce Publication_Gate rules.
- **Build_Process**: The static-site generation process (`npm run build`) that produces the exported site.

## Requirements

### Requirement 1: Dish Catalog Expansion

**User Story:** As the MAANE OOTA business owner, I want the dish catalog significantly expanded across relevant categories, so that more specific dish-name searches lead visitors to a matching page.

#### Acceptance Criteria

1. THE Dish_Catalog SHALL contain at least 70 dishes.
2. THE Dish_Catalog SHALL group dishes into at least 5 cuisine categories.
3. THE Dish_Catalog SHALL record, for every dish, a name, a slug, a cuisine category, a diet classification of veg or non-veg, an order unit of kg, pieces or litres, and a short card description of at least 12 words plus a longer dish-page description of at least 40 words.
4. THE Dish_Catalog SHALL assign every dish a slug that is unique across the entire catalog.
5. WHEN a dish is added to the Dish_Catalog, THE Website SHALL display that dish on its Cuisine_Hub_Page and on the Menu page without a separate code change to those pages.
6. WHERE a dish has a well-known Kannada, Karnataka-regional, or other commonly searched alternate name, THE Dish_Catalog SHALL record that alternate name alongside the dish's primary name.

### Requirement 2: Dish Content Integrity

**User Story:** As the business owner, I want every listed dish to reflect food the kitchen genuinely prepares, so that the expanded menu stays accurate and does not overstate what is on offer.

#### Acceptance Criteria

1. THE Website SHALL list, in the Dish_Catalog, only dishes the business has confirmed it prepares.
2. IF a Dish_Catalog entry is missing its required name, slug, cuisine, diet, unit, or description field, THEN THE Content_Validator SHALL fail the Build_Process.
3. IF a dish description contains a health, dietary-restriction, or medical claim (for example diabetic-friendly, gluten-free, allergen-free), THEN THE Content_Validator SHALL fail the Build_Process unless the Dish_Catalog entry also records a business-supplied confirmation for that specific claim.

### Requirement 3: Dish Detail Pages

**User Story:** As a visitor who searched for a specific dish, I want a dedicated page for that dish, so that I can read about it and start an enquiry without hunting through the full menu.

#### Acceptance Criteria

1. THE Website SHALL generate one Dish_Detail_Page for every dish recorded in the Dish_Catalog.
2. THE Dish_Detail_Page SHALL present a written description of the dish at least 40 words long, distinct from the short listing description shown on Cuisine_Hub_Page and Menu page cards.
3. THE Dish_Detail_Page SHALL display the dish's diet classification, order unit, and cuisine category.
4. WHERE a dish has an associated photograph, THE Dish_Detail_Page SHALL display that photograph with alternative text naming the dish.
5. THE Dish_Detail_Page SHALL link to at least 2 other dishes from the same or a related cuisine category.
6. THE Dish_Detail_Page SHALL be reachable by a link from its parent Cuisine_Hub_Page and from the Menu page.
7. WHEN a visitor selects the enquiry call-to-action on a Dish_Detail_Page, THE Enquiry_Form SHALL pre-fill that dish as the requested item.

### Requirement 4: Area + Cuisine Combination Pages

**User Story:** As the business owner, I want a small, reviewed set of pages combining a specific area with a specific cuisine, so that high-intent local searches can be captured only where there is enough genuinely distinct content to justify a separate page.

#### Acceptance Criteria

1. THE Website SHALL treat each Area_Cuisine_Page as an individually reviewed candidate, not as a page automatically generated for every Area_Directory and Cuisine_Hub_Page pairing.
2. THE Publication_Gate SHALL require an Area_Cuisine_Page to include at least one paragraph of content not present on its parent Area_Page or parent Cuisine_Hub_Page before that page is added to Internal_Linking and the Sitemap_Generator output.
3. THE Website SHALL NOT include more Area_Cuisine_Pages in the Build_Process output than 20% of the number of areas recorded in the Area_Directory.
4. WHEN an Area_Cuisine_Page is published, THE Website SHALL link that page back to its parent Area_Page and its parent Cuisine_Hub_Page.
5. WHEN a visitor selects the enquiry call-to-action on an Area_Cuisine_Page, THE Enquiry_Form SHALL pre-fill the area and a representative dish from that cuisine.

### Requirement 5: Occasion and Bulk Use-Case Pages

**User Story:** As a visitor planning food for a specific occasion, I want a page addressing that occasion, so that I can see relevant guidance and typical quantities before enquiring.

#### Acceptance Criteria

1. THE Website SHALL provide an Occasion_Page for each of at least these occasion categories: one-off office or corporate orders, recurring or weekly office lunch orders, family functions and celebrations, festival bulk orders, and headcount-based bulk orders.
2. THE Occasion_Page SHALL present occasion-specific guidance, including at least one worked example of a typical order for that occasion, distinct from generic Cuisine_Hub_Page or Area_Page content.
3. THE Occasion_Page SHALL list dishes from the Dish_Catalog suited to that occasion.
4. WHEN a visitor selects the enquiry call-to-action on an Occasion_Page, THE Enquiry_Form SHALL pre-fill the occasion name in the enquiry notes.
5. THE Occasion_Page addressing recurring or weekly office lunch orders SHALL present a worked example, dish suggestions, and guidance distinct from those on the Occasion_Page addressing one-off office or corporate orders.

### Requirement 6: Buying and Planning Guide Pages

**User Story:** As a visitor unfamiliar with ordering bulk food, I want short guides answering practical planning questions, so that I can enquire with the right quantity and details.

#### Acceptance Criteria

1. THE Website SHALL publish a set of Guide_Pages answering practical ordering questions, including at minimum: estimating quantity per guest for biryani and curries, planning food for a given headcount, and comparing veg and non-veg quantity needs.
2. THE Guide_Page SHALL contain original written content of at least 200 words per guide.
3. THE Guide_Page SHALL link to at least one relevant Cuisine_Hub_Page, Occasion_Page, or the Enquiry_Form.
4. IF a Guide_Page's text substantially overlaps with the text of an existing Area_Page or Cuisine_Hub_Page, THEN THE Content_Validator SHALL fail the Build_Process.
5. THE Sitemap_Generator SHALL include every published Guide_Page.

### Requirement 7: Local and "Near Me" Search Intent Without Doorway Pages

**User Story:** As a visitor searching with "near me" or hyperlocal phrasing, I want to land on a genuinely useful area or city page, so that MAANE OOTA's local search presence stays accurate and free of thin, near-duplicate pages.

#### Acceptance Criteria

1. THE Website SHALL address near-me and hyperlocal search intent through the existing Area_Page and city-level content rather than through a page created separately for each near-me keyword variant.
2. THE Area_Page SHALL include Structured_Data identifying the area served, so local relevance is communicated without a dedicated near-me page.
3. IF a proposed page's content is identical to an existing Area_Page except for inserting a "near me" or synonymous phrase into the title and H1, THEN THE Publication_Gate SHALL reject that page.

### Requirement 8: Sitewide Metadata and Keyword Consistency

**User Story:** As the business owner, I want every page, old and new, to follow one consistent metadata pattern, so that search engines and visitors get clear, non-duplicated signals about each page's topic.

#### Acceptance Criteria

1. THE Metadata_Builder SHALL generate a unique page title for every indexable page produced by the Build_Process.
2. THE Metadata_Builder SHALL generate a unique meta description for every indexable page produced by the Build_Process.
3. THE Metadata_Builder SHALL generate exactly one H1 heading per page, stating that page's primary topic of area, dish, cuisine, occasion, or guide subject.
4. THE Metadata_Builder SHALL include a self-referencing canonical URL for every indexable page.
5. WHEN a Dish_Detail_Page, Area_Cuisine_Page, Occasion_Page, or Guide_Page is added, THE Metadata_Builder SHALL apply the same title, description, and canonical pattern used by existing page types.

### Requirement 9: Sitewide Structured Data

**User Story:** As the business owner, I want consistent, accurate structured data across the site, so that search engines can understand pages without any exaggerated or fabricated claims.

#### Acceptance Criteria

1. THE Website SHALL include BreadcrumbList Structured_Data on every page below the homepage, including Dish_Detail_Page, Area_Cuisine_Page, Occasion_Page, and Guide_Page instances.
2. THE Website SHALL include Structured_Data describing the business, its cuisine types, and its area served on the homepage.
3. IF Structured_Data would include a review rating, aggregate rating, or price figure, THEN THE Website SHALL omit that figure unless the business has supplied and confirmed it.
4. THE Website SHALL present FAQ content as visible on-page content without depending on FAQPage Structured_Data for search result enhancements.

### Requirement 10: Sitewide Internal Linking

**User Story:** As a visitor or search crawler, I want clear links connecting related pages, so that every page, including new ones, can be discovered and understood in context.

#### Acceptance Criteria

1. THE Website SHALL provide a breadcrumb trail on every page below the homepage, including all new page types, reflecting that page's position in the site hierarchy.
2. THE Website SHALL make every indexable page reachable from the homepage through a chain of on-page links, without relying on the sitemap alone.
3. THE Dish_Detail_Page, Area_Cuisine_Page, Occasion_Page, and Guide_Page SHALL each link back to at least one broader hub page that contains them, being a Cuisine_Hub_Page, an Area_Page, or the Menu page.
4. THE Website SHALL limit the number of area links shown in a single footer or navigation block to a curated subset rather than listing every Area_Directory entry.

### Requirement 11: Sitemap and Robots Completeness and Accuracy

**User Story:** As a search engine crawler, I want the sitemap and robots file to accurately reflect exactly the pages the business wants indexed, so that crawl effort is not wasted on thin or unwanted pages as the site grows.

#### Acceptance Criteria

1. THE Sitemap_Generator SHALL include every page that has passed the Publication_Gate, including Dish_Detail_Page, Area_Cuisine_Page, Occasion_Page, and Guide_Page entries.
2. THE Sitemap_Generator SHALL exclude every page that has not passed the Publication_Gate.
3. THE Robots_File SHALL allow crawling of every page included in the Sitemap_Generator output.
4. THE Sitemap_Generator SHALL record a lastmod date for every URL, reflecting when that page's content last changed.

### Requirement 12: Content Publication Gate

**User Story:** As the business owner, I want an automated check that blocks thin or duplicate pages from being published, so that growing the number of pages does not create low-quality content that could hurt search rankings.

#### Acceptance Criteria

1. THE Content_Validator SHALL run as part of the Build_Process.
2. IF a candidate page is missing a required content field, being its title, description, H1, or body content, or that field is shorter than its defined minimum length, THEN THE Content_Validator SHALL fail the Build_Process.
3. IF two indexable pages have identical titles or identical meta descriptions, THEN THE Content_Validator SHALL fail the Build_Process.
4. IF a candidate Area_Cuisine_Page, Occasion_Page, or Guide_Page does not meet its Publication_Gate content requirements, THEN THE Content_Validator SHALL exclude that page from the Sitemap_Generator output and from Internal_Linking.

### Requirement 13: Performance Budget as Pages and Images Scale

**User Story:** As a visitor on a mobile connection, I want pages to stay fast even as the site adds many more pages and photos, so that browsing and enquiring remains quick.

#### Acceptance Criteria

1. THE Website SHALL load at most one high-priority, eager-loaded image per page across every page type.
2. THE Website SHALL apply lazy loading to every image that is not a page's primary hero image.
3. THE Build_Process SHALL produce a static export for every new page type, consistent with the existing static export approach.
4. THE Build_Process SHALL generate all Dish_Detail_Page, Area_Cuisine_Page, Occasion_Page, and Guide_Page instances from their underlying data files, without a separate hand-written page file per instance.

### Requirement 14: WhatsApp Enquiry Model Reused on Every New Page

**User Story:** As a visitor on any page of the site, I want the same simple way to enquire on WhatsApp, so that the ordering process stays consistent regardless of which page brought me to the site.

#### Acceptance Criteria

1. THE Website SHALL display a call-to-action linking to the Enquiry_Form on every page, including all new page types.
2. WHEN a visitor arrives at a Dish_Detail_Page, Area_Cuisine_Page, Occasion_Page, or Guide_Page, THE Enquiry_Form SHALL remain reachable within one click from that page.
3. IF a new page design would add a booking form, shopping cart, payment field, or login requirement, THEN THE Website SHALL exclude that element and route the visitor to the Enquiry_Form instead.

### Requirement 15: Non-Goals and Guardrails on Claims

**User Story:** As the business owner, I want the SEO growth work to stay honest about what can be promised, so that the site's content does not overstate guaranteed results.

#### Acceptance Criteria

1. THE Website SHALL publish only rating, review, testimonial, or daily or monthly order-count figures that the business has explicitly supplied and confirmed as accurate.
2. THE Website's on-page content SHALL present Bengaluru-wide coverage and order-volume goals as business aspirations, and SHALL NOT present them as guaranteed search ranking positions, guaranteed traffic, or guaranteed order counts.
3. THE Website SHALL continue to operate without an online booking flow, payment collection, or user login, consistent with its current WhatsApp-enquiry-only model.
