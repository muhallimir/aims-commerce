/**
 * Feature 40/50: fraud screen on admin order views, hidden otherwise.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "fraud-order-1",
  user: { _id: "u1", name: "Sam", email: "sam@example.com" },
  orderItems: [{ product: "p1", name: "TV", qty: 1, price: 1500, image: "", seller: "s1" }],
  itemsPrice: 1500,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 1500,
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

async function adminSession(page: any, context: any) {
  const payload = Buffer.from(JSON.stringify({ _id: "admin1", isAdmin: true })).toString("base64url");
  await context.addCookies([{ name: "token", value: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, domain: "127.0.0.1", path: "/" }]);
  await page.addInitScript(() => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        app: JSON.stringify({ theme: "light", loading: false, error: null, routeBack: false, transitioning: false, isDemo: false }),
        user: JSON.stringify({
          userInfo: { _id: "admin1", name: "Ada", email: "ada@example.com", isAdmin: true },
          adminUsersData: { allUsers: [], userInView: {}, isRegisteringNewUser: false },
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/orders/fraud-order-1", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDER) });
  });
}

test("admins see the fraud screen with the value flag", async ({ page, context }) => {
  await adminSession(page, context);
  await page.goto("/admin/orders/fraud-order-1", { waitUntil: "networkidle" });
  await page.getByTestId("fraud-hint").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("fraud-flag")).toContainText(/high order value/i);
});

test("shoppers never see the fraud screen", async ({ page }) => {
  await page.route("**/api/orders/fraud-order-1", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDER) });
  });
  await page.goto("/store/checkout/fraud-order-1", { waitUntil: "networkidle" });
  await page.getByTestId("order-timeline").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("fraud-hint")).toHaveCount(0);
});
