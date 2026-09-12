/**
 * Feature 14/50: gift options panel in the cart.
 */
import { test, expect } from "@playwright/test";

async function seedCart(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        cart: JSON.stringify({
          cartItems: [{ _id: "p1", name: "Cap", price: 20, quantity: 1, image: "", countInStock: 5 }],
          shippingAddress: [],
          paymentMethod: null,
          isCheckingOut: false,
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
}

test("gift wrap toggle reveals message and survives reload", async ({ page }) => {
  await seedCart(page);
  await page.goto("/store/cart", { waitUntil: "networkidle" });
  await page.getByTestId("gift-options").scrollIntoViewIfNeeded();
  await page.getByTestId("gift-wrap-toggle").check();
  await page.getByTestId("gift-message").fill("Happy birthday!");
  await expect(page.getByTestId("gift-summary")).toContainText(/happy birthday/i);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("gift-options").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("gift-message")).toHaveValue("Happy birthday!");
});
