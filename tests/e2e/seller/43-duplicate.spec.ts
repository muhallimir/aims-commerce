/**
 * Feature 43/50: duplicate listing on seller product cards.
 */
import { test, expect } from "@playwright/test";

const PRODUCT = {
  id: "dup1", name: "Cap", image: "", brand: "A", category: "Hats",
  description: "Cap", price: 20, count_in_stock: 5, rating: 4,
  num_reviews: 1, seller_id: "s1", is_active: true,
  created_at: "2026-01-01", updated_at: "2026-01-01",
};

async function sellerSession(page: any, context: any, posts: any[]) {
  const payload = Buffer.from(JSON.stringify({ _id: "seller1", isSeller: true })).toString("base64url");
  await context.addCookies([{ name: "token", value: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, domain: "127.0.0.1", path: "/" }]);
  await page.addInitScript(() => {
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        app: JSON.stringify({ theme: "light", loading: false, error: null, routeBack: false, transitioning: false, isDemo: false }),
        user: JSON.stringify({
          userInfo: { _id: "seller1", name: "Selma", email: "selma@example.com", isSeller: true },
          adminUsersData: { allUsers: [], userInView: {}, isRegisteringNewUser: false },
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
  const list: any[] = [{ ...PRODUCT }];
  await page.route("**/api/sellers/products", async (route: any) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      posts.push(body);
      list.push({ ...PRODUCT, id: "dup2", name: body.name, count_in_stock: body.countInStock ?? 0 });
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ message: "ok", product: { ...PRODUCT, id: "dup2" } }) });
    } else {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(list) });
    }
  });
  await page.route("**/api/sellers/analytics", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
  });
  await page.route("**/api/sellers/orders", async (route: any) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });
}

test("duplicate posts a renamed zero-stock copy", async ({ page, context }) => {
  const posts: any[] = [];
  await sellerSession(page, context, posts);
  await page.goto("/seller/dashboard", { waitUntil: "networkidle" });
  const manage = page.getByRole("button", { name: "Manage Products" });
  await expect(manage).toBeVisible({ timeout: 20000 });
  await manage.scrollIntoViewIfNeeded();
  await manage.click();
  const dup = page.getByTestId("duplicate-button").first();
  await expect(dup).toBeVisible({ timeout: 15000 });
  await dup.scrollIntoViewIfNeeded();
  await dup.click();
  // The copy appears once the list refetches after the create.
  await expect(page.getByText("Cap (Copy)")).toBeVisible({ timeout: 15000 });
  expect(posts).toHaveLength(1);
  expect(posts[0]).toMatchObject({ name: "Cap (Copy)", countInStock: 0 });
});
