/**
 * Feature 24: order invoices. Logged-out visitors get a sign-in
 * prompt; the widget never renders fake orders.
 */
import { test, expect } from "@playwright/test";

test("invoice section prompts logged-out visitors", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-invoice").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("invoice-signin-prompt")).toBeVisible();
  await expect(page.getByTestId("invoice-signin-link")).toHaveAttribute("href", "/signin");
});

test("invoice widget makes no unauthenticated order calls", async ({ page }) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/orders/mine")) calls.push(r.url());
  });
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-invoice").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("invoice-signin-prompt")).toBeVisible();
  expect(calls).toHaveLength(0);
});
