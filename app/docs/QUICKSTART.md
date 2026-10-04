# Quickstart

From the `app/` directory:

    npm install
    npx prisma generate
    npx prisma db push
    npm run db:seed
    npm test
    npm run build

To serve the built app on http://localhost:3000, run the Next.js start script
(`next start -p 3000`) from the `app/` directory. In this workspace it is also
launched via `./start-preview.sh`.

## Demo walkthrough

1. Open `/` and enter an area (try "HSR", "koramangala" or "whitefield").
2. Served areas (koramangala, hsr-layout, whitefield in the seed) show kitchens,
   meals and a slot-based order panel. Place a sandbox order — it runs a
   server-side quote, reserves capacity, and captures a signed sandbox payment.
3. Unserved areas (e.g. hebbal) show an honest waitlist state and stay noindex.
4. `/admin/seo` shows the publication queue. Only areas that pass the gate can
   be published; publishing adds them to `/sitemap.xml`.
5. `/bengaluru/bulk-food-orders` -> `/bulk/request` submits an enquiry (recorded,
   not priced).

## Accounts in the seed

All are sandbox fixtures (phone-verified, no real numbers):
- Customer `+910000000001`
- Partner `+910000000002`
- Admin `+910000000003`
- Content reviewer `+910000000004`

Sandbox OTP code is always `123456`.
