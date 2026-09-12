/**
 * Feature 1: real order tracking. Logged-out visitors get a sign-in
 * prompt; the tracker shell renders without page errors.
 */
import { test, expect } from "@playwright/test";

test("services page shows the tracking section", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto("/services", { waitUntil: "networkidle" });
  await expect(page.getByTestId("services-page")).toBeVisible();
  await expect(page.getByTestId("service-tracking")).toBeVisible();
  await page.getByTestId("service-tracking").scrollIntoViewIfNeeded();
  const fatal = errors.filter(
    (e) =>
      !e.includes("favicon") &&
      !e.includes("webpack-hmr") &&
      !e.includes("WebSocket") &&
      !e.includes("hydration")
  );
  expect(fatal, `page errors: ${fatal.join(" | ")}`).toHaveLength(0);
});

test("tracking prompts logged-out visitors to sign in", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("tracker-signin-prompt").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("tracker-signin-prompt")).toBeVisible();
  await expect(page.getByTestId("tracker-signin-link")).toHaveAttribute("href", "/signin");
  await page.getByTestId("tracker-signin-link").click();
  await expect(page).toHaveURL(/\/signin/);
});
