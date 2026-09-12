/**
 * Feature 41/50: store announcements, composed by admins and shown
 * sitewide.
 */
import { test, expect } from "@playwright/test";

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
        admin: JSON.stringify({ section: "dashboard" }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/announcements", async (route: any) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "an1", message: body.message, active: true }) });
    } else {
      await route.fallback();
    }
  });
}

test("admin publishes a banner from the dashboard", async ({ page, context }) => {
  await adminSession(page, context);
  await page.goto("/admin", { waitUntil: "networkidle" });
  await page.getByTestId("announcement-composer").scrollIntoViewIfNeeded();
  await page.getByTestId("announcement-publish").click();
  await expect(page.getByTestId("announcement-error")).toContainText(/at least 3/i);
  await page.getByTestId("announcement-input").fill("Free shipping weekend");
  await page.getByTestId("announcement-publish").click();
  await expect(page.getByTestId("announcement-saved")).toBeVisible({ timeout: 15000 });
});

test("shoppers see and dismiss the live banner", async ({ page }) => {
  await page.route("**/api/announcements", async (route: any) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([{ id: "an9", message: "Free shipping weekend", active: true }]) });
    } else {
      await route.fallback();
    }
  });
  await page.goto("/store", { waitUntil: "networkidle" });
  await expect(page.getByTestId("announcement-text")).toContainText(/free shipping weekend/i, { timeout: 15000 });
  await page.getByTestId("announcement-dismiss").click();
  await expect(page.getByTestId("announcement-bar")).toHaveCount(0);
});
