/**
 * Feature 17: installation scheduling. Shopper checks postcode
 * eligibility, picks a visit window, books it.
 */
import { test, expect } from "@playwright/test";

test("installation turns away an uncovered postcode", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-install").scrollIntoViewIfNeeded();
  await page.getByTestId("install-postcode").fill("99999");
  await page.getByTestId("install-check").click();
  await expect(page.getByTestId("install-unserved")).toContainText(/don't cover/i);
});

test("installation books a window in a served area", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.getByTestId("service-install").scrollIntoViewIfNeeded();
  await page.getByTestId("install-postcode").fill("10001");
  await page.getByTestId("install-check").click();
  await expect(page.getByTestId("install-book")).toBeDisabled();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const iso = tomorrow.toISOString().slice(0, 10);
  await page.getByTestId(`install-option-${iso}`).first().check();
  await page.getByTestId("install-book").click();
  await expect(page.getByTestId("install-result")).toContainText(/IN-/);
});
