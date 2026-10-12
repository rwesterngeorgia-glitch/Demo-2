# Ember & Olive marketing kit

Captured from the verified public application at https://ember-olive-demo.pages.dev on October 12, 2026. Screenshots are actual UI, not invented mockups. Fictional portfolio concept; not a paying client project or operating restaurant.

## Application screenshots

- `desktop-homepage.png`: complete desktop homepage; `desktop-homepage-viewport.png`: hero viewport.
- `mobile-homepage.png`: complete mobile homepage; `mobile-homepage-viewport.png`: mobile hero.
- `tablet-homepage.png`: tablet hero.
- `digital-menu.png`: categorized digital menu.
- `admin-dashboard.png`: dashboard with fictional service data.
- `menu-editor.png`: working dish editor in a native dialog.
- `staff-scheduling.png`: weekly staff calendar and directory.
- `reservation-management.png`: reservation list and controls.
- `daily-operations.png`: checklist groups, owners and notes.

## Ready-to-use graphics

- `instagram-carousel-1.png` through `instagram-carousel-5.png`: five 1080 × 1350 (4:5) graphics with actual application screenshots and disclosure.
- `facebook-portfolio.png`: 1200 × 630 portfolio post graphic.
- The corresponding HTML layouts remain editable and can be rendered again.
- `promotional-browser-recording.webm`: approximately 25-second landscape recording of the live website, category filtering, admin overview, actual dish price edit, staff calendar and reservations. Silent; no music rights are needed for the supplied recording.
- `REEL-STORYBOARD.md`: 25-second vertical Reel shot list and voice-over script.
- `CAPTIONS.md`: Instagram, Facebook and Reel captions, disclosure and image alt text.

The recording is a browser walkthrough, not a finished vertical narrated Reel. No content has been published to social media. Local preview/contact-sheet files are development references; use the named live screenshots above for promotion.

## Recreate

From the project root, with Playwright Chromium installed:

```sh
node scripts/marketing.mjs
```

Set `BASE_URL` to capture a later deployment. This creates its own isolated browser session, uses only fictional seed data, and does not alter another visitor's demo.
