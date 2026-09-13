/**
 * Feature 48/50: admin orders CSV export of the filtered list.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";

const ORDERS = [
  { _id: "csv-o1", user: { _id: "u1", name: "Sam", email: "s@s.com" }, orderItems: [], itemsPrice: 40, shippingPrice: 0, taxPrice: 0, totalPrice: 40, paymentMethod: "stripe", isPaid: true, paidAt: "2026-09-01", isDelivered: false, deliveredAt: null, shippingAddress: { fullName: "Sam", contact: "1", address: "1 Main", city: "NYC", postalCode: "10001", country: "US" }, paymentResult: null, createdAt: "2026-09-01", updatedAt: "2026-09-01" },
  { _id: "csv-o2", user: { _id: "u2", name: "Alex", email: "a@a.com" }, orderItems: [], itemsPrice: 60, shippingPrice: 0, taxPrice: 0, totalPrice: 60, paymentMethod: "stripe", isPaid: false, paidAt: null, isDelivered: false, deliveredAt: null, shippingAddress: { fullName: "Alex", contact: "2", address: "2 Main", city: "LA", postalCode: "90001", country: "US" }, paymentResult: null, createdAt: "2026-09-02", updatedAt: "2026-09-02" },
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
        admin: JSON.stringify({ section: "orders" }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/orders", async (route: any) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDERS) });
    } else {
      await route.fallback();
    }
  });
}

test("export downloads the filtered orders", async ({ page, context }) => {
  await adminSession(page, context);
  await page.goto("/admin", { waitUntil: "networkidle" });
  const btn = page.getByTestId("orders-csv");
  await expect(btn).toBeVisible({ timeout: 20000 });
  await expect(btn).toContainText("Export 2 as CSV");
  const downloadPromise = page.waitForEvent("download");
  await btn.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("aims-orders.csv");
  const text = fs.readFileSync((await download.path()) as string, "utf8");
  expect(text.split("\n")).toHaveLength(3);
  expect(text).toContain("csv-o1");
});
