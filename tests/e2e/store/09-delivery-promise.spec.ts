/**
 * Feature 9/50: delivery promise line on the product page.
 */
import { test, expect } from "@playwright/test";

test("in-stock product shows the delivery promise", async ({ page, request }) => {
  const res = await request.get("/api/products");
  const products = await res.json();
  const stocked = products.find((p: any) => Number(p.count_in_stock ?? p.countInStock) > 0);
  expect(stocked, "needs at least one in-stock product").toBeDefined();
  const id = stocked._id ?? stocked.id;
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  const promise = page.getByTestId("delivery-promise");
  await expect(promise).toBeVisible({ timeout: 15000 });
  await expect(promise).toContainText(/order within/i);
  await expect(promise).toContainText(/get it by/i);
});
