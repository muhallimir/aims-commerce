/**
 * Feature 28: service FAQ. Shoppers expand one answer at a time;
 * content matches the widgets on this page.
 */
import { test, expect } from "@playwright/test";

test("first answer is open, others expand on click", async ({ page }) => {
  await page.goto("/services/help", { waitUntil: "networkidle" });
  await page.getByTestId("service-faq").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("faq-answer-0")).toBeVisible();
  await expect(page.getByTestId("faq-answer-0")).toContainText(/metro postcodes/i);
  await page.getByTestId("faq-toggle-2").click();
  await expect(page.getByTestId("faq-answer-2")).toBeVisible();
  await expect(page.getByTestId("faq-answer-2")).toContainText(/14 days/i);
});
