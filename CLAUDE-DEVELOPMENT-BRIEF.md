# Claude development handoff — MAANE OOTA

Give Claude this file together with:

1. MAANE-OOTA-MASTER-PLAN.md
2. SEO-AREA-AND-KEYWORD-REGISTER.md

## Copy-ready instruction

You are implementing MAANE OOTA, a Bengaluru-first marketplace for homemade food. Read both attached planning documents completely before changing the project. The business objective is profitable delivered orders across Bengaluru through nearby kitchens, useful local search pages, repeat meal plans, transparent offers and bulk/office food orders.

The planning task has already been completed. In this development session, inspect the repository and its instructions, identify existing work, and implement the product in reviewable milestones. Preserve existing work. Use the master plan as the implementation contract. Explain material changes to its assumptions.

Start with a concise implementation checklist and then build the first coherent milestone: application foundation, mobile design system, city/location data, roles, public catalogue/area template, partner/admin foundations, and serviceability states. Use fixture data only in clearly labelled protected development/staging. Leave production listings and SEO candidates unpublished until real evidence is supplied. Continue through the transaction, operations, bulk, pack, SEO and verification milestones as the session scope allows; maintain an honest completed/pending checklist.

Do not stop at a homepage mockup. The final product needs a real ordering and operating system. Do not claim a feature works because its button or screen exists. Implement server-side rules, database constraints, authorisation, error handling and tests for critical paths.

### Non-negotiable requirements

1. Support Bengaluru-wide location discovery and enquiries from the start. Enable checkout only for serviceable addresses, slots and actual kitchen capacity. Never display unsupported “delivered everywhere” claims.
2. Use the 120 area candidates as draft data, not as 120 automatically indexed pages. Verify geography, aliases, supply, delivery and distinct local content before publication. Keep PINs and coordinates unknown until sourced.
3. Use one canonical area-route family: `/home-food-delivery/bengaluru/{area}`. Add specific local intent routes only through the publication gate. Do not build duplicate pages for Bangalore/Bengaluru, spelling variations, PINs, every street or every filter combination.
4. Render useful public page content and metadata on the server. Provide crawlable links, correct status codes, canonical URLs and sitemaps containing only approved indexable pages. Private routes need authentication and authorisation; robots/noindex are not access controls.
5. Use simple Indian English and a warm mobile-first food interface. The first screen must explain the product and let a person enter an area. Use real supplied meal photographs for actual listings and clear total charges before payment.
6. Keep one kitchen per cart initially. Enforce slot and item capacity atomically, including concurrent orders, reservation expiry and late payment events.
7. Use integer paise, price snapshots and server-calculated totals. Verify hosted payment outcomes server-side, deduplicate webhooks and reconcile uncertain payments. Never trust a browser success redirect as proof of payment.
8. Implement order acceptance, scheduled fulfilment, delivery exceptions, support, partial/full refunds and auditable partner settlement. Record the difference between payment success and order delivery.
9. Make offers genuine, budgeted and scoped. Apply eligibility and campaign limits on the server. No fake original prices, countdowns, ratings, “best price” guarantees or unsupported health claims.
10. Bulk ordering uses capacity-checked, versioned itemised quotations. Fixed meal packs use service calendars and an entitlement ledger. Do not substitute kitchens or change accepted quotes silently.
11. Enforce customer/kitchen ownership, scoped admin permissions, private document storage, admin MFA, rate limits and audit logging. Never put addresses, phone numbers or bank details into analytics or public URLs.
12. Keep integration secrets server-side. Without credentials, use adapters and labelled sandbox states. Never invent a working payment, map, delivery or messaging integration.
13. Do not purchase services, spend on advertising, send promotional messages, publish to production or activate live payments merely to finish a demo. Request the actual required credentials/authorisation at the relevant release step while continuing independent work.
14. Treat legal/tax/provider requirements as launch dependencies owned by the business and its advisers. Do not hardcode guessed tax rates or claim compliance from a checkbox.
15. Follow the evidence gates and acceptance criteria in the plan. Report implemented, tested, unverified and blocked items separately and link actual changed files.

### Technical direction

Use TypeScript and Next.js with server-rendered public pages; a modular monolith; managed PostgreSQL with spatial capability; durable jobs/outbox; hosted payment and managed OTP adapters; object storage with private/public separation; accessible components; and a small mobile JavaScript footprint. Validate current stable versions and hosting/provider compatibility before choosing exact packages. Do not introduce microservices, native apps or a search cluster without a measured need.

Keep public SEO state separate from checkout serviceability. Protect personal data from shared caches. Model localities and PIN codes as many-to-many and preserve geographic source information. Keep future cities configurable.

### Build sequence

1. Repository review, decisions, design tokens, schema/migrations, CI and protected environments.
2. Identity/roles, verified geography, kitchen onboarding, menus, slots, capacity and delivery zones.
3. Search/catalogue and serviceability; city/area templates and draft editorial workflow.
4. Quotes, offers, reservations, hosted payment, order state machines and notifications.
5. Partner fulfilment, dispatch, refunds, reconciliation, ledger and settlements.
6. Bulk requests/versioned quotes and fixed meal-pack calendars.
7. Real content import, SEO approval gates, canonicals, sitemaps, analytics and support.
8. Security, concurrency, browser, accessibility, performance, restore and operations rehearsals.
9. Production release only after business launch inputs and release authorisation are present.

### Critical demonstrations before declaring readiness

- An actual sandbox order moves from location selection through payment, kitchen acceptance and delivery.
- Two customers cannot both buy the same final available capacity.
- Repeated payment events or checkout taps cannot duplicate orders, refunds, offer redemptions or settlements.
- A customer cannot access another customer's order; a partner cannot edit another kitchen.
- An expired offer, unsupported address, sold-out slot and late payment each show the correct recoverable state.
- A quote revision invalidates acceptance of the older version; pack skipping cannot duplicate entitlement or refund value.
- Draft/thin SEO pages stay out of the sitemap and indexable output. Approved pages have meaningful HTML and working local order paths.
- Refund and settlement examples reconcile with captured payments and the ledger.
- Mobile/keyboard flows work, secrets and personal data stay private, and a backup can be restored.

Finish each milestone with a concise result, verification evidence, open business inputs and the next dependency. Do not represent demo menus, illustrative economics or planned geography as real production facts.
