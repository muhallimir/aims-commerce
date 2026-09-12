/**
 * Feature 11: gift wrap picker. Shopper sets items, paper grade and a
 * message; sees the wrap total including the long-message fee.
 */
import { test, expect } from "@playwright/test";

test("gift wrap totals two standard items", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-giftwrap").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("giftwrap-result")).toContainText("$5.98");
});

test("long message adds the ink fee", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-giftwrap").scrollIntoViewIfNeeded();
  await page.getByTestId("giftwrap-premium").check();
  await page.getByTestId("giftwrap-message").fill("x".repeat(150));
  await expect(page.getByTestId("giftwrap-result")).toContainText("$11.97");
  await expect(page.getByTestId("giftwrap-result")).toContainText(/long-message fee/i);
});
