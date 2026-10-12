import { chromium } from "@playwright/test";
import sharp from "sharp";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:5173");
await page.waitForLoadState("networkidle");
await page.screenshot({
  path: "marketing/local-desktop-preview.png",
  fullPage: true,
});
await page.goto("http://127.0.0.1:5173/admin");
await page.waitForLoadState("networkidle");
await page.screenshot({
  path: "marketing/local-admin-preview.png",
  fullPage: true,
});
await browser.close();
const names = ["interior", "plate", "salad", "fish", "dessert"];
const tiles = await Promise.all(
  names.map(async (name, i) => ({
    input: await sharp(`public/images/${name}.jpg`)
      .resize(350, 260, { fit: "cover" })
      .toBuffer(),
    left: (i % 3) * 350,
    top: Math.floor(i / 3) * 260,
  })),
);
await sharp({
  create: { width: 1050, height: 520, channels: 3, background: "#f5f0e7" },
})
  .composite(tiles)
  .png()
  .toFile("marketing/photo-contact-sheet.png");
