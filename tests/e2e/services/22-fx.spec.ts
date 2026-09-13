/**
 * Feature 22: currency converter. Shopper converts an amount between
 * store currencies and swaps the pair.
 */
import { test, expect } from "@playwright/test";

test("converter turns $100 into euros", async ({ page }) => {
  await page.goto("/services/shopping", { waitUntil: "networkidle" });
  await page.getByTestId("service-fx").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("fx-result")).toContainText("$100.00 = €92.59");
});

test("swapping flips the pair", async ({ page }) => {
  await page.goto("/services/shopping", { waitUntil: "networkidle" });
  await page.getByTestId("service-fx").scrollIntoViewIfNeeded();
  await page.getByTestId("fx-swap").click();
  await expect(page.getByTestId("fx-result")).toContainText("€100.00 = $108.00");
});
