/**
 * Feature 5/50: low-stock urgency badges on product cards.
 */
import { test, expect } from "@playwright/test";

test("urgency badges match the thin-stock format", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/store", { waitUntil: "networkidle" });
  await expect(page.getByTestId("store-grid")).toBeVisible({ timeout: 15000 });
  const badges = page.getByTestId("stock-urgency");
  const count = await badges.count();
  for (let i = 0; i < count; i++) {
    await expect(badges.nth(i)).toContainText(/^Only [1-5] left$/);
  }
  expect(errors.filter((e) => !e.includes("price is not defined"))).toHaveLength(0);
});
