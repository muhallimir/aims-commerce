/**
 * Feature 16: assembly booking. Shopper picks furniture and quantity,
 * sees the fixed fee, books a visit day.
 */
import { test, expect } from "@playwright/test";

function nextWeekISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

test("assembly quotes a wardrobe visit", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-assembly").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("assembly-result")).toContainText("~90 min");
  await expect(page.getByTestId("assembly-result")).toContainText("$45.00");
  await expect(page.getByTestId("assembly-book")).toBeDisabled();
});

test("assembly books the chosen day", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-assembly").scrollIntoViewIfNeeded();
  await page.getByTestId("assembly-item").click();
  await page.getByRole("option", { name: "chair" }).click();
  await expect(page.getByTestId("assembly-result")).toContainText("$15.00");
  await page.getByTestId("assembly-date").fill(nextWeekISO());
  await page.getByTestId("assembly-book").click();
  await expect(page.getByTestId("assembly-confirmation")).toContainText(/AS-/);
});
