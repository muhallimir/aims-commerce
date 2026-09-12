/**
 * Feature 21: bulk desk. Buyer slides quantity, watches tiers
 * unlock and the total drop.
 */
import { test, expect } from "@playwright/test";

test("25 units unlocks the 10 percent tier", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-bulk").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("bulk-result")).toContainText("10% off");
  await expect(page.getByTestId("bulk-result")).toContainText("$225.00");
});

test("dropping below 10 units loses the discount", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-bulk").scrollIntoViewIfNeeded();
  const slider = page.getByTestId("bulk-qty");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.03, y: box.height / 2 } });
  await expect(page.getByTestId("bulk-result")).toContainText(/no discount yet/i);
});
