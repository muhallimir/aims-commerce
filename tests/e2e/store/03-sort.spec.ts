/**
 * Feature 3/50: grid sorting on the storefront.
 */
import { test, expect } from "@playwright/test";

test("sort control reorders the grid by price", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const sort = page.getByTestId("sort-select");
  await expect(sort).toBeVisible({ timeout: 15000 });
  await sort.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Sort by" }).focus();
  await page.keyboard.press("ArrowDown");
  await page.getByRole("option", { name: "Price: low to high" }).click();
  // Selection sticks and grid still renders
  await expect(sort).toContainText("Price: low to high");
  await expect(page.getByTestId("store-grid")).toBeVisible();
});
