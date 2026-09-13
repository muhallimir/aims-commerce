/**
 * Feature 2: delivery estimator. Shopper picks a destination and parcel
 * weight, gets real rates and arrival dates for all service levels.
 */
import { test, expect } from "@playwright/test";

test("estimator quotes all three service levels", async ({ page }) => {
  await page.goto("/services/delivery", { waitUntil: "networkidle" });
  await page.getByTestId("service-estimator").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("delivery-estimator")).toBeVisible();
  for (const level of ["standard", "expedited", "overnight"]) {
    const row = page.getByTestId(`estimator-row-${level}`);
    await expect(row).toBeVisible();
    await expect(row).toContainText("$");
  }
});

test("changing destination re-quotes the rates", async ({ page }) => {
  await page.goto("/services/delivery", { waitUntil: "networkidle" });
  await page.getByTestId("service-estimator").scrollIntoViewIfNeeded();
  const row = page.getByTestId("estimator-row-standard");
  const before = await row.textContent();
  await page.getByTestId("estimator-country").click();
  await page.getByRole("option", { name: "United Kingdom" }).click();
  await expect(row).not.toHaveText(before ?? "");
  await expect(row).toContainText("$");
});
