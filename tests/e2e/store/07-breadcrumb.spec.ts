/**
 * Feature 7/50: breadcrumb trail on the product page.
 */
import { test, expect } from "@playwright/test";

test("product page shows Store / Category / Name trail", async ({ page, request }) => {
  const res = await request.get("/api/products");
  expect(res.status()).toBe(200);
  const products = await res.json();
  expect(products.length).toBeGreaterThan(0);
  const id = products[0]._id ?? products[0].id;
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  const trail = page.getByTestId("breadcrumb-trail");
  await expect(trail).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("breadcrumb-0")).toHaveAttribute("href", "/store");
  await expect(trail).toContainText(products[0].name ?? products[0].title);
});
