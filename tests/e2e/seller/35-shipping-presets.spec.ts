/**
 * Feature 35/50: shipping presets on the products page.
 */
import { test, expect } from "@playwright/test";

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
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });
}

test("preset saves, copies and removes", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await sellerSession(page, context);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  const manage = page.getByRole("button", { name: "Manage Products" });
  await expect(manage).toBeVisible({ timeout: 20000 });
  await manage.scrollIntoViewIfNeeded();
  await manage.click();
  await page.getByTestId("shipping-presets").scrollIntoViewIfNeeded();
  await page.getByTestId("preset-name").fill("West Coast");
  await page.getByTestId("preset-zone").fill("CA-NV-OR");
  await page.getByTestId("preset-rate").fill("7.5");
  await page.getByTestId("preset-add").click();
  const entry = page.locator('[data-testid^="preset-sh-"]').first();
  await expect(entry).toContainText("West Coast");
  const id = ((await entry.getAttribute("data-testid")) ?? "").replace("preset-", "");
  await page.getByTestId(`preset-copy-${id}`).click();
  await expect(page.getByTestId(`preset-copy-${id}`)).toContainText("Copied");
  await page.getByTestId(`preset-remove-${id}`).click();
  await expect(entry).toHaveCount(0);
});
