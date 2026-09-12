/**
 * Feature 13/50: free-shipping progress bar in the cart.
 */
import { test, expect } from "@playwright/test";

async function seedCart(page: any, items: any[]) {
  await page.addInitScript((seed: any) => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        cart: JSON.stringify({
          cartItems: seed,
          shippingAddress: [],
          paymentMethod: null,
          isCheckingOut: false,
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  }, items);
}

test("cart under $50 shows the remaining gap", async ({ page }) => {
  await seedCart(page, [{ _id: "p1", name: "Cap", price: 20, quantity: 1, image: "", countInStock: 5 }]);
  await page.goto("/store/cart", { waitUntil: "networkidle" });
  const bar = page.getByTestId("free-shipping-bar");
  await expect(bar).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("free-shipping-text")).toContainText("$30.00 away");
});

test("cart over $50 unlocks free shipping", async ({ page }) => {
  await seedCart(page, [{ _id: "p1", name: "Boot", price: 80, quantity: 1, image: "", countInStock: 5 }]);
  await page.goto("/store/cart", { waitUntil: "networkidle" });
  await expect(page.getByTestId("free-shipping-bar")).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("free-shipping-text")).toContainText(/unlocked/i);
});
