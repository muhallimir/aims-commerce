/**
 * Feature 42/50: role filter on the admin user list.
 */
import { test, expect } from "@playwright/test";

const USERS = [
  { _id: "u1", id: "u1", name: "Ada Admin", email: "ada@example.com", is_admin: true, is_seller: false, created_at: "2026-01-01", updated_at: "2026-09-01" },
  { _id: "u2", id: "u2", name: "Selma Seller", email: "selma@example.com", is_admin: false, is_seller: true, created_at: "2026-01-01", updated_at: "2026-09-01" },
  { _id: "u3", id: "u3", name: "Sam Customer", email: "sam@example.com", is_admin: false, is_seller: false, created_at: "2026-01-01", updated_at: "2026-09-01" },
];

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
        admin: JSON.stringify({ section: "users" }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/users", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(USERS) });
  });
}

test("sellers-only view hides everyone else", async ({ page, context }) => {
  await adminSession(page, context);
  await page.goto("/admin", { waitUntil: "networkidle" });
  await expect(page.getByText("Selma Seller".toUpperCase())).toBeVisible({ timeout: 20000 });
  await page.getByTestId("role-filter-wrap").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Role" }).focus();
  await page.keyboard.press("ArrowDown");
  await page.getByRole("option", { name: "Sellers" }).click();
  await expect(page.getByText("Selma Seller".toUpperCase())).toBeVisible();
  await expect(page.getByText("Ada Admin".toUpperCase())).toHaveCount(0);
  await expect(page.getByText("Sam Customer".toUpperCase())).toHaveCount(0);
});
