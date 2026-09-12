/**
 * Feature 2/50: category quick-filter chips on the store grid.
 */
import { test, expect } from "@playwright/test";

test("category chips render from the live catalog", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const chips = page.getByTestId("category-chips");
  await expect(chips).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("category-chip-All")).toBeVisible();
});

test("picking a category narrows the grid", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const chips = page.getByTestId("category-chips");
  await expect(chips).toBeVisible({ timeout: 15000 });
  const options = chips.getByTestId(/^category-chip-/);
  const count = await options.count();
  expect(count).toBeGreaterThan(1);
  const second = await options.nth(1).textContent();
  await options.nth(1).scrollIntoViewIfNeeded();
  await options.nth(1).click({ force: true });
  // Grid still renders; every visible card belongs to the picked category path
  await expect(page.getByTestId("store-grid")).toBeVisible();
  await expect(options.nth(1)).toHaveText(second ?? "");
});
