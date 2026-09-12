/**
 * Feature 16/50: what's-next timeline on the order page.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "64f2abcd1234",
  user: { _id: "u1", name: "Sam", email: "sam@example.com" },
  orderItems: [{ product: "p1", name: "Cap", qty: 1, price: 20, image: "", seller: "s1" }],
  itemsPrice: 20,
  shippingPrice: 5,
  taxPrice: 1,
  totalPrice: 26,
  paymentMethod: "stripe",
  isPaid: true,
  paidAt: "2026-09-10T10:00:00Z",
  isDelivered: false,
  deliveredAt: null,
  shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" },
  paymentResult: null,
  createdAt: "2026-09-09T10:00:00Z",
  updatedAt: "2026-09-10T10:00:00Z",
};

test("paid order highlights the courier stage", async ({ page }) => {
  await page.route("**/api/orders/64f2abcd1234", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDER) });
  });
  await page.goto("/store/checkout/64f2abcd1234", { waitUntil: "networkidle" });
  const timeline = page.getByTestId("order-timeline");
  await expect(timeline).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("order-stage-2")).toHaveAttribute("data-state", "current");
});
