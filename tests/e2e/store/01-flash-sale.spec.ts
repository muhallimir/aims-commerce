/**
 * Feature 1/50: flash sale countdown on the storefront.
 */
import { test, expect } from "@playwright/test";

test("flash sale banner counts down on the store", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const bar = page.getByTestId("flash-sale-bar");
  await expect(bar).toBeVisible();
  await expect(page.getByTestId("flash-sale-timer")).toContainText(/\d{2}h \d{2}m \d{2}s/);
});

test("sale CTA scrolls the grid into view", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  await page.getByTestId("flash-sale-cta").click();
  await expect(page.getByTestId("store-grid")).toBeInViewport();
});
