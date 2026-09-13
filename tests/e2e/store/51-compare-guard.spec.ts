/**
 * Compare stays inside one category; crossing it raises the guard.
 */
import { test, expect } from "@playwright/test";

async function dismissCookies(page: any) {
  await expect(page.getByTestId("cookie-consent")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("cookie-accept").click();
  await expect(page.getByTestId("cookie-consent")).toHaveCount(0);
}

async function tickFirstInCategory(page: any, category: string) {
  await page.getByTestId(`category-chip-${category}`).click();
  const check = page.getByTestId("compare-check").first();
  await expect(check).toBeVisible({ timeout: 10000 });
  await check.scrollIntoViewIfNeeded();
  await check.click();
}

test("cross-category pick raises the guard modal", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  await dismissCookies(page);
  await expect(page.getByTestId("category-chip-Electronics")).toBeVisible({ timeout: 15000 });
  await tickFirstInCategory(page, "Electronics");
  await tickFirstInCategory(page, "Shirts");
  await expect(page.getByTestId("compare-guard")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("compare-guard-text")).toContainText(/within a category/i);
});

test("switching replaces the tray, keeping preserves it", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  await dismissCookies(page);
  await expect(page.getByTestId("category-chip-Electronics")).toBeVisible({ timeout: 15000 });
  await tickFirstInCategory(page, "Electronics");
  await expect(page.getByTestId("compare-count")).toContainText("1 to compare");
  await tickFirstInCategory(page, "Shirts");
  await expect(page.getByTestId("compare-guard")).toBeVisible({ timeout: 10000 });
  await page.getByTestId("compare-guard-switch").click();
  await expect(page.getByTestId("compare-guard")).toHaveCount(0);
  await expect(page.getByTestId("compare-count")).toContainText("1 to compare");
});
