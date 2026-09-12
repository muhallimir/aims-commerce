/**
 * Feature 18: white-glove delivery picker. Shopper describes the
 * stairs and rooms, gets the tier and fee.
 */
import { test, expect } from "@playwright/test";

test("ground-floor small order stays standard", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-whiteglove").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("whiteglove-tier")).toContainText("standard");
  await expect(page.getByTestId("whiteglove-result")).toContainText("$49.00");
});

test("bulky top-floor job upgrades to premium", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-whiteglove").scrollIntoViewIfNeeded();
  await page.getByTestId("whiteglove-bulky").check();
  const floor = page.getByTestId("whiteglove-floor");
  const box = await floor.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await floor.click({ position: { x: box.width * 0.85, y: box.height / 2 } });
  const rooms = page.getByTestId("whiteglove-rooms");
  const rbox = await rooms.boundingBox();
  if (!rbox) throw new Error("rooms slider has no bounding box");
  await rooms.click({ position: { x: rbox.width * 0.5, y: rbox.height / 2 } });
  await expect(page.getByTestId("whiteglove-tier")).toContainText("premium");
});
