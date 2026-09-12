/**
 * Feature 15: carbon offset calculator. Shopper sees the delivery
 * footprint and the offset price per transport mode.
 */
import { test, expect } from "@playwright/test";

test("van delivery shows a small footprint", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-carbon").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("carbon-result")).toContainText("0.006 kg CO2");
});

test("air freight multiplies the footprint", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-carbon").scrollIntoViewIfNeeded();
  await page.getByTestId("carbon-mode").click();
  await page.getByRole("option", { name: "Air freight" }).click();
  await expect(page.getByTestId("carbon-result")).toContainText("0.028 kg CO2");
});
