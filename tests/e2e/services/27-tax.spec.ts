/**
 * Feature 27: tax estimator. Shopper sets order value and destination,
 * sees the exact rate and landed total.
 */
import { test, expect } from "@playwright/test";

test("california sales tax on $100", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-tax").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("tax-rule")).toContainText("California");
  await expect(page.getByTestId("tax-result")).toContainText("$7.25");
  await expect(page.getByTestId("tax-result")).toContainText("$107.25");
});

test("german VAT replaces the state rate", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-tax").scrollIntoViewIfNeeded();
  await page.getByTestId("tax-country").click();
  await page.getByRole("option", { name: "DE" }).click();
  await expect(page.getByTestId("tax-rule")).toContainText("VAT");
  await expect(page.getByTestId("tax-result")).toContainText("$21.00");
});
