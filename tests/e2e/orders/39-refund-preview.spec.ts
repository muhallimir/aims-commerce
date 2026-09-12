/**
 * Feature 39/50: refund eligibility preview on delivered orders.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "refund-order-1",
  user: { _id: "u1", name: "Sam", email: "sam@example.com" },
  orderItems: [{ product: "p1", name: "Cap", qty: 1, price: 100, image: "", seller: "s1" }],
  itemsPrice: 100,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 100,
  paymentMethod: "stripe",
  isPaid: true,
  paidAt: "2026-09-01T10:00:00Z",
  isDelivered: true,
  deliveredAt: new Date().toISOString(),
  shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" },
  paymentResult: null,
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
};

test("sealed return prices full, used return halves", async ({ page }) => {
  await page.route("**/api/orders/refund-order-1", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDER) });
  });
  await page.goto("/store/checkout/refund-order-1", { waitUntil: "networkidle" });
  await page.getByTestId("refund-preview").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("refund-verdict")).toContainText("$100.00");
  await page.getByTestId("refund-condition").click();
  await page.getByRole("option", { name: "used" }).click();
  await expect(page.getByTestId("refund-verdict")).toContainText("$50.00");
});
