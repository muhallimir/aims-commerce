/**
 * Feature 49/50: arrival estimates on purchase cards.
 */
import { test, expect } from "@playwright/test";

const OPEN_ORDER = {
  _id: "eta-order-1",
  user: { _id: "u1", name: "Sam", email: "sam@example.com" },
  orderItems: [{ product: "p1", name: "Cap", qty: 1, price: 20, image: "", seller: "s1" }],
  itemsPrice: 20,
  shippingPrice: 5,
  taxPrice: 0,
  totalPrice: 25,
  paymentMethod: "stripe",
  isPaid: true,
  paidAt: "2026-09-14T10:00:00Z",
  isDelivered: false,
  deliveredAt: null,
  shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" },
  paymentResult: null,
  createdAt: "2026-09-14T10:00:00Z",
  updatedAt: "2026-09-14T10:00:00Z",
};

const DONE_ORDER = { ...OPEN_ORDER, _id: "eta-order-2", isDelivered: true, deliveredAt: "2026-09-16T10:00:00Z" };

test("open orders show arrival, delivered ones do not", async ({ page }) => {
  await page.route("**/api/orders/purchase", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([OPEN_ORDER, DONE_ORDER]) });
  });
  await page.goto("/purchases", { waitUntil: "networkidle" });
  const estimates = page.getByTestId("arrival-estimate");
  await expect(estimates).toHaveCount(1, { timeout: 15000 });
  await expect(estimates.first()).toContainText(/arriving around/i);
});
