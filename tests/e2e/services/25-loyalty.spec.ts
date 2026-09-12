/**
 * Feature 25: loyalty preview. Shopper slides yearly spend, sees tier,
 * points and distance to the next tier.
 */
import { test, expect } from "@playwright/test";

test("silver tier on $250 yearly spend", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-loyalty").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("loyalty-tier-name")).toContainText("silver");
  await expect(page.getByTestId("loyalty-result")).toContainText("250 points");
  await expect(page.getByTestId("loyalty-result")).toContainText(/\$750 to gold/i);
});

test("big spend reaches platinum", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-loyalty").scrollIntoViewIfNeeded();
  const slider = page.getByTestId("loyalty-spend");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.95, y: box.height / 2 } });
  await expect(page.getByTestId("loyalty-tier-name")).toContainText("platinum");
});
