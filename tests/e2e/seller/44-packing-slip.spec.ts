/**
 * Feature 44/50: packing slips on seller order cards.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  id: "pk1", user_id: "u9",
  orderItems: [{ product_id: "p1", name: "Cap", qty: 2, price: 20, image: "", seller_id: "s1" }],
  items_price: 40, shipping_price: 5, tax_price: 0, total_price: 45,
  payment_method: "stripe", is_paid: true, paid_at: "2026-09-01",
  is_delivered: false, delivered_at: null,
  shipping_full_name: "Sam", shipping_contact: "1", shipping_address: "1 Main",
  shipping_city: "NYC", shipping_postal_code: "10001", shipping_country: "US",
  payment_result: null, created_at: "2026-09-01", updated_at: "2026-09-01",
};

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
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) });
  });
}

test("slip opens with lines, total and address", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  await expect(page.getByTestId("cookie-consent")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("cookie-accept").click();
  await expect(page.getByTestId("cookie-consent")).toHaveCount(0);
  const viewOrders = page.getByRole("button", { name: "View Orders" });
  await expect(viewOrders).toBeVisible({ timeout: 20000 });
  await viewOrders.scrollIntoViewIfNeeded();
  await viewOrders.click();
  const open = page.getByTestId("packing-open-pk1");
  await expect(open).toBeVisible({ timeout: 15000 });
  await open.scrollIntoViewIfNeeded();
  await open.click();
  await expect(page.getByTestId("packing-body")).toContainText("2 × Cap");
  await expect(page.getByTestId("packing-body")).toContainText("Total: $45.00");
  await expect(page.getByTestId("packing-body")).toContainText(/ship to: sam/i);
});
