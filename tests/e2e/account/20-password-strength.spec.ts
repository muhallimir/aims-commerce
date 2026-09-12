/**
 * Feature 20/50: password strength meter on registration.
 */
import { test, expect } from "@playwright/test";

test("meter grades the password live", async ({ page }) => {
  await page.goto("/register", { waitUntil: "networkidle" });
  await expect(page.getByTestId("password-strength")).toHaveCount(0);
  const pw = page.locator('input[name="password"]');
  await pw.fill("abc");
  await expect(page.getByTestId("password-strength-label")).toContainText(/weak/i);
  await pw.fill("Abcdef12!xyz");
  await expect(page.getByTestId("password-strength-label")).toContainText(/strong/i);
});
