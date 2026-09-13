/**
 * Feature 23: bundle saver. Shopper slides quantity, watches the tier
 * discount and the nudge to the next saving.
 */
import { test, expect } from "@playwright/test";

test("three units unlock the first tier", async ({ page }) => {
  await page.goto("/services/shopping", { waitUntil: "networkidle" });
  await page.getByTestId("service-bundle").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("bundle-result")).toContainText("$27.00");
  await expect(page.getByTestId("bundle-result")).toContainText("save $3.00");
  await expect(page.getByTestId("bundle-next")).toContainText("Add 2 more");
});

test("five units max out the tiers", async ({ page }) => {
  await page.goto("/services/shopping", { waitUntil: "networkidle" });
  await page.getByTestId("service-bundle").scrollIntoViewIfNeeded();
  const slider = page.getByTestId("bundle-qty");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.6, y: box.height / 2 } });
  await expect(page.getByTestId("bundle-qty-label")).toContainText("5");
  await expect(page.getByTestId("bundle-result")).toContainText("$40.00");
  await expect(page.getByTestId("bundle-next")).toHaveCount(0);
});
