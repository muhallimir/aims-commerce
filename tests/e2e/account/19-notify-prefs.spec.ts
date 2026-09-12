/**
 * Feature 19/50: notification preferences on the profile page.
 */
import { test, expect } from "@playwright/test";

test("toggling price drops persists across reload", async ({ page }) => {
  await page.goto("/profile", { waitUntil: "networkidle" });
  await page.getByTestId("notify-prefs").scrollIntoViewIfNeeded();
  const toggle = page.getByTestId("notify-priceDrops");
  await expect(toggle).not.toBeChecked();
  await toggle.check();
  await expect(toggle).toBeChecked();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("notify-prefs").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("notify-priceDrops")).toBeChecked();
  await expect(page.getByTestId("notify-orderUpdates")).toBeChecked();
});
