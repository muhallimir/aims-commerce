/**
 * Feature 13: subscription planner. Shopper sets quantity and rhythm,
 * sees per-delivery price and yearly savings.
 */
import { test, expect } from "@playwright/test";

test("subscription shows savings for the default plan", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-subscription").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("subscription-result")).toContainText("$36.00");
  await expect(page.getByTestId("subscription-result")).toContainText(/save \$52\.00 a year/i);
});

test("weekly rhythm drops the discount to 5 percent", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-subscription").scrollIntoViewIfNeeded();
  await page.getByTestId("subscription-weeks").click();
  await page.getByRole("option", { name: "1 week" }).click();
  await expect(page.getByTestId("subscription-result")).toContainText("$38.00");
});
