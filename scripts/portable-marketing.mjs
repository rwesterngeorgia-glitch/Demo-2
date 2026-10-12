import fs from "node:fs/promises";
let script = await fs.readFile("scripts/marketing.mjs", "utf8");
script = script.replaceAll(
  "${pathToFileURL(path.resolve('public/fonts/cormorant-1.ttf'))}",
  "../public/fonts/cormorant-1.ttf",
);
script = script.replaceAll("${pathToFileURL(path.join(dir,file))}", "${file}");
script = script.replaceAll(
  "${pathToFileURL(path.join(dir,'desktop-homepage-viewport.png'))}",
  "desktop-homepage-viewport.png",
);
script = script.replaceAll(
  "${pathToFileURL(path.join(dir,'admin-dashboard-viewport.png'))}",
  "admin-dashboard-viewport.png",
);
await fs.writeFile("scripts/marketing.mjs", script);
for (const file of await fs.readdir("marketing")) {
  if (!file.endsWith(".html")) continue;
  let html = await fs.readFile(`marketing/${file}`, "utf8");
  html = html
    .replace(
      /file:\/\/\/[^']+cormorant-1\.ttf/g,
      "../public/fonts/cormorant-1.ttf",
    )
    .replace(/file:\/\/\/[^"]+marketing\/([^"]+)/g, "$1");
  await fs.writeFile(`marketing/${file}`, html);
}
