/**
 * Feature 45/50: track-package deep link from purchase history.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "track-me-1",
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
  shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "Singapore", postalCode: "018956", country: "SG" },
  paymentResult: null,
  createdAt: "2026-09-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
};

async function signedIn(page: any, context: any) {
  const payload = Buffer.from(JSON.stringify({ _id: "u1" })).toString("base64url");
  await context.addCookies([{ name: "token", value: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, domain: "127.0.0.1", path: "/" }]);
  await page.addInitScript(() => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        app: JSON.stringify({ theme: "light", loading: false, error: null, routeBack: false, transitioning: false, isDemo: false }),
        user: JSON.stringify({
          userInfo: { _id: "u1", name: "Sam", email: "sam@example.com" },
          adminUsersData: { allUsers: [], userInView: {}, isRegisteringNewUser: false },
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/orders/purchase", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) });
  });
  await page.route("**/api/orders/mine", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) });
  });
  await page.route("**/locationiq.com/**", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([{ lat: "1.36", lon: "103.83", display_name: "Singapore" }]) });
  });
}

test("track package opens services with the order preselected", async ({ page, context }) => {
  await signedIn(page, context);
  await page.goto("/purchases", { waitUntil: "networkidle" });
  const track = page.getByTestId("track-package").first();
  await expect(track).toBeVisible({ timeout: 15000 });
  await track.scrollIntoViewIfNeeded();
  await track.click();
  await expect(page).toHaveURL(/\/services\?order=track-me-1/, { timeout: 15000 });
  await expect(page.getByTestId("tracker-detail")).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("tracker-detail")).toContainText("track-me-1".slice(0, 8));
});
