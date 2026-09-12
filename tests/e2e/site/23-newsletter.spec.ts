/**
 * Feature 23/50: footer newsletter signup.
 */
import { test, expect } from "@playwright/test";

test("newsletter validates then confirms", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  const box = page.getByTestId("newsletter-signup");
  await box.scrollIntoViewIfNeeded();
  await page.getByTestId("newsletter-submit").click();
  await expect(page.getByText(/valid email/i).first()).toBeVisible();
  await page.getByTestId("newsletter-email").fill("sam@example.com");
  await page.getByTestId("newsletter-submit").click();
  await expect(page.getByTestId("newsletter-done")).toContainText(/friday/i);
});
