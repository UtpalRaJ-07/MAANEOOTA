# MAANE OOTA website

A fast, static showcase site for MAANE OOTA: bulk biryani, North Indian and
South Indian food in Bengaluru, ordered by custom quote. There is no booking,
payment or login — customers send an enquiry on WhatsApp or call.

## Before going live

Edit `src/data/site.ts`:

- `url`: your real domain (used for canonical links, the sitemap and link previews)
- `whatsapp`: business WhatsApp number with country code, digits only
- `phone`, `email`, `instagram`: optional; blank values are hidden

Then review the content data files (see below) and replace the illustrative
photos in `public/images` with your own food photos where possible. Photo
credits for the current images are at `/credits/`.

## Content lives in data files (no CMS)

Everything the site shows comes from typed data files in `src/data`. Add or edit
entries there and the pages, menu, footer, sitemap and enquiry form update
automatically:

- `dishes.ts` — the menu (78 dishes across 5 categories). Each dish gets its own
  page at `/{cuisine}/{dish}/`. Required per dish: `slug`, `name`, `cuisine`,
  `diet`, `unit`, a `desc` (>= 12 words) and a `longDescription` (>= 40 words).
  Mark speculative dishes with a `// CONFIRM WITH OWNER` comment.
- `cuisines.ts` — the 5 cuisine hubs (biryani, north-indian, south-indian,
  starters, sweets).
- `areas.ts` — 156 Bengaluru areas, each with a page at `/bengaluru/{area}/`.
- `occasions.ts` — occasion pages (office, weekly office lunch, functions,
  festivals, large gatherings).
- `guides.ts` — planning guides (each `body` >= 200 words).
- `area-cuisine.ts` — a small curated set of "{cuisine} in {area}" pages. Capped
  at 20% of areas. Each needs a hand-written `extraParagraph` of local content.

Set `published: false` on an occasion, guide or area-cuisine entry to keep it out
of the site and the sitemap entirely (it won't be generated).

## The content check (Publication Gate)

`npm run build` first runs `scripts/validate-content.ts`. It fails the build (so
nothing bad reaches the site) if any page is missing required fields, is too
short, has a duplicate title/description, makes an unconfirmed health claim,
uses a "near me" doorway slug, exceeds the area-cuisine cap, or copies text
between a guide and a hub/area page. Run it on its own with `npm run validate`.
Test the checker itself with `npm run test:content`.

## Build and preview

    npm install
    npm run build        # validates content, then writes the static site to ./out
    ./preview.sh         # serves ./out on http://localhost:3000

## Hosting

Upload the `out` folder to any static host (Cloudflare Pages, Netlify, Vercel,
GitHub Pages or plain web hosting). After launch, submit
`https://yourdomain/sitemap.xml` in Google Search Console and set up a Google
Business Profile for local "near me" searches.

## What's on the site

- Home, full menu, 5 cuisine hubs, 78 dish pages
- 156 area pages + a curated set of area+cuisine pages
- Occasion pages and planning guides
- Enquire (WhatsApp), About, Photo credits
- sitemap.xml and robots.txt generated at build time (272 pages total)
