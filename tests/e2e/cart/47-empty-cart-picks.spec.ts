/**
 * Feature 47/50: top picks rescue the empty cart.
 */
import { test, expect } from "@playwright/test";

test("empty cart shows picks, add fills the cart", async ({ page }) => {
  await page.goto("/store/cart", { waitUntil: "networkidle" });
  await expect(page.getByText("Your cart is empty.")).toBeVisible({ timeout: 15000 });
  const picks = page.getByTestId("empty-cart-picks");
  await expect(picks).toBeVisible({ timeout: 15000 });
  const add = page.locator('[data-testid^="top-pick-add-"]').first();
  await add.scrollIntoViewIfNeeded();
  await add.click();
  await expect(page.getByText("Your cart is empty.")).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByTestId("free-shipping-bar")).toBeVisible({ timeout: 15000 });
});
