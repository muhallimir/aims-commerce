/**
 * Home page (/) responsive sweep: the landing redirect plus the store
 * must render cleanly at phone, tablet and desktop widths with no
 * horizontal overflow and no page errors.
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "phone", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1920, height: 1080 },
];

for (const v of VIEWPORTS) {
  test(`home renders cleanly at ${v.name} (${v.width}px)`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width: v.width, height: v.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/store/, { timeout: 15000 });
    await expect(page.getByTestId("flash-sale-bar")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("store-grid")).toBeVisible({ timeout: 15000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow at ${v.name}`).toBeLessThanOrEqual(1);
    const fatal = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("webpack-hmr") && !e.includes("WebSocket") && !e.includes("hydration")
    );
    expect(fatal, `page errors at ${v.name}: ${fatal.join(" | ")}`).toHaveLength(0);
  });
}

test("phone shows the mobile menu toggle", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByTestId("store-grid")).toBeVisible({ timeout: 15000 });
  // The drawer toggle only renders on xs screens.
  const toggle = page.locator('button:has(svg[data-testid="MenuIcon"])');
  await expect(toggle.first()).toBeVisible();
});
