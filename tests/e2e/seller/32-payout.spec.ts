/**
 * Feature 32/50: payout preview on the seller orders page.
 */
import { test, expect } from "@playwright/test";

const ORDERS = [
  { id: "so1", user_id: "u9", orderItems: [], items_price: 100, shipping_price: 0, tax_price: 0, total_price: 100, payment_method: "stripe", is_paid: true, paid_at: "2026-09-01", is_delivered: false, delivered_at: null, shipping_full_name: "Sam", shipping_contact: "1", shipping_address: "1 Main", shipping_city: "NYC", shipping_postal_code: "10001", shipping_country: "US", payment_result: null, created_at: "2026-09-01", updated_at: "2026-09-01" },
  { id: "so2", user_id: "u9", orderItems: [], items_price: 50, shipping_price: 0, tax_price: 0, total_price: 50, payment_method: "stripe", is_paid: true, paid_at: "2026-09-02", is_delivered: true, delivered_at: "2026-09-03", shipping_full_name: "Sam", shipping_contact: "1", address: "1 Main", shipping_city: "NYC", shipping_postal_code: "10001", shipping_country: "US", payment_result: null, created_at: "2026-09-02", updated_at: "2026-09-03" },
];

async function sellerSession(page: any, context: any) {
  const payload = Buffer.from(JSON.stringify({ _id: "seller1", isSeller: true })).toString("base64url");
  await context.addCookies([{ name: "token", value: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, domain: "127.0.0.1", path: "/" }]);
  await page.addInitScript(() => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        app: JSON.stringify({ theme: "light", loading: false, error: null, routeBack: false, transitioning: false, isDemo: false }),
        user: JSON.stringify({
          userInfo: { _id: "seller1", name: "Selma", email: "selma@example.com", isSeller: true },
          adminUsersData: { allUsers: [], userInView: {}, isRegisteringNewUser: false },
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/sellers/products", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });
  await page.route("**/api/sellers/analytics", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
  });
  await page.route("**/api/sellers/orders", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDERS) });
  });
}

test("orders page previews the net payout", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  const viewOrders = page.getByRole("button", { name: "View Orders" });
  await expect(viewOrders).toBeVisible({ timeout: 20000 });
  await viewOrders.scrollIntoViewIfNeeded();
  await viewOrders.click();
  await expect(page.getByTestId("payout-preview")).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("payout-net")).toContainText("$135.00");
});
