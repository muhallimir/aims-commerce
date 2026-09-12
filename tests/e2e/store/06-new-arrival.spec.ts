/**
 * Feature 6/50: new-arrival badges driven by listing age.
 */
import { test, expect } from "@playwright/test";

test("new badges only ever read New", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/store", { waitUntil: "networkidle" });
  await expect(page.getByTestId("store-grid")).toBeVisible({ timeout: 15000 });
  const badges = page.getByTestId("new-arrival");
  const count = await badges.count();
  for (let i = 0; i < count; i++) {
    await expect(badges.nth(i)).toHaveText("New");
  }
  expect(errors).toHaveLength(0);
});
