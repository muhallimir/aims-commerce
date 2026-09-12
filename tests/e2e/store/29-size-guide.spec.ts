/**
 * Feature 29/50: size guide on apparel product pages.
 */
import { test, expect } from "@playwright/test";

test("apparel product opens the measurement table", async ({ page, request }) => {
  const res = await request.get("/api/products");
  const products = await res.json();
  const apparel = products.find((p: any) => /shirt|pant|dress|jacket|shoe|cloth|fashion/i.test(p.category ?? ""));
  expect(apparel, "needs an apparel product").toBeDefined();
  const id = apparel._id ?? apparel.id;
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  const open = page.getByTestId("size-guide-open");
  await expect(open).toBeVisible({ timeout: 15000 });
  await open.scrollIntoViewIfNeeded();
  await open.click();
  await expect(page.getByTestId("size-guide-dialog")).toBeVisible();
  await expect(page.getByTestId("size-guide-dialog")).toContainText("Chest");
});
