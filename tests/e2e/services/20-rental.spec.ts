/**
 * Feature 20: try-before-you-buy planner. Shopper sets item price and
 * trial length, sees rental fee and refundable deposit.
 */
import { test, expect } from "@playwright/test";

test("one week on an $800 item", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-rental").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("rental-result")).toContainText("$40.00");
  await expect(page.getByTestId("rental-result")).toContainText("$240.00 refundable");
});

test("two weeks doubles the rental, not the deposit", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-rental").scrollIntoViewIfNeeded();
  const days = page.getByTestId("rental-days");
  const box = await days.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await days.click({ position: { x: box.width * 0.4, y: box.height / 2 } });
  await expect(page.getByTestId("rental-days-label")).toContainText("14 days");
  await expect(page.getByTestId("rental-result")).toContainText("$80.00");
  await expect(page.getByTestId("rental-result")).toContainText("$240.00 refundable");
});
