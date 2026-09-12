/**
 * Feature 17/50: buy-again from purchase history.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "order-1",
  user: { _id: "u1", name: "Sam", email: "sam@example.com" },
  orderItems: [{ product: "p1", name: "Cap", qty: 2, price: 20, image: "", seller: "s1" }],
  itemsPrice: 40,
  shippingPrice: 5,
  taxPrice: 0,
  totalPrice: 45,
  paymentMethod: "stripe",
  isPaid: true,
  paidAt: "2026-09-01T10:00:00Z",
  isDelivered: true,
  deliveredAt: "2026-09-03T10:00:00Z",
  shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" },
  paymentResult: null,
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-03T10:00:00Z",
};

test("buy-again refills the cart and opens it", async ({ page }) => {
  await page.route("**/api/orders/purchase", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) });
  });
  await page.goto("/purchases", { waitUntil: "networkidle" });
  const btn = page.getByTestId("reorder-button").first();
  await expect(btn).toBeVisible({ timeout: 15000 });
  await expect(btn).toContainText("Buy again (2)");
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(page).toHaveURL(/\/store\/cart/, { timeout: 15000 });
  await expect(page.getByTestId("free-shipping-bar")).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("free-shipping-text")).toContainText("$10.00 away");
});
