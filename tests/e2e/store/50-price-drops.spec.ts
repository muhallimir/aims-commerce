/**
 * Feature 50/50: wishlist price-drop badges against live prices.
 */
import { test, expect } from "@playwright/test";

test("saved-above-live item wears the drop badge", async ({ page, request }) => {
  const res = await request.get("/api/products");
  const products = await res.json();
  const p = products[0];
  const id = p._id ?? p.id;
  const live = Number(p.price);
  await page.addInitScript(
    ({ pid, name, price }: any) => {
      localStorage.setItem(
        "aims-wishlist",
        JSON.stringify([{ _id: pid, name, price, image: "" }])
      );
    },
    { pid: id, name: p.name ?? p.title, price: live + 25 }
  );
  await page.goto("/wishlist", { waitUntil: "networkidle" });
  const badge = page.getByTestId(`price-drop-${id}`);
  await expect(badge).toBeVisible({ timeout: 15000 });
  await expect(badge).toContainText("Dropped $25.00");
});
