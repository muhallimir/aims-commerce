/**
 * Feature 6: shipping insurance calculator. Shopper sets declared value
 * and handling options, gets an instant protection quote.
 */
import { test, expect } from "@playwright/test";

test("insurance quotes the base fee", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-insurance").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("insurance-result")).toContainText(/\$3\.00/);
  await expect(page.getByTestId("insurance-result")).toContainText(/up to \$250/);
});

test("fragile and international options raise the fee", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-insurance").scrollIntoViewIfNeeded();
  await page.getByTestId("insurance-fragile").check();
  await page.getByTestId("insurance-intl").check();
  await expect(page.getByTestId("insurance-result")).toContainText(/\$8\.00/);
});
