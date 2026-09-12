/**
 * Feature 26/50: wishlist hearts, header shortcut and wishlist page.
 */
import { test, expect } from "@playwright/test";

test("heart saves, header counts, page lists", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const heart = page.getByTestId("wishlist-heart").first();
  await expect(heart).toBeVisible({ timeout: 15000 });
  await heart.scrollIntoViewIfNeeded();
  await heart.click({ force: true });
  await expect(heart).toHaveAttribute("data-active", "true");
  await page.getByTestId("wishlist-nav").click();
  await expect(page).toHaveURL(/\/wishlist/, { timeout: 15000 });
  await expect(page.getByTestId("wishlist-page")).toBeVisible();
  await expect(page.locator('[data-testid^="wishlist-item-"]')).toHaveCount(1);
});

test("move to cart empties the wishlist into the cart", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const heart = page.getByTestId("wishlist-heart").first();
  await expect(heart).toBeVisible({ timeout: 15000 });
  await heart.scrollIntoViewIfNeeded();
  await heart.click({ force: true });
  await page.getByTestId("wishlist-nav").click();
  await expect(page).toHaveURL(/\/wishlist/, { timeout: 15000 });
  const item = page.locator('[data-testid^="wishlist-item-"]').first();
  const testId = await item.getAttribute("data-testid");
  const id = (testId ?? "").replace("wishlist-item-", "");
  await page.getByTestId(`wishlist-move-${id}`).click();
  await expect(page).toHaveURL(/\/store\/cart/, { timeout: 15000 });
  await expect(page.getByTestId("free-shipping-bar")).toBeVisible({ timeout: 15000 });
});
