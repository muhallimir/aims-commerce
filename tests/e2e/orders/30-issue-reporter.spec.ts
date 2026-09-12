/**
 * Feature 30/50: order issue reporter on purchase history.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "order-9",
  user: { _id: "u1", name: "Sam", email: "sam@example.com" },
  orderItems: [{ product: "p1", name: "Cap", qty: 1, price: 20, image: "", seller: "s1" }],
  itemsPrice: 20,
  shippingPrice: 5,
  taxPrice: 0,
  totalPrice: 25,
  paymentMethod: "stripe",
  isPaid: true,
  paidAt: "2026-09-01T10:00:00Z",
  isDelivered: false,
  deliveredAt: null,
  shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" },
  paymentResult: null,
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
};

test("late delivery report returns a reference", async ({ page }) => {
  await page.route("**/api/orders/purchase", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) });
  });
  await page.goto("/purchases", { waitUntil: "networkidle" });
  const open = page.getByTestId("issue-open").first();
  await expect(open).toBeVisible({ timeout: 15000 });
  await open.scrollIntoViewIfNeeded();
  await open.click();
  await page.getByTestId("issue-type").click();
  await page.getByRole("option", { name: "Late delivery" }).click();
  await page.getByTestId("issue-details").fill("Two weeks late");
  await page.getByTestId("issue-submit").click();
  await expect(page.getByTestId("issue-ref")).toContainText(/SUP-/);
});
