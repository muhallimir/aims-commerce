/**
 * Feature 4/50: quick-view modal on product cards.
 */
import { test, expect } from "@playwright/test";

test("quick view opens with price and adds to cart", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const open = page.getByTestId("quick-view-open").first();
  await expect(open).toBeVisible({ timeout: 15000 });
  await open.scrollIntoViewIfNeeded();
  await open.click();
  await expect(page.getByTestId("quick-view-dialog")).toBeVisible();
  await expect(page.getByTestId("quick-view-price")).toContainText("$");
  await page.getByTestId("quick-view-add").click();
  await expect(page.getByTestId("quick-view-added")).toBeVisible();
});

test("quick view full details navigates to the product page", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const open = page.getByTestId("quick-view-open").first();
  await expect(open).toBeVisible({ timeout: 15000 });
  await open.scrollIntoViewIfNeeded();
  await open.click();
  await page.getByTestId("quick-view-details").click();
  await expect(page).toHaveURL(/\/store\/product\//, { timeout: 15000 });
});
