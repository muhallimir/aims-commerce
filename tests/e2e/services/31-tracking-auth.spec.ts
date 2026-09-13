/**
 * Authenticated tracking: with a token cookie the widget sends the
 * Bearer header, renders the real order timeline and the live map.
 * Backend responses are stubbed at the network edge; the widget's
 * request wiring and rendering are fully exercised.
 */
import { test, expect } from "@playwright/test";

const ORDER = {
  _id: "64f2abcd1234",
  isPaid: true,
  paidAt: "2026-09-10T10:00:00Z",
  isDelivered: false,
  deliveredAt: null,
  totalPrice: 129.99,
  shippingPrice: 5,
  taxPrice: 8,
  itemsPrice: 116.99,
  createdAt: "2026-09-09T10:00:00Z",
  user: { name: "Lucas Hill", email: "lucas@example.com" },
  orderItems: [{ name: "Red Sneaker", qty: 1, price: 116.99 }],
  shippingAddress: {
    fullName: "Lucas Hill",
    address: "1 Main St",
    city: "Singapore",
    postalCode: "018956",
    country: "SG",
  },
};

async function signedIn(page: any, onAuth: (header: string | null) => void) {
  await page.addInitScript(() => {
    document.cookie = "token=test-token-123;path=/";
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({
          userInfo: { _id: "u1", name: "Lucas Hill", email: "lucas@example.com" },
          adminUsersData: { allUsers: [], userInView: {}, isRegisteringNewUser: false },
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/orders/mine", async (route: any) => {
    onAuth(route.request().headers()["authorization"] ?? null);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) });
  });
  await page.route("**/locationiq.com/**", async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ lat: "1.36", lon: "103.83", display_name: "Singapore" }]),
    });
  });
}

test("tracker sends the Bearer token and renders the order", async ({ page }) => {
  let authHeader: string | null = null;
  await signedIn(page, (h) => {
    authHeader = h;
  });
  await page.goto("/services/tracking", { waitUntil: "networkidle" });
  await page.getByTestId("service-tracking").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("tracker-detail")).toBeVisible({ timeout: 15000 });
  expect(authHeader).toBe("Bearer test-token-123");
  await expect(page.getByTestId("tracker-status")).toContainText(/on its way/i);
  await expect(page.getByTestId("tracker-detail")).toContainText("Red Sneaker");
});

test("live map renders with the geocoded destination", async ({ page }) => {
  await signedIn(page, () => {});
  await page.goto("/services/tracking", { waitUntil: "networkidle" });
  await page.getByTestId("service-tracking").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("tracker-map")).toBeVisible({ timeout: 15000 });
  const tiles = page.locator('[data-testid="tracker-map"] img.leaflet-tile');
  await expect(tiles.first()).toBeVisible({ timeout: 20000 });
});
