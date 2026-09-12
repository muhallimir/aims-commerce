/**
 * Feature 10/50: back-in-stock notifier on sold-out products.
 */
import { test, expect } from "@playwright/test";

test("sold-out product takes an email alert", async ({ page, request }) => {
  const res = await request.get("/api/products");
  const products = await res.json();
  const oos = products.find((p: any) => Number(p.count_in_stock ?? p.countInStock) === 0);
  expect(oos, "needs a sold-out product").toBeDefined();
  const id = oos._id ?? oos.id;
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  const box = page.getByTestId("stock-notifier");
  await expect(box).toBeVisible({ timeout: 15000 });
  await box.scrollIntoViewIfNeeded();
  await page.getByTestId("stock-notifier-email").fill("sam@example.com");
  await page.getByTestId("stock-notifier-submit").click();
  await expect(page.getByTestId("stock-notifier-done")).toContainText(/back/i);
});
