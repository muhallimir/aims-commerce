/**
 * Feature 11/50: frequently-bought-together strip on product pages.
 */
import { test, expect } from "@playwright/test";

test("pair strip totals and adds both to cart", async ({ page, request }) => {
  const res = await request.get("/api/products");
  const products = await res.json();
  // A category with at least two products so a pair exists
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
  const cat = Object.keys(counts).find((c) => counts[c] >= 2);
  expect(cat, "needs a category with 2+ products").toBeDefined();
  const current = products.find((p: any) => p.category === cat && Number(p.count_in_stock ?? p.countInStock) > 0);
  const id = current._id ?? current.id;
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  const strip = page.getByTestId("bought-together");
  await expect(strip).toBeVisible({ timeout: 15000 });
  await strip.scrollIntoViewIfNeeded();
  await expect(page.getByTestId("bought-together-total")).toContainText("$");
  await page.getByTestId("bought-together-add").click();
  await expect(page.getByTestId("bought-together-added")).toBeVisible();
});
