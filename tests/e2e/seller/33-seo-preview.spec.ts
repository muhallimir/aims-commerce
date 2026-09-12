/**
 * Feature 33/50: SEO snippet preview on the new-product form.
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
}

test("snippet mirrors the typed name and slug", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/products/new", { waitUntil: "networkidle" });
  await page.getByTestId("seo-preview").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("seo-url")).toContainText(/product$/);
  await page.locator('input[name="name"]').fill("Red Trail Sneaker");
  await expect(page.getByTestId("seo-title")).toContainText("Red Trail Sneaker");
  await expect(page.getByTestId("seo-url")).toContainText("red-trail-sneaker");
});

test("overlong title raises the truncation warning", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/products/new", { waitUntil: "networkidle" });
  await page.locator('input[name="name"]').fill("x".repeat(61));
  await expect(page.getByTestId("seo-warning")).toContainText(/truncates past 60/);
});
