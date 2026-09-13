/**
 * Feature 30: recently-viewed strip. Browsing trail from this browser
 * renders, removes and clears.
 */
import { test, expect } from "@playwright/test";

async function seed(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "aims-recent",
      JSON.stringify({
        userId: "guest",
        views: [
          { productId: "sneaker-red", viewedAt: new Date().toISOString() },
          { productId: "wool-cap", viewedAt: new Date().toISOString() },
        ],
      })
    );
  });
}

test("empty trail invites browsing", async ({ page }) => {
  await page.goto("/services/help", { waitUntil: "networkidle" });
  await page.getByTestId("service-recent").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("recent-empty")).toBeVisible();
  await expect(page.getByTestId("recent-browse")).toHaveAttribute("href", "/store");
});

test("trail renders, removes and clears", async ({ page }) => {
  await seed(page);
  await page.goto("/services/help", { waitUntil: "networkidle" });
  await page.getByTestId("service-recent").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("recent-item-sneaker-red")).toBeVisible();
  await expect(page.getByTestId("recent-item-wool-cap")).toBeVisible();
  await page.getByTestId("recent-item-wool-cap").locator(".MuiChip-deleteIcon").click();
  await expect(page.getByTestId("recent-item-wool-cap")).toHaveCount(0);
  await expect(page.getByTestId("recent-item-sneaker-red")).toBeVisible();
  await page.getByTestId("recent-clear").click();
  await expect(page.getByTestId("recent-empty")).toBeVisible();
});
