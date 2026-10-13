import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("reservation validation rejects missing slot and closed Monday", async ({
  page,
}) => {
  await page.goto("/reservations");
  await page.getByLabel("Fictional guest name").fill("Validation Demo");
  await page.getByLabel("Demo email").fill("validation@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Request demo table" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Choose an available time",
  );
  const date = new Date();
  while (date.getDay() !== 1) date.setDate(date.getDate() + 1);
  await page
    .getByLabel("Date", { exact: true })
    .fill(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    );
  await expect(page.getByText("We rest on Mondays.")).toBeVisible();
  await expect(page.locator(".time-slots button")).toHaveCount(0);
});
test("image upload is validated and saved to the public menu", async ({
  page,
}) => {
  await page.goto("/admin/menu");
  await page
    .getByRole("button", { name: "Edit Whipped feta & warm pita" })
    .click();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "invalid.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not an image"),
    });
  await expect(page.getByRole("alert")).toContainText("JPG, PNG, or WebP");
  await page
    .locator("input[type=file]")
    .setInputFiles("public/images/dessert.jpg");
  await page.getByRole("button", { name: "Save dish" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/menu");
  const article = page
    .locator("article")
    .filter({
      has: page.getByRole("heading", { name: "Whipped feta & warm pita" }),
    });
  await expect(article.locator("img")).toHaveAttribute(
    "src",
    /^data:image\/jpeg;base64,/,
  );
});
test("capacity cannot be reduced below active reservations", async ({
  page,
}) => {
  await page.goto("/admin/reservations");
  await page.getByRole("button", { name: "Configure availability" }).click();
  const row = page
    .locator(".slot-editor")
    .filter({
      has: page.getByRole("checkbox", { name: "18:00", exact: true }),
    });
  await row.locator("input[type=number]").fill("1");
  await page.getByRole("button", { name: "Save availability" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Capacity cannot be lower",
  );
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("public pages navigate and render without overflow or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const url of [
    "/",
    "/menu",
    "/about",
    "/reservations",
    "/contact",
    "/admin",
    "/admin/menu",
    "/admin/reservations",
    "/admin/staff",
    "/admin/operations",
  ]) {
    await page.goto(url);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      url,
    ).toBeTruthy();
    await page.locator("img").evaluateAll(async (imgs) => {
      await Promise.all(
        imgs.map(async (img) => {
          (img as HTMLImageElement).loading = "eager";
          try {
            await (img as HTMLImageElement).decode();
          } catch {
            /* Report invalid images below. */
          }
        }),
      );
    });
    const images = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter(
            (img) =>
              !(
                (img as HTMLImageElement).complete &&
                (img as HTMLImageElement).naturalWidth > 0
              ),
          )
          .map((img) => img.getAttribute("src")),
      );
    expect(images, url).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test("menu filters category and dietary preference", async ({ page }) => {
  await page.goto("/menu");
  await page.getByRole("button", { name: "Desserts", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Olive oil cake" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Slow-braised lamb" }),
  ).toHaveCount(0);
  await page.getByLabel("Dietary preference").selectOption("Vegan");
  await expect(page.getByText("No dishes match")).toBeVisible();
});
test("add edit and hide a dish updates public menu and persists", async ({
  page,
}) => {
  await page.goto("/admin/menu");
  await page.getByRole("button", { name: "Add dish" }).click();
  await page.getByLabel("Dish name").fill("Roasted demo aubergine");
  await page
    .getByLabel("Description", { exact: true })
    .fill("A fictional seasonal plate with lemon and herbs.");
  await page.getByLabel("Price (USD)").fill("22.50");
  await page.getByLabel("Category", { exact: true }).selectOption("Mains");
  await page.getByLabel("Vegan", { exact: true }).check();
  await page.getByLabel("Allergens", { exact: true }).fill("Sesame");
  await page.getByRole("button", { name: "Save dish" }).click();
  await page
    .getByRole("button", { name: "Edit Roasted demo aubergine" })
    .click();
  await page.getByLabel("Dish name").fill("Fire-roasted demo aubergine");
  await page.getByRole("button", { name: "Save dish" }).click();
  await page.getByRole("link", { name: "View public menu" }).click();
  await expect(
    page.getByRole("heading", { name: "Fire-roasted demo aubergine" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Fire-roasted demo aubergine" }),
  ).toBeVisible();
  await page.goto("/admin/menu");
  await page
    .getByRole("button", {
      name: "Mark unavailable: Fire-roasted demo aubergine",
      exact: true,
    })
    .click();
  await expect(page.locator('#root')).not.toHaveAttribute('aria-busy', 'true');
  await page.goto("/menu");
  await expect(
    page.getByRole("heading", { name: "Fire-roasted demo aubergine" }),
  ).toHaveCount(0);
});
test("reservation flows into admin and can be confirmed cancelled and viewed in calendar", async ({
  page,
}) => {
  await page.goto("/reservations");
  const date = new Date();
  date.setDate(date.getDate() + 2);
  if (date.getDay() === 1) date.setDate(date.getDate() + 1);
  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await page.getByLabel("Date", { exact: true }).fill(value);
  await page.getByRole("button", { name: "17:00", exact: true }).click();
  await page.getByLabel("Fictional guest name").fill("Avery Test");
  await page.getByLabel("Demo email").fill("avery@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Request demo table" }).click();
  await expect(page.getByText("DEMO REQUEST RECEIVED")).toBeVisible();
  await page.getByRole("link", { name: "View demo request" }).click();
  await page.getByLabel("Search guests").fill("Avery");
  await expect(
    page.getByRole("cell", { name: "Avery Test", exact: false }),
  ).toBeVisible();
  await page.getByLabel("Status for Avery Test").selectOption("Confirmed");
  await expect(
    page.getByText("Avery Test: Confirmed", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Calendar", exact: true }).click();
  await expect(page.getByText("Avery Test", { exact: true })).toBeVisible();
  await page.getByLabel("Status for Avery Test").selectOption("Cancelled");
  await expect(page.getByText('Avery Test: Cancelled', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByLabel("Search guests").fill("Avery");
  await expect(page.getByLabel("Status for Avery Test")).toHaveValue(
    "Cancelled",
  );
});
test("slot settings change public availability", async ({ page }) => {
  await page.goto("/admin/reservations");
  await page.getByRole("button", { name: "Configure availability" }).click();
  await page.getByRole("checkbox", { name: "17:00", exact: true }).uncheck();
  await page.getByRole("button", { name: "Save availability" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/reservations");
  const input = page.getByLabel("Date", { exact: true });
  const date = new Date();
  date.setDate(date.getDate() + 3);
  if (date.getDay() === 1) date.setDate(date.getDate() + 1);
  await input.fill(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  );
  await expect(
    page.getByRole("button", { name: "17:00", exact: true }),
  ).toHaveCount(0);
});
test("staff scheduling rejects overlap and supports create edit remove", async ({
  page,
}) => {
  await page.goto("/admin/staff");
  await page.getByRole("button", { name: "Create shift" }).click();
  await page.getByRole("button", { name: "Save shift" }).click();
  await expect(page.getByRole("alert")).toContainText("overlapping shift");
  await page.getByLabel("Start time", { exact: true }).fill("09:00");
  await page.getByLabel("End time", { exact: true }).fill("12:00");
  await page.getByRole("button", { name: "Save shift" }).click();
  const shift = page.getByRole("button", {
    name: /Edit shift for Maya Bennett.*09:00/,
  });
  await expect(shift).toBeVisible();
  await shift.click();
  await page.getByLabel("End time", { exact: true }).fill("13:00");
  await page.getByRole("button", { name: "Save shift" }).click();
  await shift.click();
  await page.getByRole("button", { name: "Remove shift" }).click();
  await expect(shift).toHaveCount(0);
});
test("checklists owners and manager notes persist", async ({ page }) => {
  await page.goto("/admin/operations");
  await page
    .getByRole("checkbox", { name: "Review reservations & dietary notes" })
    .check();
  await page
    .getByLabel("Owner of Review reservations & dietary notes")
    .selectOption("s3");
  await page
    .getByLabel("Service notes", { exact: true })
    .fill("Fictional service note for testing.");
  await page.getByRole("button", { name: "Save notes" }).click();
  await expect(page.getByText('Manager notes saved in this browser.',{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Service notes", { exact: true })).toHaveValue(
    "Fictional service note for testing.",
  );
  await expect(
    page.getByRole("checkbox", { name: "Review reservations & dietary notes" }),
  ).toBeChecked();
  await expect(
    page.getByLabel("Owner of Review reservations & dietary notes"),
  ).toHaveValue("s3");
});
test("contact message appears locally and reset restores seed", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Fictional name", { exact: true }).fill("Demo Visitor");
  await page.getByLabel("Demo email").fill("visitor@example.com");
  await page
    .getByLabel("Your fictional message")
    .fill("A fictional dinner question.");
  await page.getByRole("button", { name: "Save demo message" }).click();
  await expect(page.getByText("Your demo note is saved.")).toBeVisible();
  await page.goto("/admin");
  await expect(page.getByText("A fictional dinner question.")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(
    page.getByText("No demo messages yet.", { exact: false }),
  ).toBeVisible();
});
test("browser visitors are isolated", async ({ browser }) => {
  const a = await browser.newContext(),
    b = await browser.newContext();
  const p = await a.newPage(),
    q = await b.newPage();
  await p.goto("/admin/menu");
  await p
    .getByRole("button", {
      name: "Mark unavailable: Whipped feta & warm pita",
      exact: true,
    })
    .click();
  await q.goto("/menu");
  await expect(
    q.getByRole("heading", { name: "Whipped feta & warm pita" }),
  ).toBeVisible();
  await expect(p.locator('#root')).not.toHaveAttribute('aria-busy', 'true');
  await p.goto("/menu");
  await expect(
    p.getByRole("heading", { name: "Whipped feta & warm pita" }),
  ).toHaveCount(0);
  await a.close();
  await b.close();
});
test("accessibility audit across public and admin pages", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const url of [
    "/",
    "/menu",
    "/about",
    "/reservations",
    "/contact",
    "/admin",
    "/admin/menu",
    "/admin/reservations",
    "/admin/staff",
    "/admin/operations",
  ]) {
    await page.goto(url);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      url,
    ).toEqual([]);
  }
});
test("mobile navigation and keyboard modal dismissal work", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Our menu" })
      .click();
    await expect(page).toHaveURL(/\/menu$/);
  } else {
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
  }
  await page.goto("/admin/menu");
  await page.getByRole("button", { name: "Add dish" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
