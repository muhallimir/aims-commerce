/**
 * Feature 14: eco packaging picker. Shopper sets order size and
 * fragility, gets the greenest viable packaging.
 */
import { test, expect } from "@playwright/test";

test("small sturdy order gets compostable packaging", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-eco").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("eco-option")).toContainText("compostable");
});

test("big haul upgrades to the reusable tote", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-eco").scrollIntoViewIfNeeded();
  const slider = page.getByTestId("eco-items");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.9, y: box.height / 2 } });
  await expect(page.getByTestId("eco-option")).toContainText("reusable");
  await expect(page.getByTestId("eco-result")).toContainText(/takes back/i);
});
