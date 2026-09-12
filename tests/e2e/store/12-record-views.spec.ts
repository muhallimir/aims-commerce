/**
 * Feature 12/50: product views feed the browsing trail.
 */
import { test, expect } from "@playwright/test";

test("visiting a product records the view on-device", async ({ page, request }) => {
  const res = await request.get("/api/products");
  const products = await res.json();
  const id = products[0]._id ?? products[0].id;
  await page.goto("/store", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/store/product/${id}`, { waitUntil: "networkidle" });
  await expect(page.getByTestId("breadcrumb-trail")).toBeVisible({ timeout: 15000 });
  await page.waitForFunction(
    (pid) => {
      const raw = localStorage.getItem("aims-recent");
      if (!raw) return false;
      try {
        return (JSON.parse(raw).views ?? []).some((v: any) => v.productId === pid);
      } catch {
        return false;
      }
    },
    id,
    { timeout: 15000 }
  );
  const trail = await page.evaluate(() => localStorage.getItem("aims-recent"));
  expect(trail).not.toBeNull();
  expect(JSON.parse(trail ?? "{}").views.map((v: any) => v.productId)).toContain(id);
});
