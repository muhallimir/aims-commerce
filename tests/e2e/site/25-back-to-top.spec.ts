/**
 * Feature 25/50: back-to-top floating button.
 */
import { test, expect } from "@playwright/test";

test("button appears on scroll and returns to top", async ({ page }) => {
  await page.goto("/store", { waitUntil: "networkidle" });
  await expect(page.getByTestId("back-to-top")).not.toBeVisible();
  await page.evaluate(() => {
    document.body.scrollTo(0, document.body.scrollHeight);
    window.dispatchEvent(new Event("scroll"));
    document.dispatchEvent(new Event("scroll"));
  });
  await expect(page.getByTestId("back-to-top")).toBeVisible({ timeout: 10000 });
  await page.getByTestId("back-to-top").click();
  await page.waitForFunction(
    () => (window.scrollY || document.body.scrollTop || document.documentElement.scrollTop) < 100,
    null,
    { timeout: 10000 }
  );
});
