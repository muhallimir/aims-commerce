/**
 * Feature 3: returns pickup. Shopper enters an order number, adjusts
 * courier distance and bulkiness, gets a quote and books the pickup.
 */
import { test, expect } from "@playwright/test";

test("returns widget quotes the pickup", async ({ page }) => {
  await page.goto("/services/returns", { waitUntil: "networkidle" });
  await page.getByTestId("service-returns").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("returns-pickup")).toBeVisible();
  await expect(page.getByTestId("returns-quote")).toContainText(/pickup/i);
  // Bulky long-distance pickup is never free
  await page.getByTestId("returns-bulky").check();
  await expect(page.getByTestId("returns-quote")).toContainText(/\$|fee/i);
});

test("returns pickup schedules with a booking reference", async ({ page }) => {
  await page.goto("/services/returns", { waitUntil: "networkidle" });
  await page.getByTestId("service-returns").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("returns-schedule")).toBeDisabled();
  await page.getByTestId("returns-order-ref-input").fill("64f2abcd");
  await expect(page.getByTestId("returns-schedule")).toBeEnabled();
  await page.getByTestId("returns-schedule").click();
  await expect(page.getByTestId("returns-confirmation")).toContainText(/RP-/);
});
