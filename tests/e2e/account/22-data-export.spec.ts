/**
 * Feature 22/50: my-data export. Logged-out visitors get pointed to
 * sign-in; signed-in shoppers download profile + orders JSON.
 */
import { test, expect } from "@playwright/test";

test("logged-out visitors are pointed to sign-in", async ({ page }) => {
  await page.goto("/profile", { waitUntil: "networkidle" });
  await page.getByTestId("data-export").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("data-export-signin")).toContainText(/sign in/i);
});

test("signed-in shoppers download the export file", async ({ page }) => {
  await page.addInitScript(() => {
    document.cookie = "token=test-token-123;path=/";
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: JSON.stringify({
          userInfo: { _id: "u1", name: "Sam", email: "sam@example.com" },
          adminUsersData: { allUsers: [], userInView: {}, isRegisteringNewUser: false },
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  await page.route("**/api/users/profile", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ id: "u1", name: "Sam" }) });
  });
  await page.route("**/api/orders/mine", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([{ _id: "o1" }]) });
  });
  await page.goto("/profile", { waitUntil: "networkidle" });
  await page.getByTestId("data-export").scrollIntoViewIfNeeded();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("data-export-btn").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("aims-my-data.json");
  const path = await download.path();
  expect(path).not.toBeNull();
});
