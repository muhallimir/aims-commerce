/**
 * Feature 8/50: product share button with copy confirmation.
 */
import { test, expect } from "@playwright/test";

test("share button copies the product link", async ({ page, request, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const res = await request.get("/api/products");
  const products = await res.json();
  const id = products[0]._id ?? products[0].id;
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  const share = page.getByTestId("share-button");
  await expect(share).toBeVisible({ timeout: 15000 });
  await share.scrollIntoViewIfNeeded();
  await share.click();
  await expect(page.getByTestId("share-confirm")).toBeVisible({ timeout: 10000 });
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain(`/store/product/${id}`);
});
