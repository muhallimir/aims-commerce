/**
 * Feature 28/50: top-rated spotlight on the storefront.
 */
import { test, expect } from "@playwright/test";

test("spotlight names the crowd favorite and opens it", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const spot = page.getByTestId("top-rated-spotlight");
  await expect(spot).toBeVisible({ timeout: 15000 });
  const name = await page.getByTestId("top-rated-name").textContent();
  expect(name?.trim().length).toBeGreaterThan(0);
  await page.getByTestId("top-rated-open").click();
  await expect(page).toHaveURL(/\/store\/product\//, { timeout: 15000 });
});
