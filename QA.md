# QA evidence

Verified October 12, 2026. All data used in testing was fictional. Browser contexts are isolated; test changes do not affect other visitors.

## Completed checks

| Check | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript strict typecheck | Passed |
| Vite production build | Passed |
| npm dependency audit | 0 vulnerabilities after updating Sharp to 0.35.5 |
| Local Playwright suite | 22 / 22 passed |
| Public deployment Playwright suite | 28 / 28 passed at https://ember-olive-demo.pages.dev |
| Viewports | Chromium desktop 1280 × 720 and emulated iPhone 13 390 × 664 |
| Accessibility | axe-core WCAG 2 A/AA and WCAG 2.1 AA scans across all 10 public/admin routes; no detected violations in tested states |
| Console/runtime | No page errors across tested routes |
| Images & navigation | All route headings render, images decode, no document-level horizontal overflow |

## Functional coverage

The final 28-test live suite also verifies rejected image file types, valid image uploads propagating to the public menu, missing reservation slots, closed Mondays, and refusal to reduce capacity below existing active reservations. The suite exercises categorized and dietary menu filtering; dish creation, edit, hide, persistence and public-menu propagation; guest reservation creation, admin search, confirmation, cancellation, calendar view and persistence; slot configuration affecting public availability; overlapping shift rejection, shift creation, editing and removal; checklist completion, task ownership, manager notes and persistence; contact messages appearing in the local admin inbox; resetting seed data; two independent browser visitors; mobile navigation; desktop skip link keyboard focus; native dialog Escape dismissal.

Problems discovered and repaired include text contrast, keyboard access to scrolling tables, ambiguous select labels, calendar guest markup, and test synchronization for lazy-loaded images and entry animations. The image-processing dependency's advisory was fixed before deployment.

## Scope & limitations

Automated accessibility tests complement, but do not certify, full accessibility. Native Safari/Firefox and physical mobile devices were not tested. No actual customer data, real emails, protected admin authentication, production database, table-duration inventory, or integrations exist. This is an intentionally isolated browser-local demonstration. Storage quotas vary by browser; a visible error explains persistence failures. Seed dates remain as saved until reset. Sample operations metrics are clearly labeled.

Cloudflare Pages uses a static SPA fallback and direct upload. GitHub does not automatically trigger deployment; rebuild and upload after edits. No paid services, custom domain, social posting, or unrelated project changes were made.

