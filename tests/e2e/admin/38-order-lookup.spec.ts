/**
 * Feature 38/50: admin order lookup jumps to the detail page.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "adm-order-1",
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
        admin: JSON.stringify({ section: "orders" }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/orders", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });
  await page.route("**/api/orders/adm-order-1", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDER) });
  });
}

test("lookup opens the order detail with timeline", async ({ page, context }) => {
  await adminSession(page, context);
  await page.goto("/admin", { waitUntil: "networkidle" });
  await page.getByTestId("order-lookup").scrollIntoViewIfNeeded();
  await page.getByTestId("order-lookup-input").fill("adm-order-1");
  await page.getByTestId("order-lookup-go").click();
  await expect(page).toHaveURL(/\/admin\/orders\/adm-order-1/, { timeout: 15000 });
  await expect(page.getByTestId("order-timeline")).toBeVisible({ timeout: 15000 });
});
