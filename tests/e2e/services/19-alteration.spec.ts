/**
 * Feature 19: tailoring counter. Shopper ticks fixes, sees price
 * and turnaround update live.
 */
import { test, expect } from "@playwright/test";

test("hemming alone prices and dates correctly", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-alteration").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("alteration-result")).toContainText("$12.00");
  await expect(page.getByTestId("alteration-result")).toContainText("3 days");
});

test("adding a taper stacks price and days", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-alteration").scrollIntoViewIfNeeded();
  await page.getByTestId("alteration-taper").check();
  await expect(page.getByTestId("alteration-result")).toContainText("$30.00");
  await expect(page.getByTestId("alteration-result")).toContainText("4 days");
});
