/**
 * Services hub: seven rooms, every card navigates to its sub-page.
 */
import { test, expect } from "@playwright/test";

const HUBS = ["tracking", "delivery", "returns", "protection", "home-services", "shopping", "help"];

test("hub lists all seven rooms", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/services", { waitUntil: "networkidle" });
  await expect(page.getByTestId("services-page")).toBeVisible();
  for (const id of HUBS) {
    await expect(page.getByTestId(`hub-${id}`)).toBeVisible();
  }
  expect(errors.filter((e) => !e.includes("favicon") && !e.includes("webpack-hmr"))).toHaveLength(0);
});

test("hub cards navigate to their sub-pages", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("hub-go-delivery").click();
  await expect(page).toHaveURL(/\/services\/delivery/, { timeout: 15000 });
  await expect(page.getByTestId("services-delivery-page")).toBeVisible({ timeout: 15000 });
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("hub-go-tracking").click();
  await expect(page).toHaveURL(/\/services\/tracking/, { timeout: 15000 });
  await expect(page.getByTestId("services-tracking-page")).toBeVisible({ timeout: 15000 });
});
