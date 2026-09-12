/**
 * Feature 29: visit-us map. Shoppers see the flagship on a live
 * OpenStreetMap with a directions link out.
 */
import { test, expect } from "@playwright/test";

test("store section shows address and live map", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-visit").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("visit-address")).toContainText(/orchard road/i);
  await expect(page.getByTestId("store-map")).toBeVisible({ timeout: 15000 });
  const tiles = page.locator('[data-testid="store-map"] img.leaflet-tile');
  await expect(tiles.first()).toBeVisible({ timeout: 20000 });
});

test("directions link opens OpenStreetMap routing", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-visit").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("visit-directions")).toHaveAttribute(
    "href",
    /openstreetmap\.org\/directions/
  );
});
