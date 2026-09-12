/**
 * Feature 24/50: cookie consent banner.
 */
import { test, expect } from "@playwright/test";

test("consent asks, accepts and stays away", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const banner = page.getByTestId("cookie-consent");
  await expect(banner).toBeVisible({ timeout: 15000 });
  await page.getByTestId("cookie-accept").click();
  await expect(banner).toHaveCount(0);
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByTestId("cookie-consent")).toHaveCount(0);
});
