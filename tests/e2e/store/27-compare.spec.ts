/**
 * Feature 27/50: compare tray with side-by-side table.
 */
import { test, expect } from "@playwright/test";

test("ticking two products opens the comparison", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  await expect(page.getByTestId("cookie-consent")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("cookie-accept").click();
  await expect(page.getByTestId("cookie-consent")).toHaveCount(0);
  const checks = page.getByTestId("compare-check");
  await expect(checks.first()).toBeVisible({ timeout: 15000 });
  await checks.nth(0).scrollIntoViewIfNeeded();
  await checks.nth(0).check({ force: true });
  await checks.nth(1).check({ force: true });
  await expect(page.getByTestId("compare-count")).toContainText("2 to compare");
  await page.getByTestId("compare-open").click();
  await expect(page.getByTestId("compare-dialog")).toBeVisible();
  const heads = page.locator('[data-testid^="compare-head-"]');
  await expect(heads).toHaveCount(2);
});
