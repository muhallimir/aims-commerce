/**
 * Feature 31/50: one-click restock from the low-stock panel.
 * Proof is the refetched server count, not local flags.
 */
import { test, expect } from "@playwright/test";

async function sellerSession(page: any, context: any, store: { stock: number }, puts: any[]) {
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
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "sp1", name: "Cap", price: 20, count_in_stock: store.stock }]),
    });
  });
  await page.route("**/api/sellers/analytics", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
  });
  await page.route("**/api/sellers/orders", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });
  await page.route("**/api/sellers/products/sp1", async (route: any) => {
    puts.push({ method: route.request().method(), body: route.request().postDataJSON() });
    store.stock = 12;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ id: "sp1", count_in_stock: 12 }) });
  });
}

test("restock sends current plus ten and the shelf count updates", async ({ page, context }) => {
  const puts: any[] = [];
  const store = { stock: 2 };
  await sellerSession(page, context, store, puts);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  const btn = page.getByTestId("restock-sp1");
  await expect(btn).toBeVisible({ timeout: 20000 });
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  // At 12 units the product leaves the low-stock list entirely.
  await expect(page.getByText("2 left")).toHaveCount(0, { timeout: 15000 });
  expect(puts).toHaveLength(1);
  expect(puts[0].method).toBe("PUT");
  expect(puts[0].body).toMatchObject({ countInStock: 12 });
});
