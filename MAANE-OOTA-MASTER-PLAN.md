# MAANE OOTA — Bengaluru orders, offers and SEO master plan

Prepared 29 September 2026. Planning document only; no website has been built or published.

## 1. The outcome to build for

Make MAANE OOTA the place to find and order homemade meals across Bengaluru: one person's lunch, a family's dinner, regular office meals and bulk food for a function. The business goal is **more successfully delivered, profitable orders from more Bengaluru neighbourhoods**. Search rankings and page counts support that goal.

Working brand: MAANE OOTA, inferred from the project folder; rename centrally if needed. Working interpretation of “best deals”: customers receive useful offers and transparent total prices, while the business wins repeat orders and profitable office/bulk contracts. No actual menus, suppliers, prices, coverage, search volumes or commercial agreements were provided.

Build citywide discovery, partner registration and enquiry collection from the start. Enable paid ordering at an address only when a verified kitchen, capacity and delivery arrangement exist. Supporting every corner requires many nearby kitchens; sending every individual meal across the city is not the operating model.

The first release must include the ability to manage 120 area-page candidates. Publish each page when it is useful and factually supported. The attached area register is a starting acquisition list, not an exhaustive Bengaluru gazetteer or a claim of existing coverage.

## 2. Product and commercial decisions

| Decision | Initial implementation |
|---|---|
| Business model | Marketplace connecting customers with identifiable home cooks and kitchens |
| Food descriptions | “Homemade” only for food actually made in a home kitchen; clearly identify other home-style kitchens |
| Geography | Bengaluru first; configurable city records and catchment boundaries |
| Ordering | Scheduled meals first, with same-day slots where capacity and delivery are confirmed |
| Cart | One kitchen per cart; switching kitchens requires explicit confirmation |
| Delivery | Partner delivery or an approved delivery provider; assisted dispatch initially |
| Bulk | Quote-led flow for 10–1,000+ meals; quantities are requests, subject to confirmed capacity |
| Plans | Prepaid fixed-duration meal packs before automatic recurring billing |
| Payment | Hosted payment checkout, subject to gateway marketplace onboarding |
| Language | Simple Indian English; Kannada navigation and reviewed content in a later release |
| Support | In-site support request plus business phone/WhatsApp once supplied |
| Trust | Define what verification checked; show authentic order-linked reviews |

Do not promise guaranteed rankings, instant delivery everywhere, lowest prices, guaranteed health benefits, fake stock scarcity, unearned verification badges or invented testimonials.

## 3. Customers and partners

| Customer | Main job | Page/offer | Conversion |
|---|---|---|---|
| Working professional | Reliable weekday lunch | Area lunch menu; weekly pack | First meal then repeat |
| PG resident/student | Filling meals within budget | PG meals; total-price filter | Trial meal then pack |
| Family | Familiar food without cooking today | Family portions; clear serving sizes | Scheduled dinner |
| Elderly customer/caregiver | Easy ordering and dependable food | Clear instructions; assisted ordering | Recurring scheduled meals |
| Office administrator | Meals arriving together | Office meals; itemised quote | Paid trial then contract |
| Function organiser | Correct quantities and timing | Bulk food; menu and headcount form | Accepted quotation |

Partner types: an individual home cook with limited daily capacity; a home kitchen with several meal slots; a regional food specialist; a documented small kitchen selling home-style food; a qualified bulk supplier. Store partner type separately from cuisine and do not blur the meaning of homemade.

Each partner needs menu control, order notifications, a daily preparation list, capacity limits, documented settlements and a way to pause sales quickly.

## 4. Bengaluru-wide operating model

Use six internal acquisition groups: North, South/Southeast, East, West, Central and Outer catchments. These are working sales territories, not official municipal zones. Start partner acquisition in all groups concurrently, without presenting unserved addresses as deliverable.

The serviceability engine must return one of these states:

| State | Customer sees | Allowed action |
|---|---|---|
| Available in selected slot | Actual menu, all charges and confirmed slot | Checkout |
| Available later | Next available date/slot | Schedule an order |
| Bulk only | Quote form and realistic contact expectation | Submit enquiry |
| Temporarily paused | Explanation and next available slot if known | Change slot or request notification |
| Not served yet | Honest coverage message | Join waitlist or suggest a cook |
| Location unclear | Address clarification | Select locality/map point |

Calculate eligibility from the destination, kitchen service polygon, routing feasibility, delivery mode, order cutoff, item availability, remaining capacity and slot. PIN matching alone cannot establish delivery eligibility.

A practical launch objective is to have operational supply in each acquisition group; the founder must fund and verify it. Do not make the launch dependent on an arbitrary count of indexed pages. Broaden checkout coverage as kitchens and delivery capacity become ready.

## 5. Website architecture and complete route families

All example URLs are relative paths. Use one canonical host, HTTPS, lowercase slugs and no trailing slash except `/`. Unknown slugs return a genuine 404.

| Routes | Purpose | Search indexing |
|---|---|---|
| `/` | Brand homepage and location entry | Yes |
| `/home-food-delivery/bengaluru` | Primary city ordering hub | Yes when useful |
| `/home-food-delivery/bengaluru/{area}` | Local menus, kitchens and ordering | Only approved pages |
| `/home-food-delivery/bengaluru/{area}/{intent}` | Selected local lunch/dinner/cuisine/plan intent | Later, individually approved |
| `/bengaluru/areas` | Browse coverage and locality directory | Yes when useful |
| `/bengaluru/{service}` | City service pages from the register below | Approved services |
| `/kitchens/{kitchen-slug}` | Real kitchen, menu, availability and evidence | Approved active profiles |
| `/meals/{meal-slug}-{public-id}` | Stable, substantial meal detail pages | Only useful enduring offerings |
| `/offers/bengaluru` | Current eligible offers and terms | Yes if maintained |
| `/guides`, `/guides/{slug}` | Helpful buying and meal-planning guides | Reviewed articles |
| `/partners`, `/partners/apply` | Partner information and application | Information page yes; form noindex |
| `/delivery-partners`, `/delivery-partners/apply` | Optional recruitment, only if hiring | Same rule |
| `/about`, `/how-it-works`, `/food-safety`, `/contact`, `/help` | Trust and support | Yes |
| `/terms`, `/privacy`, `/refunds`, `/cancellations`, `/partner-terms` | Reviewed policies | Yes |
| `/search`, `/cart`, `/checkout`, `/login` | Transactional UI | Noindex |
| `/account`, `/account/addresses`, `/account/orders/{id}`, `/account/meal-packs` | Private customer account | Authenticated, noindex |
| `/bulk/request`, `/bulk/requests/{id}`, `/bulk/quotes/{id}` | Enquiry and private quotation | Noindex; private records authenticated |
| `/partner/*`, `/admin/*`, `/dispatch/*` | Operating dashboards | Role protected, noindex |

City service slugs: `breakfast`, `lunch`, `dinner`, `south-indian-food`, `north-indian-food`, `karnataka-meals`, `vegetarian-meals`, `non-vegetarian-meals`, `family-meals`, `pg-meals`, `office-meals`, `bulk-food-orders`, `monthly-meal-plans`, `weekly-meal-plans`, `tiffin-service`, `function-food`.

These are 16 candidates, not a requirement to publish 16 overlapping pages. If tiffin service and monthly plans have the same offer and intent, combine them. City pages cover service intent across the city; local child pages require meaningfully local inventory and content.

Do not create competing paths like `/home-food-delivery/koramangala` alongside the canonical Bengaluru route. Redirect real historical aliases with 301; do not manufacture alias pages. Bangalore is a search synonym for Bengaluru, not a second city site.

Navigation: Order Food, Meal Plans, Bulk Orders, Offers, Become a Food Partner. Mobile bottom navigation: Home, Search, Orders, Account. A cart bar appears only when items have been added.

## 6. The 100+ page strategy

The attached register supplies **120 area candidates**. Along with the city hub, useful service pages, kitchen profiles and guides, this gives a practical route beyond 100 useful search landing pages. It does not establish that all 120 should be indexed immediately.

Publication workflow: candidate → geography checked → supply attached → local facts gathered → editorial review → publication eligibility passed → indexable → monitored. Keep failed candidates as internal drafts or useful noindex waitlist pages.

Our initial editorial gate, which is a product rule and not a Google requirement:

1. Verified locality identity, aliases and boundaries/catchment interpretation.
2. At least one verified operating kitchen genuinely serving the locality; aim for two or more for choice and resilience.
3. At least three real selectable meals or one substantive active meal plan/bulk offer matching the page's intent.
4. Confirmed upcoming availability, cutoffs, delivery policy and pricing source. Temporary nightly closure is different from no supply.
5. Local content containing actual service details: kitchens, supported destinations, delivery constraints, meal slots and relevant questions.
6. A working order, schedule or genuine bulk-quote path which retains the selected location.
7. No invented reviews, nearby landmarks, menu items, prices or claims.
8. A named reviewer, review timestamp and no materially duplicate approved page.

Content length is not a publication gate. A short useful page is preferable to padded text. A kitchen serving several adjoining localities does not automatically justify several pages with identical menus and renamed headings. Merge overlapping pages unless the geography, service detail and user journey provide distinct value.

Google identifies doorway pages and scaled low-value content as spam risks. This plan therefore gates publication on actual customer usefulness. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

Do not generate location × food × meal × budget × PIN × street combinations. Store these as filters. Promote a filtered intent into an indexable page only after evidence of demand, distinct usefulness, service supply and editorial review.

## 7. Exact area-page specification

Example route: `/home-food-delivery/bengaluru/whitefield`.

Title pattern: `Homemade Food Delivery in Whitefield | MAANE OOTA`.

H1: `Homemade Food Delivery in Whitefield`.

Description, only once service exists: `Find homemade meals serving Whitefield. Check local kitchens, meal prices and delivery slots. Order lunch, dinner or request food in bulk.`

The template must include, in this order:

1. Breadcrumbs: Home → Bengaluru Home Food → Whitefield.
2. H1, brief factual introduction and address selector.
3. Delivery state and selected date/meal slot.
4. Available kitchen/meal cards: real photo, kitchen type, portion, diet, price, availability and CTA.
5. Current offers matching the location and order conditions.
6. Local kitchen profiles with verification scope and actual customer ratings, if any.
7. Meal slots, cutoff times, delivery estimates, fees and address check.
8. Weekly/monthly plans only where offered.
9. Bulk enquiry with locality prefilled.
10. Local delivery notes supported by operations; avoid generic neighbourhood travel descriptions.
11. Three to six genuinely answered questions, such as lunch cutoff or whether a named sublocality is supported.
12. Nearby verified area links and relevant city service links.
13. Clear support access and policies.

The initial rendered HTML must contain meaningful headings, visible menu/profile content and crawlable links. Users can browse without sharing GPS or logging in. Address-specific prices and availability are rechecked interactively and at checkout.

Do not publish invented local paragraphs as examples. The editorial interface should show missing facts as tasks; public pages should omit missing claims.

## 8. Keywords and content rules

The separate register maps keyword groups and 120 areas. Primary themes are home food, homemade food, home-style meals, food like home, lunch delivery, dinner delivery, meal plans, PG meals, office food and bulk orders.

Use one primary intent per page. Treat synonyms naturally in copy: homemade, home cooked, home-style, ghar ka khana, maane oota, Bangalore/Bengaluru. Distinguish language intent from cuisine intent. Do not publish separate pages for spelling errors such as “hoem made”. Search can correct common errors.

“Taste like home” belongs in brand messaging; it does not justify an unsupported health claim. “Low oil”, “Jain”, “no onion/no garlic”, “allergen-free” or “pure veg kitchen” must reflect confirmed preparation capability. Ingredient tags do not prove prevention of cross-contact.

Initial editorial programme: two useful guides per week for eight weeks, adjusted to actual staff capacity. Priorities: ordering lunch by area, selecting a meal pack, comparing delivered cost, office lunch planning, food quantities for 20/50/100 people, portion sizes, delivery cutoffs and partner stories with permission. Link each guide to serviceable ordering pages. No fake “best” rankings or copied competitor menus.

Search-volume research remains to be done with geographically targeted keyword tools, early Search Console data and actual customer queries. Never fill in fabricated monthly volumes or ranking forecasts. Search demand and customer needs determine later pages.

## 9. Technical SEO contract

| Topic | Required behaviour |
|---|---|
| Rendering | Server-render indexable content; client code handles interaction |
| Canonicals | Self-canonical approved pages; aliases redirect; preserve one city spelling in URLs |
| Sitemap | Sitemap index with approved location, kitchen, service and guide URLs; only canonical 200/indexable URLs; truthful lastmod |
| Robots | Allow public page/assets; do not block a page whose noindex directive must be crawled; authentication protects private data |
| Filters/search | Noindex internal search and ad hoc filters; avoid crawlable endless parameter combinations |
| Tracking parameters | Clean canonical for equivalent tracking variants; never put addresses/phones in URLs |
| Pagination | Crawlable numbered links, stable order and self-canonical distinct pages; no blanket canonical to page one |
| Availability | Temporary sold-out pages retain useful future schedules; persistently unsupported pages go to editorial review/noindex; permanently removed pages 404/410 or redirect only to a true replacement |
| Internal links | Home → city → areas/services → kitchens; relevant nearby links; no enormous repeated 120-area footer |
| Sharing | Page-specific OpenGraph/X title, description and image; no private data |
| Errors | Genuine 404s, useful recovery links, monitored broken links and redirect loops |
| Languages | English initially; reviewed Kannada counterparts later with reciprocal hreflang; never auto-create empty translations |

Noindex and canonical are not interchangeable. Equivalent duplicates can canonicalise to their clean equivalent. Distinct unapproved filtered result sets should be noindex rather than incorrectly claiming equivalence to a broad page. Remove deindexed URLs from sitemaps. Only introduce crawl restrictions after understanding their impact on already indexed URLs. [Google URL guidance](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites), [faceted navigation guidance](https://developers.google.com/crawling/docs/faceted-navigation)

Use normal HTML links so discovery does not depend on entering a search query. [Google ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)

Structured data: Organization and WebSite for the platform; BreadcrumbList for eligible public pages; an appropriate FoodEstablishment/LocalBusiness subtype only for a genuine identifiable kitchen where required public details are accurate and disclosure is appropriate; Product/Offer only for eligible actual product detail pages, validated against current requirements. Do not create a pretend local business for every area, publish private residential coordinates, mark listing pages as individual products, or invent ratings. Schema does not guarantee rich results.

Keep visible FAQs for customers. Do not make FAQ rich results or SearchAction/sitelinks search boxes deliverables: Google's changelog records FAQ rich-result removal in May 2026 and sitelinks search-box retirement in 2024. [Google documentation updates](https://developers.google.com/search/updates)

## 10. Homepage and design system

Hero: **Food that tastes like home.** Supporting copy: “Find homemade meals from local cooks in Bengaluru. Enter your area to see menus and delivery options.” Primary CTA: Find Food Near Me. Secondary CTA: Order in Bulk. Input: “Enter your area, PIN code or landmark”.

Homepage sequence: hero/location → available meals after location selection → breakfast/lunch/dinner shortcuts → real eligible deals → weekly meal plans → bulk and office meals → how it works → authentic partner stories/trust → coverage directory → become a partner → FAQs/support/footer. Hide empty sections gracefully. Before a location is chosen, show clearly labelled examples or categories, never implied local stock.

Visual direction: warm Indian food brand, light backgrounds, actual meal photography, clear prices and plenty of readable space. Proposed tokens: deep green #1F5138, cream #FFF8EF, charcoal #242424, warm terracotta #A74124. Test all final text/background pairs; do not assume brand colours meet contrast rules. Use a readable locally hosted font such as Noto Sans with a Kannada-capable family when needed, subject to licence verification.

Components: location picker, slot picker, meal card, kitchen card, offer card, meal-plan card, bulk form, price breakdown, order timeline, verification explanation, support card, loading skeleton, empty state and inline errors. Body text starts at 16px; touch targets at least 44×44px as a product target; clear keyboard focus and error associations. Mobile layout starts at 360px and remains usable at 320px.

No carousel is needed above the fold. No location permission popup before a user requests GPS. No mandatory account just to browse. All main actions must make sense within a few seconds.

## 11. Customer ordering flow

Enter area → choose exact address or approximate browse location → choose meal/date → inspect meal and kitchen → add items → see full price and offer → verify phone at checkout → confirm address/slot → pay → receive order status → delivery → review/reorder.

Meal cards show portion/serving size, diet labels, kitchen type, scheduled slot, preparation cutoff and food price. Checkout shows food, packaging, delivery, platform fee, discounts and applicable taxes before payment. Budget filters should use delivered totals when address and basket are known; otherwise explicitly label food-only prices.

At checkout the server reprices, validates offer eligibility and atomically reserves capacity. Default reservation policy: ten minutes, configurable and displayed when relevant. Payment timeout releases reservations. Late payment success after release requires a new stock check, then fulfilment or a recorded refund; never oversell silently.

If the kitchen rejects or times out, start the refund/support workflow. Do not substitute another kitchen, meal, diet or slot without agreement. Scheduled order cancellations follow a clearly displayed cutoff and policy. Reorder rechecks today's menu and prices.

## 12. Bulk and corporate flow

Bulk page → headcount, date/time, delivery location, meal type, cuisine, veg/non-veg split, budget per person, packaging/serving requirements and contact → request confirmation with reference → operations checks suppliers → itemised quote → customer accepts current quote → payment/deposit → scheduled fulfilment → delivery confirmation → balance/settlement/review.

Provide quantity shortcuts for 10, 20, 50, 100, 250, 500 and 1,000+, plus manual quantity. Record budget as an enquiry, not a promised price. Show acknowledgement immediately; publish a human response SLA only when staff can maintain it.

Quotes contain version, supplier allocation, portions, menu, ingredient/allergen information, all fees/taxes, delivery slots, acceptance expiry, substitution rules, cancellation schedule and payment milestones. A change in count/menu/address creates a new version. Accepted quotes are immutable. Confirm capacity before taking payment. Large orders may require multiple kitchens, but disclose the allocation and dietary separation and let operations approve the plan.

Corporate contracts add billing contact, tax details where appropriate, daily count cutoff, weekly menu, delivery location instructions, attendance adjustment policy and payment terms. Do not offer credit by default. Start with paid trial lunches and prepaid contracts.

## 13. Meal packs and subscriptions

Launch with a paid trial meal and fixed packs such as five lunches or a defined monthly weekday calendar, only where partners offer them. Display actual dates, inclusions, meal count, total payable, per-meal calculation and delivery fees. Do not assume a month always means 30 deliveries.

Flow: select kitchen/plan → choose start date and service calendar → review menu rotation/diet constraints → select address → agree skip/cancellation policy → pay → calendar dashboard. Each delivery has a separate fulfilment record drawing from reserved capacity.

Track pack balance, delivered meals, skips, kitchen closures, refunds and credits. A skipped meal cannot both remain available and be refunded. Show whether a permitted skip extends the pack or creates a credit. Never silently move a customer to another kitchen. Autopay, mandate management, pause/resume automation and renewal campaigns belong in phase 2 after accounting and policy validation.

## 14. Offers and best-deal system

Prefer savings created by order density and repeat demand: weekday packs, family combinations, building/PG group orders and office deliveries. These can reduce delivery cost per meal. First-order discounts and referrals are acquisition expenses with explicit caps.

| Offer type | Proposed rule | Safeguard |
|---|---|---|
| Trial order | Fixed discount above a minimum food subtotal | One eligible redemption; fixed campaign budget |
| Meal pack | Clearly lower comparable per-meal total | Compare equivalent meals/fees; show dates |
| Group delivery | Savings for one delivery point and slot | Minimum confirmed quantity and cutoff |
| Kitchen offer | Supplier-approved item/bundle saving | Persist supplier/platform funding split |
| Referral | Credit after a referred order is delivered | No reward for self-referral/cancelled orders |
| Bulk quantity tier | Quoted price for confirmed quantities | No unlimited or automatic promise at high volumes |

Illustrative campaign for staging only: ₹30 off a ₹199 food subtotal, subject to a contribution-margin budget. This is not an approved live offer. “Best eligible offer” means the largest valid saving among this platform's applicable offers for the current basket. It is not a lowest-market-price guarantee.

Offer fields: kind, amount/percentage, maximum saving, minimum subtotal, eligible kitchens/areas/items/slots/customer segment, start/end in configured timezone, total redemption and funding budgets, per-user limit, stackability, funding shares, cancellation behaviour and terms version. Default: one promotional offer per order; do not stack unless explicitly configured.

Server calculates eligibility and reserves campaign budget atomically alongside checkout. Conversion from reservation to redemption occurs once payment/order policy confirms it; failed checkout releases it. Refunds reverse the correct funding allocations. Show ineligible reason and eligible saving; hide expired deals from active offer cards without breaking the maintained offers page. No fake original prices, countdown resets, compulsory preselected add-ons or hidden fees.

## 15. Location and search data

The model is not City → Area → PIN as a strict tree. A locality can span several PINs and a PIN can cover several localities. Landmarks can relate to several catchments. Delivery polygons are operational areas that do not need to match administrative boundaries.

Entities: country/state/city; location with optional parent and type; aliases; postal code; location_postal_codes; landmark and location_landmarks; delivery zones/polygons; kitchen coverage; delivery slots; location demand aggregates. Each geographic record stores provenance, verification date and confidence; leave unknown values null rather than fabricate them.

Use the attached 120 rows as draft locality records. Verify names, aliases, coordinates and boundaries through a licensed maps/geocoding source and field operations. Check PINs against India Post. Do not scrape restricted map databases or assume a maps subscription permits permanent storage of every response. [India Post lookup](https://www.indiapost.gov.in/VAS/Pages/LocatePostOffices.aspx?P=)

Accept area, landmark, PIN, GPS and manual address. Resolve ambiguity by showing named choices; examples include localities sharing a name or long roads spanning many neighbourhoods. GPS is optional. Exact destination confirmation is required before final fees and checkout.

Search aliases: Bangalore/Bengaluru, HSR/HSR Layout, RR Nagar/Rajarajeshwari Nagar, BTM/BTM Layout, Electronic/Electronics City, idli/idly, ragi mudde/ragi ball, chapati/chapathi. Keep semantic matches reviewed. Food for 50 people should suggest bulk enquiry. “Monthly food” should suggest meal plans. Search ranking first respects serviceability, slot, stock and diet; then relevance, delivery reliability, total price and quality. Label sponsored placements.

## 16. Partner acquisition and operations

Onboarding: phone verification → kitchen and owner details → kitchen type/location → cuisine/diet and menu → slot capacities/cutoffs → delivery arrangement → required documents/licence information → private payout details → operations review → sample/packaging evaluation where undertaken → test delivery → approval → first menu publication.

Store verification evidence and expiry reminders. “Verified” must link to what was checked and when; document review is not a hygiene guarantee. Securely collect only required documents. A kitchen cannot approve itself or make itself orderable after suspension.

Partner dashboard: today's preparation list, accept/reject with reason, upcoming scheduled orders, menu/item pricing, stock and capacity, blackout dates, bulk quote responses, fulfilment updates, earnings/settlement statements, disputes and reviews. Show customer data only as needed for fulfilment.

Admin modules: partners/documents, locations/coverage, menus/categories, slots/capacity, customers/support, orders/refunds, dispatch, bulk requests/quotes, packs, offers/budgets, settlements/ledger, reviews, SEO pages/publication queue, guides/media, reports and audit trail. Separate content, operations, support and finance permissions. High-risk payouts, bank changes and large refunds require a second authorised staff approval according to a configured threshold.

Dispatch UI: service date/slot, kitchen pickup batches, readiness, assigned delivery mode, destination, promised window, proof of handover and delivery exception. Do not expose unrelated orders to riders.

## 17. Delivery architecture

Start with configurable partner delivery and one approved provider adapter; manual assignment is a first-class audited workflow. Own riders are an optional later operational programme, not assumed available on launch.

Quote delivery using origin/destination, slot, package volume, order size, provider constraints and real cost. A distance radius can prefilter but cannot replace route feasibility. Store quote expiry and revalidate at checkout. Same-building/office batching requires compatible timing, safe transport and explicit handover arrangements.

Track ready_for_pickup → assigned → picked_up → delivered, with failed_attempt and exception paths. Provider outages must support staff escalation. A delivered status requires authorised evidence; the browser cannot mark itself delivered. Track ETA as a range. Do not show live rider movement unless a real integration supplies it with appropriate permissions.

Bulk deliveries need packing counts, labels, thermal/handling requirements defined by operations, loading time, vehicle suitability and onsite contact. Capacity validation includes kitchen production and dispatch, not just meal stock.

## 18. Recommended technology and architecture

This is a recommended implementation direction, not a procurement decision. Validate current stable versions, provider contracts, costs and regional availability when development starts.

| Layer | Recommendation | Reason |
|---|---|---|
| Web | Next.js App Router + TypeScript | Public HTML rendering, metadata and interactive ordering in one project |
| UI | Accessible React components and a small token-based styling system | Consistent mobile controls without animation-heavy bundles |
| Backend | Modular monolith with typed server endpoints | Easier transactions and operations than early microservices |
| Database | Managed PostgreSQL with PostGIS where supported | Orders, accounting relations and geographic checks |
| DB access | A maintained SQL/ORM layer with migrations; explicit SQL for spatial/locking operations | Keep critical transaction behaviour reviewable |
| Authentication | Managed phone OTP provider suitable for India; admin MFA | Avoid custom authentication and manage OTP abuse |
| Payments | Razorpay or equivalent approved hosted gateway | Provider handles payment credentials; marketplace settlement approval still required |
| Maps | Provider adapter around a licensed Indian-coverage maps service | Replace provider without changing domain logic |
| Search | PostgreSQL full-text/trigram search initially | Adequate initial catalogue without another service |
| Media | Private/public object storage separation plus image CDN | Safe documents and fast meal photos |
| Async work | Durable job queue/worker and transactional outbox | Reliable notifications, reservation expiry and reconciliation |
| Admin/CMS | Admin screens using the same authorised backend | One source for menus, coverage and SEO publication |
| Observability | Error tracking, structured logs, uptime checks and metrics | Detect failed orders and integration outages |
| Analytics | Search Console + consent-aware web analytics + internal order reports | Measure acquisition and actual fulfilled orders |
| Hosting | Managed Node-compatible web hosting plus managed database/worker | Simple deployment; select region and vendor after cost/data review |

Keep modules for Identity, Geography, Catalogue, Availability, Checkout, Orders, Payments, Promotions, Bulk, Packs, Dispatch, Settlements and Content. They share one database initially but have explicit responsibilities. Next.js supports server and client components; use server rendering for public content and client components where interaction needs them. [Next.js rendering documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components), [metadata documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

Cache public editorial content and coarse catalogue results. Never cache private accounts publicly or use cached stock/payment state as the checkout authority. Invalidate affected public pages when a kitchen, menu or coverage state changes. Keep heavy jobs out of web request handlers.

## 19. Database blueprint

All mutable business records need IDs, creation/update timestamps and appropriate ownership. Use integer paise for money and currency codes. Store timestamps in UTC with city timezone for display and cutoff calculations. Never use floating point for charges.

| Tables / records | Critical fields and relations |
|---|---|
| users, roles, role_assignments, sessions, consents | Identity, scoped permissions, purpose/version/time of consent |
| addresses | User, encrypted personal fields, restricted coordinates, delivery instructions |
| cities, locations, location_aliases, postal_codes, location_postal_codes, landmarks | Stable geographic IDs, optional hierarchy, provenance and verification |
| kitchens, kitchen_documents, kitchen_verifications | Owner, kitchen type, operational state, private pickup point, public profile, evidence/expiry |
| service_zones, kitchen_service_zones | Geometry, delivery modes, fees/policies, enabled slots |
| menu_items, meal_variants, item_photos, diet_tags, ingredients | Kitchen FK, portion, price version, dietary evidence, public listing state |
| slots, slot_capacity, item_availability, reservations | Kitchen/date/slot and item-level limits, held/committed units, expiry, version |
| carts, cart_items, checkout_quotes | User/session, kitchen, quote expiry, immutable price/fee/tax/offer snapshot |
| orders, order_items, order_status_events | Address/menu snapshots, slot, idempotency key, totals, payment and fulfilment links |
| payments, payment_events, refunds | Provider IDs unique, status, amount, processed webhook IDs and reconciliation state |
| promotions, promotion_reservations, redemptions | Eligibility, funding split, budget held/used, unique redemption rules |
| bulk_requests, quote_versions, quote_lines, quote_allocations | Quantity, customer requirement, supplier allocation, accepted version and milestones |
| meal_packs, pack_purchases, pack_deliveries, pack_adjustments | Service calendar, meal entitlements, skip/refund ledger and capacity commitment |
| delivery_jobs, delivery_events | Order or batch, provider/manual assignment, proof references, exceptions |
| ledger_entries, settlement_batches, settlement_items | Balanced entries, source transaction, partner payable, fees, refunds and transfers |
| reviews, review_moderation, support_tickets | Completed-order link, moderation reason, complaint resolution |
| seo_pages, seo_revisions, publication_checks, redirects, articles | Route unique, location/intent, evidence, review, canonical, state and history |
| media_assets, audit_logs, outbox_jobs, processed_events | Access class, actor/reason, reliable job dispatch and deduplication |

Enforce one active canonical page per city/location/intent, unique provider event IDs, unique checkout idempotency keys per customer, and unique valid review per order. Foreign keys and database transactions protect order/stock/payment consistency. Ledger changes are append-only reversals rather than silent editing. Capacity locks must cover shared kitchen slot capacity as well as individual items.

## 20. API contracts

Use `/api/v1` for explicit endpoints. Validate all inputs server-side; use cursor pagination for growing private datasets. Return structured error codes plus plain-language messages. Mutations accept idempotency keys where retries could duplicate money or orders. Public endpoints expose only approved fields.

| Endpoint family | Purpose / requirements |
|---|---|
| `GET /locations/suggest`, `POST /serviceability/check` | Resolve location; check address/date/slot without putting exact addresses in URLs |
| `GET /catalog`, `/kitchens/{id}`, `/meal-plans` | Approved listings, pagination, coarse locality filters |
| `POST /checkout/quote` | Reprice basket and return expiry, fees, tax, offers and availability |
| `POST /orders` | Authenticate, validate quote, reserve capacity/budget, create payment attempt |
| `GET /orders/{id}`, `POST /orders/{id}/cancel` | Customer ownership, transition and policy enforcement |
| `POST /payments/webhook` | Raw-body signature verification, event deduplication and durable processing |
| `POST /bulk/requests`, `GET /bulk/requests/{id}` | Rate-limited intake; private request access |
| `POST /bulk/quotes/{id}/accept` | Exact unexpired version; atomic capacity and payment schedule |
| `POST /packs/purchase`, `/packs/{id}/skip` | Entitlement ledger and cutoff enforcement |
| `POST /partners/applications` | Secure document references, no public document URLs |
| `PATCH /partner/menu/{id}`, `/partner/availability` | Kitchen-scoped ownership and audit |
| `POST /partner/orders/{id}/transition` | Allowed state transition only |
| `POST /admin/seo-pages/{id}/publish` | Role, evidence gates, audit, cache/sitemap updates |
| `POST /admin/refunds`, `/admin/settlements` | Finance permissions, approval thresholds and idempotency |

No endpoint accepts a client-supplied payable total as trusted. Return 409 for stock/version conflicts, 422 for invalid inputs and 429 for rate limits with sensible retry behaviour. Log correlation IDs without sensitive payloads.

## 21. Payments, refunds and settlements

Payment and fulfilment are separate state machines. Payment: initiated → pending → captured/failed; captured → partially_refunded/refunded. Fulfilment: awaiting_payment → awaiting_acceptance → accepted → preparing → ready → out_for_delivery → delivered, with controlled rejection/cancellation/exception branches.

Hosted checkout returns a user-facing result, but server verification determines payment status. Verify webhook signatures against the raw payload; deduplicate event IDs; tolerate retries and out-of-order events; acknowledge after durable recording and process safely. Reconcile uncertain payments with the provider. Razorpay explicitly documents signature validation, duplicate deliveries and event-order handling. [Razorpay webhook documentation](https://razorpay.com/docs/webhooks/validate-test/)

Implement an outbox so a committed paid order reliably creates partner notification and processing jobs. Maintain a pending-payment recovery page. Do not mark an order paid solely from the browser callback or a screenshot.

Kitchen rejection, delivery failure, partial fulfilment and customer cancellation create distinct refund decisions. Store reason, approver, amount and provider status. Refund failure requires retry/escalation and a visible support state. Reconciliation runs daily and after provider incidents.

Partner settlement uses captured funds, delivered orders, commissions, agreed offer shares, refunds and applicable deductions. Do not build a wallet or hold/pool funds through an assumed arrangement; use a gateway-approved marketplace settlement model after compliance review. Restrict and verify payout-account changes. Display settlement statements matching the ledger.

## 22. Major feature contracts and acceptance criteria

This matrix is the development checklist. Each row covers requirement, flow/UI, backend/data/API, SEO, analytics, testing and edge cases. The preceding sections provide field-level detail.

| Feature | Requirement and flow/UI | Backend → data → API | SEO and analytics | Test / edge-case acceptance |
|---|---|---|---|---|
| Location | Text/GPS/manual entry → confirm place → show availability | Resolver + routing → locations/zones → suggest/check | Public local route retained; location_selected, serviceability_result | Denied GPS, duplicate name, PIN overlap, city edge, provider outage |
| Catalogue/search | Query/filters → real meal and kitchen cards | Serviceability ranking → menus/slots → catalog | Crawlable approved listings; food_search, view_item | Sold out, typo, diet mismatch, no results, stale price |
| Kitchen trust | Profile → verification scope/menu → order | Publication permission → verification/reviews → kitchens | Real profile only; partner_viewed | Suspended licence/profile, no reviews, residential privacy |
| Cart/checkout | One kitchen → full quote → payment | Transactional reservation → carts/quotes/orders → quote/orders | Noindex; add_to_cart, begin_checkout | Concurrent last meal, changed address, quote expiry, repeated tap |
| Payments/refunds | Pending/success/recovery/refund timeline | Verified events + reconciliation → payments/refunds/ledger → webhook/refund | Private; purchase server-side, refund_recorded | Forged signature, duplicate/late event, refund failure, wrong amount |
| Deals | Explain savings → apply best eligible promotion | Server rules + atomic budget → promotions/redemptions → quote | Maintained offers hub; offer_viewed/applied | Expiry boundary, exhausted budget, reuse, funding split, cancellation |
| Bulk | Requirements → versioned quote → acceptance → milestones | Capacity allocation → requests/quotes → bulk endpoints | City bulk page; bulk_request_submitted, quote_accepted | Unavailable date, changed headcount, expired quote, supplier rejection |
| Meal packs | Choose calendar → pay → delivery/skip dashboard | Entitlements + per-slot capacity → packs/deliveries → pack endpoints | Active public plan pages; pack_purchased | Holiday, skip cutoff, closure, refund/credit cannot double-count |
| Partners | Apply → evidence review → publish → fulfil | Scoped authorisation → kitchens/documents/menu → partner endpoints | Public info; partner_signup/verified | Malicious upload, expired document, unauthorised edit, capacity exceeded |
| Dispatch | Ready list → assign → pickup → deliver/exception | Authorised transitions → jobs/events → dispatch endpoints | Private; delivery_assigned/completed | Duplicate assignment, unreachable customer, false delivery update |
| SEO/content | Draft → evidence check → review → publish | Gate + revisions → seo_pages/redirects → publish | Canonical, sitemap, breadcrumbs; landing_page_view | Duplicate slug, empty supply, alias loop, stale cache, HTML missing |
| Reviews/support | Delivered order → review or complaint → resolution | Ownership/moderation → reviews/tickets → support endpoints | Authentic public reviews only; ticket_opened/resolved | Fake order, abusive text, private data exposure, appeal |
| Admin/finance | Role-specific screens → approve → audit | Permission policies + ledger → settlements/audits → admin endpoints | Private; internal audit metrics | Cross-role access, bank-change approval, partial transfer, export leakage |

## 23. Business model and unit economics

Initial revenue candidates: food commission, a disclosed delivery fee, bulk commission and paid office contracts. A platform fee is optional and must be transparent. Subscription revenue must correspond to a real paid service; a meal pack's entire customer payment is not platform revenue. Featured listings and partner software services are later possibilities with clear sponsored labels and actual value.

Contribution formula, before fixed overhead and taxes: **food commission + retained customer fees − actual delivery cost − payment cost − support/refund reserve − platform-funded promotion**. Food value less commission becomes partner payable in this simplified example. Do not subtract the partner payout again after using commission as revenue.

The table below is an illustrative planning model, not market pricing or a forecast. Assumptions: 20% commission on food value; delivery fee as shown; no platform fee; payment cost assumed at 2% of customer payment after the platform-funded discount; no supplier-funded offers; packaging included in food price/partner economics. Taxes, tax on gateway fees, tax credits, chargebacks, acquisition cost and fixed overhead are excluded and must be added with a CA and provider quotes.

| Food value | Partner payout | Commission | Delivery fee | Platform discount | Customer pays | Actual delivery | Gateway cost | Support reserve | Contribution |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ₹100 | ₹80 | ₹20 | ₹25 | ₹10 | ₹115 | ₹40 | ₹2.30 | ₹5 | **−₹12.30** |
| ₹250 | ₹200 | ₹50 | ₹30 | ₹20 | ₹260 | ₹45 | ₹5.20 | ₹7 | **₹2.80** |
| ₹500 | ₹400 | ₹100 | ₹35 | ₹30 | ₹505 | ₹55 | ₹10.10 | ₹10 | **₹29.90** |
| ₹1,000 | ₹800 | ₹200 | ₹50 | ₹40 | ₹1,010 | ₹75 | ₹20.20 | ₹15 | **₹99.80** |
| ₹10,000 | ₹8,000 | ₹2,000 | ₹300 | ₹200 | ₹10,100 | ₹500 | ₹202 | ₹100 | **₹1,298** |
| ₹50,000 | ₹40,000 | ₹10,000 | ₹1,000 | ₹500 | ₹50,500 | ₹1,800 | ₹1,010 | ₹500 | **₹7,190** |

The model demonstrates why cheap single-meal delivery with blanket discounts can lose money. Larger baskets, delivery batching and repeat packs are hypotheses to test, not guaranteed profit. Each ₹10 increase in actual delivery cost reduces contribution by ₹10. Reducing commission from 20% to 15% reduces contribution by 5% of food value. Negotiate sustainable supplier payouts; commission is not free margin.

Track contribution before and after marketing, customer acquisition cost by source, 30/60/90-day repeat behaviour and refund-adjusted revenue. Approve promotions against a finite acquisition budget and measured payback. Do not scale an area solely because gross order value is rising.

## 24. Partner acquisition, marketing and street-level expansion

Create a locality work queue with: verified demand, partner count, breakfast/lunch/dinner coverage, menu diversity, service failures, unserved searches, PG/office/residential leads, next action, owner and review date. Approximate geographic demand in reports; do not expose individual addresses.

Proposed priority score: 35% measured unmet demand + 25% attainable supplier coverage + 20% viable delivery economics + 20% repeat/group-order opportunity. Normalise components to 0–100 and document missing data; this is an internal prioritisation formula, not measured research.

Weekly acquisition cycle: select gaps in each territory → identify willing cooks through referrals and community contacts → explain commercial terms → onboard evidence and menus → complete fulfilment trial → publish eligible page → acquire first paying customers → assess reliability and repeat orders. Start with a small number of ready kitchens per catchment and recruit backups as volume grows; measure each kitchen's real safe capacity.

Growth channels: local search pages; opt-in apartment/PG/community partnerships; partner referral links; office trial meals; QR cards on legitimate packaging; consented repeat-order reminders; useful regional food content; targeted paid search only where checkout works. Have staff seek group-admin permission before posting promotions. Avoid purchased contact lists, spam and mass backlink purchases.

Paid campaign landing pages should retain area, slot and offer context. Start with high-intent local lunch/meal-pack/bulk terms, use a fixed experiment budget and pause when supply or contribution fails. Brand campaigns and generic informational queries should be measured separately. No invented ad spend or return targets are assumed here.

For Google Business Profiles, check current eligibility for the actual operating entity. Do not create fake offices or one profile per SEO locality. Kitchens should manage profiles only when they independently qualify and authorise it.

## 25. Analytics and success measures

Funnel: landing → locality chosen → serviceable result → menu viewed → cart → checkout → captured payment → accepted order → delivered order → repeat order. Paid orders, delivered orders and enquiries are different metrics.

Events: location_search, location_selected, serviceability_result, food_search, view_item, partner_viewed, add_to_cart, begin_checkout, payment_started, purchase, order_accepted, order_delivered, order_cancelled, refund_recorded, reorder_started, offer_viewed, offer_applied, bulk_form_started, bulk_request_submitted, quote_sent, quote_accepted, pack_purchased, pack_meal_delivered, partner_signup, partner_verified.

Use one documented naming convention; map purchase/add_to_cart/begin_checkout to the analytics provider's ecommerce schema. Server confirms monetary events and deduplicates by order/payment IDs. A browser success-page reload must not create another purchase.

Permitted properties: pseudonymous session/customer ID, coarse area ID, kitchen/item/offer IDs, source/campaign, slot, totals and state. Never send phone, exact address, bank details, uploaded documents or unsanitised free-text searches to third-party analytics.

Weekly dashboard: delivered orders and contribution by area; serviceable-session conversion; unserved searches; organic landing conversions; first-to-second order rate; supplier acceptance and cancellations; on-time delivery; refunds; bulk enquiry-to-quote-to-paid conversion; pack retention; active indexable pages versus pages earning qualified traffic. Search Console impressions are useful diagnosis, not business revenue.

## 26. Security, privacy and compliance work

Security requirements: managed authentication; admin MFA; server-side role and kitchen/customer ownership checks on every private request; rate limits for OTP/search/forms/payment attempts; secure cookies/CSRF protection where applicable; input/output validation; private encrypted document storage; upload size/type and malware checks; signed short-lived downloads; secret management; TLS; redacted logs; dependency updates; audit logs; backup restoration; incident runbooks.

Do not collect payment card data. Minimise exact address access and revoke rider access after the operational retention window. Separate public kitchen identity from private residential pickup detail, subject to legally required disclosures reviewed by counsel. Document retention and deletion rules for addresses, documents, financial records and consent records. Retain legally required accounting records even if an account is deleted, with restricted access.

Have an India-qualified adviser verify these before launch; this is a product checklist, not a final legal opinion:

| Review | Product implication | Primary starting source |
|---|---|---|
| Food business and marketplace licensing | Determine platform and each kitchen's applicable FSSAI category, evidence, display and renewal requirements | [FSSAI licensing](https://www.fssai.gov.in/business/licensing), [FoSCoS](https://foscos.fssai.gov.in/) |
| GST and invoicing | Classify prepared meals, catering, platform/delivery fees and marketplace liability separately; validate current rates/deductions | [CBIC restaurant/ECO circular](https://cbic-gst.gov.in/pdf/Circular-167-17-12-2021-GST.pdf) |
| Consumer and ecommerce obligations | Seller identity, transparent totals, grievance contact, cancellations/refunds, sponsored labels and genuine discounts | [Consumer Affairs rules](https://consumeraffairs.gov.in/pages/consumer-protection-acts) |
| Personal data | Review DPDP commencement dates and applicable notices/consent, processors, requests and incident duties | [MeitY DPDP rules and timeline](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025%3B) |
| Local operations | Applicable municipal/trade, premises, labour, delivery and insurance requirements | Obtain local professional review for actual operating model |
| Contracts | Partner responsibilities, food safety, menu truthfulness, payouts, delivery loss, data use and dispute process | Counsel-reviewed agreements |

The CBIC circular specifically addresses ecommerce liability for restaurant services; do not assume that every bulk/catering transaction uses the same treatment. FSSAI thresholds/categories must be verified against current rules, not copied from old blogs. DPDP rules have a published enforcement timeline; map actual launch dates and processing to applicable provisions. Ask counsel to review recent ecommerce amendments and effective dates before launch, rather than treating a historic checklist as complete.

Operational food-safety process: ingredient/allergen declaration, kitchen onboarding evidence, hygiene and packaging standards set by qualified operations staff, complaint triage, suspected illness escalation, traceable order/meal batches where feasible, supplier suspension and incident communication. “Healthy” and dietary claims require support.

## 27. Images, animation, mobile and accessibility

Use partner-owned, permissioned photos of the actual meal, portion, packaging and kitchen where appropriate. Store consent/licence and alt text with each asset. Avoid showing an illustrative AI/stock meal as the product a customer will receive.

| Asset | Source dimensions / variants | Behaviour |
|---|---|---|
| Hero | 1600×1000 master; 640/960/1280 variants | Responsive, explicit aspect ratio; prioritise only if it is the LCP image |
| Meal card | 800×600 master; 320/480/640 variants | Consistent 4:3 crop; natural alt text |
| Kitchen/partner | 800×800 plus approved crop | No private documents/addresses visible |
| Social share | 1200×630 | Clear food/brand image, no tiny text |

Use AVIF/WebP where suitable with fallbacks, image CDN, responsive sizes and explicit width/height. Aim for card images around 40–100KB and hero around 150–250KB where visual quality allows; measure actual delivery. Lazy-load below-fold assets, not the main image. Use filenames such as `ragi-mudde-meal-kitchen-name.webp`, without keyword lists.

Animation: button feedback 100–150ms; panel transitions 150–200ms; order status updates up to 200ms. Use opacity/transform where possible. No scroll-triggered hiding of essential text, auto-playing food videos or map animations. Honour reduced-motion preference, including skeleton/loading effects. Mobile uses the same content and smaller assets.

Accessibility acceptance: keyboard complete ordering, visible focus, labelled inputs, accessible error summary, meaningful alt text, contrast testing, screen-reader announcement of cart/status changes, no colour-only diet/error meanings, and usable zoom. Keep support reachable when an integration fails.

## 28. Performance, hosting and release

Field targets at the 75th percentile, separately for mobile and desktop: LCP ≤2.5 seconds, INP ≤200ms, CLS ≤0.1. These are current Core Web Vitals good-experience thresholds. [Web Vitals](https://web.dev/articles/vitals)

Additional internal budgets: keep first-load public-route JavaScript near or below 200KB compressed where practical; p95 server catalogue response under 500ms under tested launch load; location suggestions feel responsive with debounce/cancellation and loading feedback; defer maps and payment libraries until needed. These are engineering targets, not achieved measurements. Define test device, network and traffic assumptions in the implementation report.

Environments: local, password-protected preview/staging with sandbox providers, and production with separate credentials and database. Preview environments must not be indexed or contain copied personal production data.

Release pipeline: lint/type checks → meaningful unit/integration tests → browser flows → build → migration review → preview review → approved production deploy → smoke checks. Use backward-compatible migrations and a rollback plan. Managed hosting should support TLS, custom domain, secrets, logs, worker jobs and database backup/restore. A deployment plan is not permission to buy infrastructure or publish during this planning task.

Use feature flags for new checkout coverage, suppliers, payment methods, promotions and SEO publication. Releasing all 120 URL candidates must never enable payment in all 120 areas automatically.

## 29. Testing and operational acceptance

Critical automated tests: serviceability boundaries; time/slot cutoffs in Asia/Kolkata; shared kitchen capacity under concurrent checkout; money rounding and discount allocations; OTP abuse throttling; cross-customer and cross-kitchen access denial; webhook signature/replay/order; partial refunds and settlement reconciliation; quote versions; pack entitlements; SEO gate, canonicals and real HTTP status codes.

Browser scenarios: anonymous browse → address → scheduled order → sandbox payment → partner accepts → dispatch → delivery → review; bulk enquiry → quote revision → acceptance → payment; pack → skip cutoff → fulfilment; no stock/no coverage; failed provider/refund; keyboard and low-end mobile usability.

SEO checks across every approved URL: 200 status, meaningful server HTML, unique intent/title/H1, correct canonical, publication evidence, internal links, actual content/schema agreement and sitemap eligibility. Unknown slugs return 404; private pages cannot be accessed by changing IDs. No live page should contain demo kitchen names, fake ratings or draft discounts.

Launch is accepted when staff can complete and recover the full order lifecycle, financial reconciliation matches, one restore rehearsal succeeds, public service claims match operations, and support/refund ownership is assigned. Search indexing itself is outside the developer's control.

## 30. Monitoring and maintenance

During meal windows, alert on payment failures, order acceptance delays, queue backlog, missed pickups and refund failures; route each alert to a named operations owner. Monitor web/API uptime, latency, job retries and provider health. Track unusual account/OTP/coupon activity without overcollecting personal data.

Daily: review failed orders/payments/refunds, settlement reconciliation, upcoming capacity and paused kitchens. Weekly: review unserved demand, partner reliability, promotion economics, SEO exclusions and conversion. Monthly: permissions, dependency/security updates, backup restore evidence, document expiries, stale content and policies. After every major provider outage: reconcile all uncertain money/order states.

Initial recovery objectives to validate against budget: database recovery point of at most one hour and service recovery within four hours; order/payment state must be reconciled before checkout reopens. Prefer point-in-time recovery where offered, daily backup verification and a quarterly restore drill. Do not advertise these as service guarantees until tested.

## 31. Development phases and dependency map

Indicative delivery range: 10–14 weeks for two experienced full-stack developers with part-time design/QA and active founder/operations support. This is a planning estimate; credentials, licensing, partner supply, copy, photography and delivery onboarding can determine launch timing. An AI agent does not remove those dependencies.

| Phase | Indicative timing | Deliverable / exit gate |
|---|---|---|
| 0. Decisions and data | Week 1 | Service model, evidence register, commercial assumptions, provider shortlist, 120 locality drafts |
| 1. UX and foundation | Weeks 2–3 | Mobile flows, tokens, schema, roles, locations, migrations and protected environments |
| 2. Supply and discovery | Weeks 3–5 | Partner intake, admin review, menus, serviceability, rendered city/area templates |
| 3. Transactions | Weeks 5–8 | Cart, capacity, hosted payments, orders, offers, dispatch, refunds and ledger |
| 4. Repeat/bulk and SEO | Weeks 7–10 | Versioned bulk quotes, fixed meal packs, content gate, sitemaps, analytics |
| 5. Readiness and launch | Weeks 10–12+ | Concurrency/security/browser checks, operations rehearsal, real content and controlled rollout |
| 6. Bengaluru expansion | Continuous after readiness | Activate more local kitchens and publish additional eligible pages across all territories |

Dependencies:

Identity/roles + city/location data → partner verification → menu + delivery zones + capacity → serviceability/catalogue → quote + reservation → payment verification → order fulfilment → refunds/ledger/settlement.

Location + verified supply + editorial facts → area-page approval → crawlable links/canonical/sitemap → Search Console → search/conversion learning → new useful pages.

Orders + capacity + accounting → fixed meal packs. Bulk intake can launch early, but paid quote acceptance depends on capacity, payments and accounting. Promotions depend on authoritative pricing and budget reservation. All private dashboards depend on permissions and audit logging.

MVP: all citywide discovery/intake foundations, serviceable scheduled checkout, one-kitchen cart, partner/admin/dispatch operations, refunds/ledger, constrained offers, assisted bulk quotes, fixed meal packs, evidence-gated SEO and essential analytics. A small first paid release can use staff-assisted pack scheduling, but must still preserve entitlements and prevent capacity conflicts.

Phase 2: pack automation/autopay after approval, delivery integrations, referrals, corporate standing orders, Kannada localisation, approved area-intent pages, better operational demand reporting. Phase 3: advanced dispatch/batching, additional cities, optional native apps and larger-scale search infrastructure only when measured demand justifies them.

## 32. Development backlog with owners and completion evidence

Owner abbreviations: F = founder/operations, D = developer, C = content/SEO reviewer, Q = QA, A = accountant/legal adviser.

| ID | Task | Dependencies | Owner | Completion evidence |
|---|---|---|---|---|
| P01 | Confirm kitchen types, coverage states and cancellation model | None | F/A | Written decision register |
| P02 | Validate 120 locality candidates, aliases and catchment scope | P01 | F/C | Sourced records; unknown data left blank |
| P03 | Select providers and confirm onboarding/settlement model | P01 | F/A/D | Sandbox access and responsibility matrix |
| P04 | Prototype mobile browse/order/bulk/partner flows | P01 | D/F | Reviewable screens with empty/error states |
| P05 | Establish environments, secrets, CI and migrations | P03 | D | Protected staging and repeatable build |
| P06 | Implement identity, roles, audit and private uploads | P05 | D/Q | Ownership and malicious-upload tests |
| P07 | Build location and coverage model | P02/P05 | D/Q | Address boundary and alias fixtures |
| P08 | Build partner onboarding/admin approval | P06/P07 | D/F | One verified test partner workflow |
| P09 | Build menu, slots, stock and kitchen capacity | P08 | D/Q | Race-safe capacity tests |
| P10 | Build catalogue/search and serviceability | P07/P09 | D/Q | Accurate available/later/unserved states |
| P11 | Build pricing/tax configuration and offers | P01/P09 | D/A | Reviewed totals, funding and budget tests |
| P12 | Build cart, quotes and reservations | P10/P11 | D/Q | Expiry/retry/concurrent stock evidence |
| P13 | Integrate hosted payment and durable webhooks | P03/P12 | D/Q | Sandbox success/failure/replay recovery |
| P14 | Build order acceptance, notifications and dispatch | P13 | D/F | End-to-end fulfilment rehearsal |
| P15 | Build refunds, ledger and settlements | P13/P14 | D/A/Q | Reconciled partial/full refund examples |
| P16 | Build bulk enquiry, versions and allocations | P09/P13 | D/F | Quote revision and acceptance tests |
| P17 | Build fixed packs and entitlement calendar | P09/P15 | D/Q | Skip/closure/refund scenarios |
| P18 | Build public templates and editorial workflow | P04/P07/P10 | D/C | Candidate pages remain unpublished |
| P19 | Add canonical/sitemap/schema/redirect rules | P18 | D/C/Q | Automated crawl report |
| P20 | Gather real menus, photos and local content | P08/P18 | F/C | Evidence attached to publishable pages |
| P21 | Add analytics and financial/area dashboards | P10–P17 | D/F | Deduplicated test funnel and reports |
| P22 | Complete performance/accessibility/security QA | P14–P21 | Q/D | Mobile, keyboard and access-control report |
| P23 | Complete policy/provider/food operations review | P01/P03/P15 | F/A | Launch checklist signed by owners |
| P24 | Rehearse incidents and restore; release serviceable coverage | P22/P23 | D/F/Q | Restore proof, support roster, smoke checks |
| P25 | Grow supply and publish further approved areas | P20/P24 | F/C | Weekly delivered-order and margin review |

## 33. Risk register and scaling decisions

| Risk | Signal | Response |
|---|---|---|
| Citywide demand but little supply | Unserved searches/low slot coverage | Recruit nearby kitchens and collect honest waitlists |
| Too many thin pages | Repeated content/no useful local inventory | Keep drafts; merge overlapping pages; review quality |
| Low basket economics | Negative contribution on small orders | Adjust fees/minimums; grow packs/group deliveries |
| Partner unreliability | Rejections/late preparation | Capacity discipline, backup partners, pause unreliable listings |
| Food-safety incident | Complaint pattern or specific serious report | Escalate, trace orders, suspend affected supply and follow reviewed response plan |
| Payment/ledger mismatch | Captured funds without order or payout discrepancy | Reconciliation, idempotency and finance escalation |
| Provider dependency | Map/delivery/payment outage | Adapters, fallback operations and explicit unavailable state |
| Scope creep | UI completed without reliable operations | Deliver vertical order flow before advanced automation |
| Privacy leak | Overbroad dashboard or public document | Least privilege, private storage and access tests |

Every future city is configuration: city ID, timezone, service geography, location aliases, content language, fee/tax policy version, kitchens, delivery adapters and operational owners. Do not hardcode Bengaluru into database logic or payment rules. Add a city only when supply, delivery and support are ready. Split modules/services or add a dedicated search engine only after profiling identifies a bottleneck.

## 34. Founder inputs needed before a real launch

The developer can begin protected scaffolding and sandbox work with the defaults above. Production requires: legal business/brand/domain; real kitchen agreements and documentation; menus/prices/photos; funded offers and payout terms; supported delivery areas/slots; gateway/maps/OTP accounts; approved taxes/policies; support contacts and response ownership; initial infrastructure/marketing budget. Do not invent these to make the site look finished.

Read the attached SEO register next, then give Claude all three files and the kickoff brief. The immediate task requested here is complete planning, not deployment.
