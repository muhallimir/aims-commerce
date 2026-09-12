/**
 * Feature 34/50: sale campaign creator on the products page.
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

test("campaign preview follows the discount slider", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  const manage = page.getByRole("button", { name: "Manage Products" });
  await expect(manage).toBeVisible({ timeout: 20000 });
  await manage.scrollIntoViewIfNeeded();
  await manage.click();
  await expect(page.getByTestId("campaign-creator")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("campaign-creator").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("campaign-text")).toContainText("20% off");
  const slider = page.getByTestId("campaign-pct");
  const box = await slider.boundingBox();
  if (!box) throw new Error("slider has no bounding box");
  await slider.click({ position: { x: box.width * 0.9, y: box.height / 2 } });
  await expect(page.getByTestId("campaign-pct-label")).toContainText("65%");
  await expect(page.getByTestId("campaign-code")).toContainText("SAVE65-");
});
