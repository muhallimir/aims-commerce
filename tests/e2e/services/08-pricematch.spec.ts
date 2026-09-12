/**
 * Feature 8: price-match desk. Shopper enters our price, competitor
 * and their price; gets an instant match verdict.
 */
import { test, expect } from "@playwright/test";

test("price match approves a lower eligible price", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-pricematch").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("pricematch-result")).toContainText(/approved/i);
  await expect(page.getByTestId("pricematch-result")).toContainText("$90.00");
});

test("price match rejects an outside retailer", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-pricematch").scrollIntoViewIfNeeded();
  await page.getByTestId("pricematch-store").fill("random-shop");
  await expect(page.getByTestId("pricematch-result")).toContainText(/outside our matched retailers/i);
});
