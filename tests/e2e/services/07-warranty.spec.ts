/**
 * Feature 7: extended warranty planner. Shopper sets item price and
 * cover length, sees premium and cover list.
 */
import { test, expect } from "@playwright/test";

test("warranty prices two years on a $500 item", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-warranty").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("warranty-result")).toContainText("$70.00");
  await expect(page.getByTestId("warranty-cover")).toContainText(/battery/i);
});

test("one year drops battery cover and lowers the premium", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-warranty").scrollIntoViewIfNeeded();
  await page.getByTestId("warranty-years").click();
  await page.getByRole("option", { name: "1 extra year" }).click();
  await expect(page.getByTestId("warranty-result")).toContainText("$40.00");
  await expect(page.getByTestId("warranty-cover")).not.toContainText(/battery/i);
});
