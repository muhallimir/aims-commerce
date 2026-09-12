/**
 * Feature 4: coverage checker. Shopper types a postcode and learns
 * whether we deliver, how fast, and at what fee.
 */
import { test, expect } from "@playwright/test";

test("coverage checker serves a metro postcode free", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-coverage").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("coverage-check")).toBeDisabled();
  await page.getByTestId("coverage-postcode").fill("10001");
  await page.getByTestId("coverage-check").click();
  await expect(page.getByTestId("coverage-result")).toContainText(/free 2-day/i);
});

test("coverage checker turns away an unserved postcode", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-coverage").scrollIntoViewIfNeeded();
  await page.getByTestId("coverage-postcode").fill("99999");
  await page.getByTestId("coverage-check").click();
  await expect(page.getByTestId("coverage-result")).toContainText(/don't deliver/i);
});
