/**
 * Feature 18/50: address book on the profile page.
 */
import { test, expect } from "@playwright/test";

test("saving an address persists it, reuse jumps to shipping", async ({ page }) => {
  await page.goto("/profile", { waitUntil: "networkidle" });
  await page.getByTestId("address-book").scrollIntoViewIfNeeded();
  await page.getByTestId("address-add").click();
  await expect(page.getByTestId("address-error")).toBeVisible();
  await page.getByTestId("address-field-label").fill("Home");
  await page.getByTestId("address-field-fullName").fill("Sam");
  await page.getByTestId("address-field-address").fill("1 Main St");
  await page.getByTestId("address-field-city").fill("NYC");
  await page.getByTestId("address-add").click();
  await expect(page.getByText("1 Main St")).toBeVisible();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("address-book").scrollIntoViewIfNeeded();
  await expect(page.getByText("1 Main St")).toBeVisible();
  const useBtn = page.locator('[data-testid^="address-use-"]').first();
  await useBtn.click();
  await expect(page).toHaveURL(/\/store\/shipping/, { timeout: 15000 });
});
