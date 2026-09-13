/**
 * Feature 9: repair desk. Shopper picks a device and its age,
 * gets a price band and a repair/replace steer.
 */
import { test, expect } from "@playwright/test";

test("repair desk prices a young phone", async ({ page }) => {
  await page.goto("/services/protection", { waitUntil: "networkidle" });
  await page.getByTestId("service-repair").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("repair-result")).toContainText("$39");
  await expect(page.getByTestId("repair-result")).toContainText(/worth repairing/i);
});

test("repair desk steers an ancient device to trade-in", async ({ page }) => {
  await page.goto("/services/protection", { waitUntil: "networkidle" });
  await page.getByTestId("service-repair").scrollIntoViewIfNeeded();
  await page.getByTestId("repair-category").click();
  await page.getByRole("option", { name: "laptop" }).click();
  const slider = page.getByTestId("repair-age");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.9, y: box.height / 2 } });
  await expect(page.getByTestId("repair-age-label")).toContainText("11 yrs");
  await expect(page.getByTestId("repair-result")).toContainText(/beyond economical repair/i);
});
