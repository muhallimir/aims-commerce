/**
 * Feature 12: engraving studio. Shopper previews the text on the
 * material and sees the fee before committing.
 */
import { test, expect } from "@playwright/test";

test("engraving previews text and prices metal setup", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-engraving").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("engraving-preview")).toContainText("A. Muhalli");
  await expect(page.getByTestId("engraving-result")).toContainText("$5.00");
});

test("overlong text is refused, not priced", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-engraving").scrollIntoViewIfNeeded();
  await page.getByTestId("engraving-text").fill("y".repeat(55));
  await expect(page.getByTestId("engraving-result")).toContainText(/50-character limit/i);
});
