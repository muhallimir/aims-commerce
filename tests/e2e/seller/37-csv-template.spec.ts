/**
 * Feature 37/50: bulk CSV template download on the products page.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";

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

test("template downloads with headers and example row", async ({ page, context }) => {
  await sellerSession(page, context);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  const manage = page.getByRole("button", { name: "Manage Products" });
  await expect(manage).toBeVisible({ timeout: 20000 });
  await manage.scrollIntoViewIfNeeded();
  await manage.click();
  await page.getByTestId("csv-template").scrollIntoViewIfNeeded();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("csv-template-download").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("aims-products-template.csv");
  const path = await download.path();
  const text = fs.readFileSync(path as string, "utf8");
  expect(text.split("\n")[0]).toBe("id,name,price,category,stock,brand");
});
