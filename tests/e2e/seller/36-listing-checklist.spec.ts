/**
 * Feature 36/50: listing readiness checklist on the product form.
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

test("checklist ticks up as the form fills", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/products/new", { waitUntil: "networkidle" });
  await page.getByTestId("listing-checklist").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("listing-count")).toContainText("0/6");
  await page.locator('input[name="name"]').fill("Trail Cap");
  await expect(page.getByTestId("listing-count")).toContainText("1/6");
  await page.locator('input[name="price"]').fill("25");
  await expect(page.getByTestId("listing-count")).toContainText("2/6");
});
