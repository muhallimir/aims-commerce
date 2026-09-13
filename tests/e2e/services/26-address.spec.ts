/**
 * Feature 26: address checker. Shopper validates the courier-facing
 * address format and catches postcode mistakes early.
 */
import { test, expect } from "@playwright/test";

test("valid US address passes", async ({ page }) => {
  await page.goto("/services/help", { waitUntil: "networkidle" });
  await page.getByTestId("service-address").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("address-result")).toContainText(/looks deliverable/i);
  await expect(page.getByTestId("address-result")).toContainText("1 Main St");
});

test("wrong postcode format for the country fails", async ({ page }) => {
  await page.goto("/services/help", { waitUntil: "networkidle" });
  await page.getByTestId("service-address").scrollIntoViewIfNeeded();
  await page.getByTestId("address-postal").fill("ABC");
  await page.getByTestId("address-country").click();
  await page.getByRole("option", { name: "GB" }).click();
  await expect(page.getByTestId("address-result")).toContainText(/does not match format for GB/i);
});
