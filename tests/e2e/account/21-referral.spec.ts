/**
 * Feature 21/50: refer-a-friend card with copyable link.
 */
import { test, expect } from "@playwright/test";

test("referral link copies to clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/profile", { waitUntil: "networkidle" });
  await page.getByTestId("referral-card").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("referral-link-input")).toHaveValue(/ref=AIMS-/);
  await page.getByTestId("referral-copy").click();
  await expect(page.getByTestId("referral-done")).toBeVisible();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain("ref=AIMS-");
});
