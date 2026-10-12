import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const base = process.env.BASE_URL || "https://ember-olive-demo.pages.dev";
const dir = path.resolve("marketing");
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
async function ready() {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}
for (const [name, url] of [
  ["desktop-homepage", "/"],
  ["digital-menu", "/menu"],
  ["admin-dashboard", "/admin"],
  ["staff-scheduling", "/admin/staff"],
  ["reservation-management", "/admin/reservations"],
]) {
  await page.goto(base + url);
  await ready();
  await page.screenshot({
    path: path.join(dir, `${name}.png`),
    fullPage: true,
  });
  await page.screenshot({ path: path.join(dir, `${name}-viewport.png`) });
}
await page.goto(base + "/admin/menu");
await ready();
await page
  .getByRole("button", { name: "Edit Whipped feta & warm pita" })
  .click();
await page.screenshot({ path: path.join(dir, "menu-editor.png") });
await page.keyboard.press("Escape");
await page.goto(base + "/admin/operations");
await ready();
await page.screenshot({
  path: path.join(dir, "daily-operations.png"),
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base);
await ready();
await page.screenshot({
  path: path.join(dir, "mobile-homepage.png"),
  fullPage: true,
});
await page.screenshot({ path: path.join(dir, "mobile-homepage-viewport.png") });
await page.setViewportSize({ width: 820, height: 1180 });
await page.goto(base);
await ready();
await page.screenshot({ path: path.join(dir, "tablet-homepage.png") });
await context.close();
const record = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: {
    dir: path.join(dir, "recording"),
    size: { width: 1280, height: 800 },
  },
});
const videoPage = await record.newPage();
await videoPage.goto(base);
await videoPage.waitForLoadState("networkidle");
await videoPage.waitForTimeout(3500);
await videoPage.evaluate(() =>
  window.scrollTo({ top: 900, behavior: "smooth" }),
);
await videoPage.waitForTimeout(2500);
await videoPage.goto(base + "/menu");
await videoPage.waitForTimeout(2500);
await videoPage.getByRole("button", { name: "Seafood", exact: true }).click();
await videoPage.waitForTimeout(2000);
await videoPage.goto(base + "/admin");
await videoPage.waitForTimeout(2500);
await videoPage.goto(base + "/admin/menu");
await videoPage.waitForTimeout(1000);
await videoPage
  .getByRole("button", { name: "Edit Whipped feta & warm pita" })
  .click();
await videoPage.waitForTimeout(2500);
await videoPage.getByLabel("Price (USD)").fill("18");
await videoPage.getByRole("button", { name: "Save dish" }).click();
await videoPage.waitForTimeout(1500);
await videoPage.goto(base + "/admin/staff");
await videoPage.waitForTimeout(2500);
await videoPage.goto(base + "/admin/reservations");
await videoPage.waitForTimeout(2000);
const video = videoPage.video();
await record.close();
await video.saveAs(path.join(dir, "promotional-browser-recording.webm"));
const carousel = [
  [
    "A beautiful website.",
    "A better way to run the evening.",
    "desktop-homepage-viewport.png",
    "Restaurant website + management software",
  ],
  [
    "Every plate,",
    "perfectly presented.",
    "digital-menu-viewport.png",
    "A filterable menu guests can explore",
  ],
  [
    "Behind the welcome,",
    "a working studio.",
    "admin-dashboard-viewport.png",
    "Reservations, team shifts & daily preparation",
  ],
  [
    "Make a change.",
    "See it at the table.",
    "menu-editor.png",
    "Dish edits update the public menu immediately",
  ],
  [
    "Built for the guests.",
    "And the people behind them.",
    "staff-scheduling-viewport.png",
    "We build useful internal software for businesses",
  ],
];
const slides = await browser.newContext({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 1,
});
const graphic = await slides.newPage();
for (let i = 0; i < carousel.length; i++) {
  const [a, b, file, sub] = carousel[i];
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:Editorial;src:url('../public/fonts/cormorant-1.ttf')}*{box-sizing:border-box}body{margin:0;width:1080px;height:1350px;background:#f5f0e7;color:#293b30;padding:65px;font-family:Arial}.top{display:flex;justify-content:space-between;font-size:15px;letter-spacing:3px;border-bottom:1px solid #c8c7b8;padding-bottom:27px}h1{font:78px/1.02 Editorial,Georgia;margin:48px 0 23px;letter-spacing:-2px}h1 em{color:#ad5136;font-style:normal}p{font-size:22px;line-height:1.6;margin:0 0 36px}.frame{background:#e6e4d8;padding:17px;border:1px solid #cfcebd;display:flex;align-items:center;justify-content:center;height:650px;overflow:hidden}.frame img{width:100%;height:100%;object-fit:contain}.bottom{display:flex;justify-content:space-between;margin-top:30px;font-size:16px;line-height:1.7}.bottom b{font-weight:400;color:#ad5136}.site{font-size:19px;letter-spacing:1px}</style></head><body><div class="top"><span>EMBER & OLIVE / AGENCY PORTFOLIO</span><span>0${i + 1} / 05</span></div><h1>${a}<br/><em>${b}</em></h1><p>${sub}</p><div class="frame"><img src="${file}"/></div><div class="bottom"><span><b>FICTIONAL RESTAURANT CONCEPT</b><br/>Not a client project. Actual working application.</span><span class="site">Explore the demo ↗<br/>ember-olive-demo.pages.dev</span></div></body></html>`;
  await fs.writeFile(path.join(dir, `carousel-${i + 1}.html`), html);
  await graphic.goto(
    pathToFileURL(path.join(dir, `carousel-${i + 1}.html`)).href,
  );
  await graphic.evaluate(() => document.fonts.ready);
  await graphic.screenshot({
    path: path.join(dir, `instagram-carousel-${i + 1}.png`),
  });
}
await graphic.setViewportSize({ width: 1200, height: 630 });
const facebook = `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:Editorial;src:url('../public/fonts/cormorant-1.ttf')}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#293b30;color:#f5f0e7;font-family:Arial;padding:48px;display:grid;grid-template-columns:1fr 1.2fr;gap:35px}.tag{font-size:12px;letter-spacing:2px;color:#d9cbb4}h1{font:65px/1.02 Editorial,Georgia;margin:35px 0 23px;letter-spacing:-1px}p{font-size:17px;line-height:1.6}.disclosure{font-size:12px;color:#e1c2a6;line-height:1.6;margin-top:32px}.images{display:flex;flex-direction:column;gap:18px;justify-content:center}.images img{width:100%;height:236px;object-fit:cover;object-position:top;border:7px solid #f5f0e7}</style></head><body><div><div class="tag">EMBER & OLIVE / PORTFOLIO DEMO</div><h1>Good design.<br/>Useful software.<br/>One experience.</h1><p>Restaurant website, menu editor,<br/>reservations & team operations.</p><p>ember-olive-demo.pages.dev ↗</p><div class="disclosure">Fictional restaurant concept. Not a client project.<br/>Screenshots of the actual working application.</div></div><div class="images"><img src="desktop-homepage-viewport.png"><img src="admin-dashboard-viewport.png"></div></body></html>`;
await fs.writeFile(path.join(dir, "facebook-graphic.html"), facebook);
await graphic.goto(pathToFileURL(path.join(dir, "facebook-graphic.html")).href);
await graphic.evaluate(() => document.fonts.ready);
await graphic.screenshot({ path: path.join(dir, "facebook-portfolio.png") });
await browser.close();
console.log(
  "Live screenshots, carousel, Facebook graphic and browser recording saved to marketing/.",
);
