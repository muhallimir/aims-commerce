/**
 * Feature 5: delivery slot booking. Shopper picks a day and a time
 * window and gets a confirmed booking reference.
 */
import { test, expect } from "@playwright/test";

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

test("slot booking needs a date before confirming", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-slots").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("slot-book")).toBeDisabled();
  await page.getByTestId("slot-date").fill(tomorrowISO());
  await expect(page.getByTestId("slot-book")).toBeEnabled();
});

test("slot booking confirms the chosen window", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-slots").scrollIntoViewIfNeeded();
  await page.getByTestId("slot-date").fill(tomorrowISO());
  await page.getByTestId("slot-option-12").check();
  await page.getByTestId("slot-book").click();
  const result = page.getByTestId("slot-result");
  await expect(result).toContainText(/DL-/);
  await expect(result).toContainText(/12:00/);
});
