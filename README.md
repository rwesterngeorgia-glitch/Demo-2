# Ember & Olive

A premium fictional Mediterranean restaurant in Philadelphia, paired with a working restaurant management studio. Built as a digital agency portfolio demonstration. No paying client, operating restaurant, actual sales, or real reservations are represented.

## Explore

- Website: https://ember-olive-demo.pages.dev
- Management studio: https://ember-olive-demo.pages.dev/admin
- Repository: https://github.com/rwesterngeorgia-glitch/Demo-2

## Features

**Restaurant:** responsive editorial homepage, categorized menu with dietary filtering, restaurant story and gallery, date/time/party reservation flow with availability checks, local demo confirmations, contact form, hours, and clearly fictional location map.

**Management:** today's reservations and guest totals, illustrative popularity chart, status breakdown, staff summary, activity feed and demo inbox; dish creation/editing, prices, categories, availability, dietary labels, allergens, image selection/upload; guest/date search, list/calendar views, reservation status updates and repeating slot capacities; rolling seven-day staff calendar, directory, shift creation/edit/removal with overlap validation; owned opening, preparation, cleaning and closing checklists and saved manager notes.

**Demo controls:** isolated browser-local changes, reset button, fictional contact restrictions, storage failure notice, accessible native dialogs and keyboard controls, responsive mobile dashboard, reduced-motion support.

## Architecture

React 19 + TypeScript + Vite + React Router. Custom responsive CSS provides the art direction. Lucide supplies icons. Static Cloudflare Pages hosting uses `npm run build` and output directory `dist`; no Next.js server features or backend runtime are required.

The versioned localStorage key is `ember-olive-demo-v1`. Seed dates initialize relative to the visitor's local date. Changes persist in this browser on this origin; another visitor cannot change your demo. Refresh retains changes. Reset replaces them with fictional seed data. Browser storage can be cleared or blocked; uploads count toward its quota. Uploaded images accept JPG/PNG/WebP under 1.5 MB. Capacity is per time slot and counts active guests, not physical tables. Slot settings repeat Tuesday–Sunday. Staff availability is advisory, while same-person time overlaps and invalid time ranges are enforced. Overnight shifts are unsupported.

There is intentionally no authentication, server database, email, live map, payments, analytics, or third-party social destinations. `/admin` is a public demo, not a protected business system. Do not enter real personal information. Contact and booking emails require `@example.com`.

## Run locally

Node.js 22.12+ or 24 LTS:

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test -- --workers=3
```

With a running preview, tests can target a deployed URL:

```sh
BASE_URL=https://ember-olive-demo.pages.dev npm test -- --workers=3
```

PowerShell: `$env:BASE_URL='https://ember-olive-demo.pages.dev'` before the test command. See [QA.md](QA.md) for verified results and scope.

## Deploy on Cloudflare Pages

This project uses direct upload, which avoids granting a new GitHub application access. Authenticate through the Cloudflare OAuth browser flow:

```sh
npx wrangler login
npm run build
npx wrangler pages project create ember-olive-demo --production-branch main
npx wrangler pages deploy dist --project-name ember-olive-demo --branch main
```

The create command runs once only. Cloudflare Pages serves SPA routes by falling back to `index.html`; do not add a top-level `404.html`. Security headers are in `public/_headers`. No paid services are required. This direct-upload project has no automatic Git deploys. Redeploy after changing source. A future GitHub workflow should use a narrowly scoped encrypted Cloudflare credential; never commit it.

## Reuse for a real restaurant

1. Replace the fictional branding, story, location, hours, staff, menu and photographs with approved business content. Verify recipes, prices, allergens, cross-contact statements and image rights.
2. Replace browser storage with an authorized backend and migrations. Protect management routes with real authentication and role-based authorization; enforce tenant isolation and validations on the server.
3. Integrate real reservation inventory and table/seating duration rules, timezone-aware availability, concurrency protection, cancellations and transactional confirmations. Replace `@example.com` restrictions only after appropriate privacy controls exist.
4. Add consent, retention/deletion policies, backups, monitoring, rate limits, abuse protection, accessibility review and jurisdiction-appropriate notices. Staff records require appropriate access controls.
5. Add verified maps/contact/social accounts, canonical domain and route-specific SEO. Test the production backend, permissions, mobile layouts and real integrations before accepting customer data.

## Assets & marketing

See [ASSETS.md](ASSETS.md) for photo/font licenses. `marketing/` contains actual application screenshots, social graphics, promotional browser recording, captions and Reel script/storyboard. All promotional copy identifies the work as a fictional portfolio concept. Nothing is posted to social media.

