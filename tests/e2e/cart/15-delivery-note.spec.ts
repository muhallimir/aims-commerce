/**
 * Feature 15/50: delivery instructions on the shipping step.
 */
import { test, expect } from "@playwright/test";

test("courier note saves and previews", async ({ page }) => {
  await page.goto("/store/shipping", { waitUntil: "networkidle" });
  const box = page.getByTestId("delivery-instructions");
  await expect(box).toBeVisible({ timeout: 15000 });
  await box.scrollIntoViewIfNeeded();
  await page.getByTestId("delivery-note-input").fill("Leave with concierge");
  await expect(page.getByTestId("delivery-note-preview")).toContainText(/concierge/i);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("delivery-instructions").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("delivery-note-input")).toHaveValue("Leave with concierge");
});
