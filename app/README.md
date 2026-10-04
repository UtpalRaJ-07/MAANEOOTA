# MAANE OOTA — Bengaluru homemade-food marketplace (sandbox build)

A server-rendered Next.js + TypeScript marketplace implementing the contract in
`../MAANE-OOTA-MASTER-PLAN.md` and `../SEO-AREA-AND-KEYWORD-REGISTER.md`.

This is a SANDBOX build. It runs end to end with clearly labelled fixtures and
sandbox integration adapters. No real kitchens, prices, payments, delivery, maps
or business data are present. See `docs/REMAINING-SETUP.md` for what a real
launch requires, and `docs/QUICKSTART.md` for the exact commands.

## Stack

- Next.js 14 (App Router) + TypeScript. Public pages are server-rendered;
  interactive ordering uses client components.
- Prisma + SQLite for the sandbox. The schema (`prisma/schema.prisma`) maps to
  the PostgreSQL + PostGIS blueprint in master-plan section 19. Money is always
  integer paise. Geometry is JSON in sandbox, PostGIS in production.
- Zod for server-side input validation on every API route.
- Vitest for critical-path tests.

## What is implemented

- 120 area candidates seeded as draft. No fabricated geography — lat/lng/PINs
  remain null until sourced.
- Publication gate (`src/server/publication.ts`): an area is indexable only when
  geography is sourced, an approved kitchen serves it, at least three listed
  meals exist, an upcoming slot has capacity, and a named reviewer approved it.
  Drafts stay noindex and out of the sitemap.
- Serviceability engine: one honest state (available / later / bulk_only /
  paused / not_served / location_unclear). PIN alone never grants eligibility.
- Ordering: server-side quote, one-kitchen cart, atomic capacity reservation
  with optimistic version guard, idempotency keys.
- Payments: sandbox adapter with real HMAC signature verification, webhook
  dedupe, payment/fulfilment state machines. The browser callback is never
  trusted as proof of payment.
- Offers: server-selected best eligible offer with atomic budget reservation;
  released on failed checkout.
- Refunds + ledger: capped refunds, append-only ledger reversals.
- Bulk: enquiries with versioned quotes; new versions supersede old ones;
  expired/superseded versions cannot be accepted.
- Meal packs: entitlement ledger; a skip cannot be both skipped and credited.
- Fulfilment: state machine with per-kitchen ownership checks.
- SEO: server-rendered metadata, per-page canonical, robots noindex for
  drafts/private routes, sitemap of published pages only, genuine 404s.
- Dashboards: admin (ledger, publication queue) and partner (prep list).

## Route families

See master-plan section 5. Canonical area route:
`/home-food-delivery/bengaluru/{area}`. Unknown slugs return a real 404.

## Sandbox vs production

| Concern | Sandbox here | Production |
|---|---|---|
| Database | SQLite | Managed PostgreSQL + PostGIS |
| Payments | signed sandbox webhook | Razorpay/equivalent + marketplace settlement |
| OTP | fixed code 123456 | managed India OTP provider + admin MFA |
| Maps | null coords | licensed Indian-coverage geocoder |
| Delivery | manual only | provider adapter + manual |
| Auth | demo, unauthenticated dashboards | full auth, roles, MFA, rate limits |
| Data | labelled fixtures | verified kitchens, menus, photos |
| Tax | 0 (must be set by a CA) | confirmed GST classification |

## Tests

The test suite covers: concurrent last-capacity race, idempotency, webhook
signature/replay, cross-kitchen denial, illegal transitions, refund caps, quote
versioning, pack skip double-count, serviceability states, and the publication
gate, plus the per-customer offer limit. Tests run against their own database
(`prisma/test.db`, recreated and seeded on every run), so they never touch the
preview data.
