import sharp from "sharp";
import fs from "node:fs/promises";
for (const name of ["interior", "plate", "salad", "fish", "dessert"]) {
  const path = `public/images/${name}.jpg`;
  const original = await fs.readFile(path);
  await sharp(original)
    .resize({
      width: name === "interior" ? 1800 : 1100,
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path);
}
await sharp("public/images/interior.jpg")
  .resize(1200, 630, { fit: "cover" })
  .composite([
    {
      input: Buffer.from(
        '<svg width="1200" height="630"><rect width="1200" height="630" fill="#203124" fill-opacity=".55"/><text x="85" y="255" font-family="Georgia" font-size="83" fill="#f5f0e7">Ember &amp; Olive</text><text x="90" y="330" font-family="Georgia" font-style="italic" font-size="47" fill="#e3bd9c">A little fire. A lot of soul.</text><text x="92" y="540" font-family="Arial" font-size="18" letter-spacing="3" fill="#f5f0e7">FICTIONAL RESTAURANT · WORKING MANAGEMENT DEMO</text></svg>',
      ),
    },
  ])
  .jpeg({ quality: 85 })
  .toFile("public/images/og.jpg");
