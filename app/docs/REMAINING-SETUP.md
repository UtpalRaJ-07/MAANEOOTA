# Remaining setup for a real launch

The sandbox build implements all independent product logic. The items below are
genuine external/business dependencies (master-plan sections 26, 33, 34, and the
non-negotiables in CLAUDE-DEVELOPMENT-BRIEF.md). They are NOT implemented with
invented credentials or fake data.

## Integration credentials (server-side only)

Fill `.env` from `.env.example`. Each adapter switches from sandbox to live
automatically when its provider env var is not `sandbox`.

- Payments: Razorpay (or equivalent) key id/secret + webhook secret, plus
  marketplace settlement onboarding/approval. `src/server/adapters/payments.ts`
  and `src/server/payments.ts` already verify signatures on the raw body,
  deduplicate events and reconcile unknown payments — point them at the real
  gateway and confirm the settlement model with the provider.
- OTP: a managed India OTP provider. Replace `src/server/adapters/otp.ts`. Add
  admin MFA.
- Maps/geocoding: a licensed Indian-coverage provider. Replace
  `src/server/adapters/maps.ts`. Do not store coordinates the licence forbids
  retaining.
- Delivery: an approved provider adapter. Replace
  `src/server/adapters/delivery.ts`. Manual assignment is already first-class.

## Database

- Move from SQLite to managed PostgreSQL with PostGIS. Change the Prisma
  datasource `provider` and `DATABASE_URL`, convert JSON geometry fields to
  PostGIS geometry, and add spatial indexes for service-zone containment.
- Add real DB-level constraints already modelled here (unique provider event
  ids, unique idempotency keys, unique review per order) — they exist in the
  schema and are enforced.

## Verified data (never fabricate)

- Source geography, aliases, coordinates and boundaries for the 120 candidates
  via the licensed maps provider and field ops; verify PINs against India Post.
  Until then locations stay draft with null coordinates.
- Real kitchen agreements, documents, menus, prices and permissioned photos.
  All seeded kitchens/meals are marked `isFixture` and must be removed before
  production.
- Funded, approved offers and payout terms. `TRIAL30` is a staging-only offer.

## Legal / tax / compliance (owned by the business + advisers)

- FSSAI licensing category and display, GST classification for prepared meals /
  catering / platform+delivery fees, consumer/ecommerce obligations, DPDP
  notices/consent, municipal/trade/insurance, and counsel-reviewed partner
  contracts. Tax is currently 0 in `src/server/pricing.ts` and must be set by a
  CA — it is not guessed.

## Security hardening before launch

- Real authentication + session management; server-side role and
  kitchen/customer ownership checks on every private request (ownership checks
  are implemented in the domain layer; wire them to authenticated identities).
- Admin MFA, rate limits (OTP/search/forms/payment), CSRF, private encrypted
  document storage with malware scanning and signed short-lived downloads,
  redacted logs, dependency updates, audit logging (audit log model exists),
  and a tested backup/restore.
- The admin and partner dashboards in this sandbox are intentionally
  unauthenticated for demonstration and MUST be gated before any real data.

## Environments

- Local, password-protected preview/staging (sandbox providers, no production
  personal data, noindex), and production with separate credentials/database.
- Feature-flag new checkout coverage, suppliers, payment methods, promotions and
  SEO publication. Releasing all 120 URLs must never enable payment everywhere.
