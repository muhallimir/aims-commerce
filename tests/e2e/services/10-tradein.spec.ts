/**
 * Feature 10: trade-in estimator. Shopper describes the old device,
 * gets a store-credit number.
 */
import { test, expect } from "@playwright/test";

test("trade-in credits a one-year-old phone in good shape", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-tradein").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("tradein-result")).toContainText("$119.00");
  await expect(page.getByTestId("tradein-result")).toContainText(/store credit/i);
});

test("a battered old device falls below the minimum", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-tradein").scrollIntoViewIfNeeded();
  await page.getByTestId("tradein-condition").click();
  await page.getByRole("option", { name: "poor" }).click();
  const slider = page.getByTestId("tradein-age");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.95, y: box.height / 2 } });
  await expect(page.getByTestId("tradein-result")).toContainText(/recycle it free/i);
});
