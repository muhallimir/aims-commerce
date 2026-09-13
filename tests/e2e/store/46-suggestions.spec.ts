/**
 * Feature 46/50: live search suggestions from the catalog.
 */
import { test, expect } from "@playwright/test";

test("typing shows suggestions, tapping filters the grid", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  await expect(page.getByTestId("store-grid")).toBeVisible({ timeout: 15000 });
  const box = page.getByPlaceholder("Search products...");
  await box.fill("asus");
  const strip = page.getByTestId("search-suggestions");
  await expect(strip).toBeVisible({ timeout: 10000 });
  const first = strip.getByTestId(/^suggest-/).first();
  const name = await first.textContent();
  await first.click();
  await expect(page).toHaveURL(/search=/, { timeout: 10000 });
  expect(name?.toLowerCase()).toContain("asus");
});
