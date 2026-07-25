// Comprehensive Playwright browser e2e suite for the role-based purchase flow.
//
// Covers:
//   1. Customer: demo account → /signin → auto-redirect → /store →
//      add product to cart → shipping → payment selection (Stripe preselected,
//      PayPal disabled) → place order → one-click demo payment → receipt
//   2. Seller:  signin → /seller/dashboard → add product → list products →
//      view orders
//   3. Admin:   signin → /admin → /admin/users → /admin/products →
//      /admin/orders → list all (via API)
//
// Each role's flow runs in its own browser context with isolated cookies.
// All test-created data uses the __TEST__ prefix and is cleaned up at the end
// (see scripts/test/e2e_test.mjs for the matching DB-level cleanup).
//
// Run with:
//   npm run dev                                       # in another shell
//   node scripts/test/browser_e2e_purchase.mjs
//
// Targets BASE (default http://127.0.0.1:3005).

import { chromium } from "playwright";
import postgres from "postgres";
import "dotenv/config";

const BASE = process.env.BASE || "http://127.0.0.1:3005";
const API = BASE;
const TEST_PREFIX = "__TEST__";
const SUFFIX = Date.now();
const PASSWORD = "BrowserE2E123!";

let pass = 0, fail = 0;
const failures = [];

function record(name, ok, detail = "") {
    if (ok) {
        pass++;
        console.log(`  ✅ ${name} ${detail}`);
    } else {
        fail++;
        failures.push({ name, detail });
        console.log(`  ❌ ${name} ${detail}`);
    }
}

function getCookieFromContext(ctx, name) {
    return ctx.cookies().then((cs) => cs.find((c) => c.name === name)?.value);
}

async function fetchJson(url, opts = {}) {
    const r = await fetch(url, opts);
    let body;
    try { body = await r.json(); } catch { body = null; }
    return { status: r.status, data: body };
}

async function api(method, path, { token, body, headers = {} } = {}) {
    const opts = { method, headers: { "Content-Type": "application/json", ...headers } };
    if (token) opts.headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) opts.body = JSON.stringify(body);
    return await fetchJson(`${API}${path}`, opts);
}

async function getReduxState(page) {
    return await page.evaluate(() => {
        const raw = localStorage.getItem("persist:root");
        if (!raw) return null;
        const root = JSON.parse(raw);
        const parsed = {};
        for (const [k, v] of Object.entries(root)) {
            try { parsed[k] = JSON.parse(v); } catch { parsed[k] = v; }
        }
        return parsed;
    });
}

async function addProductToCart(page) {
    // Open the store
    await page.goto(`${BASE}/store`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // The product card has a direct "Add to Cart" button. Use a direct DOM
    // click rather than Playwright's .click() because some of the buttons
    // have continuous animations that interfere with Playwright's stability
    // checks, and the React onClick handler fires correctly via a real DOM
    // click event.
    const added = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const addButtons = Array.from(buttons).filter(b => b.textContent.trim() === 'Add to Cart' && !b.disabled);
        if (addButtons.length === 0) return false;
        addButtons[0].click();
        return true;
    });

    if (!added) {
        // Fall back: click a product to go to the detail page
        const productLinks = await page.locator('a[href*="/store/product/"]').all();
        if (productLinks.length === 0) return null;
        await productLinks[0].click();
        await page.waitForURL(/\/store\/product\//, { timeout: 10000 });
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1000);
        const detailAddBtn = page.locator('button:has-text("Add to Cart")');
        if (await detailAddBtn.count() === 0) return null;
        await detailAddBtn.first().click({ force: true });
        // Wait for the fly-to-cart animation + dispatch (setTimeout 500ms)
        await page.waitForTimeout(3000);
        const m = page.url().match(/\/store\/product\/([a-f0-9-]+)/);
        return m ? m[1] : null;
    }
    // Wait for the fly-to-cart animation + dispatch (setTimeout 500ms) + redux-persist
    await page.waitForTimeout(3000);

    // Extract the product id from the redux cart state
    const state = await getReduxState(page);
    const items = state?.cart?.cartItems || [];
    return items[0]?._id || null;
}

async function fillShippingForm(page) {
    // If we're not on /store/shipping, navigate there
    if (!page.url().includes("/store/shipping")) {
        await page.goto(`${BASE}/store/shipping`, { waitUntil: "networkidle" });
    }
    await page.waitForTimeout(3000);

    // Use the "Generate Demo Address" button if available
    const genAddrBtn = page.locator('button:has-text("Generate Demo Address")');
    if (await genAddrBtn.count() > 0) {
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            const btn = Array.from(buttons).find((b) => b.textContent.includes("Generate Demo Address"));
            if (btn) btn.click();
        });
        await page.waitForTimeout(2500);
    } else {
        await page.locator('input[name="fullName"]').fill("Demo Customer");
        await page.locator('input[name="contactNo"]').fill("1234567890");
        await page.locator('input[name="address"]').fill("123 Main St");
        await page.locator('input[name="city"]').fill("New York");
        await page.locator('input[name="postalCode"]').fill("10001");
        await page.locator('input[name="country"]').fill("United States");
    }
    await page.waitForTimeout(500);
    // Submit via DOM click
    await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const btn = Array.from(buttons).find((b) => b.textContent.trim() === 'Continue' && b.type === 'submit');
        if (btn) btn.click();
    });

    // Wait for navigation to /store/payment-selection
    let url = page.url();
    for (let i = 0; i < 20; i++) {
        await page.waitForTimeout(500);
        url = page.url();
        if (url.includes("/store/payment-selection")) break;
    }
}

async function main() {
    const DIRECT = process.env.DIRECT_URL;
    if (!DIRECT) {
        console.error("DIRECT_URL not set in env — cannot clean up. Exiting.");
        process.exit(1);
    }
    const sql = postgres(DIRECT, { max: 1, onnotice: () => {} });

    // === Setup: create test users for each role ===
    console.log("=== SETUP: creating test users via API ===");

    const customerEmail = `${TEST_PREFIX}customer_${SUFFIX}@aims.test`;
    const customerName = `${TEST_PREFIX}Customer_${SUFFIX}`;
    const sellerEmail = `${TEST_PREFIX}seller_${SUFFIX}@aims.test`;
    const sellerName = `${TEST_PREFIX}Seller_${SUFFIX}`;
    const sellerStoreName = `${TEST_PREFIX}Store_${SUFFIX}`;
    const adminEmail = `${TEST_PREFIX}admin_${SUFFIX}@aims.test`;
    const adminName = `${TEST_PREFIX}Admin_${SUFFIX}`;

    // Customer
    const customerReg = await api("POST", "/api/users/register", {
        body: { name: customerName, email: customerEmail, password: PASSWORD }
    });
    record("setup: customer register", customerReg.status === 200 && !!customerReg.data?._id, `status=${customerReg.status}`);

    // Seller (register then become seller)
    const sellerReg = await api("POST", "/api/users/register", {
        body: { name: sellerName, email: sellerEmail, password: PASSWORD }
    });
    record("setup: seller register", sellerReg.status === 200 && !!sellerReg.data?._id, `status=${sellerReg.status}`);

    // Admin
    const adminReg = await api("POST", "/api/users/register", {
        body: { name: adminName, email: adminEmail, password: PASSWORD }
    });
    record("setup: admin register", adminReg.status === 200 && !!adminReg.data?._id, `status=${adminReg.status}`);

    // Promote admin via SQL (no UI route for this in test mode)
    await sql`UPDATE users SET is_admin = true WHERE email = ${adminEmail}`;

    // Promote seller via the real /api/sellers/become flow so the seller row
    // is created and users.seller_id is linked correctly.
    const sellerRegToken = sellerReg.data?.token;
    const becomeResult = await api("POST", "/api/sellers/become", {
        token: sellerRegToken,
        body: { name: sellerName, storeName: sellerStoreName }
    });
    record("setup: seller /api/sellers/become (201)", becomeResult.status === 201, `status=${becomeResult.status}`);

    // Re-fetch fresh tokens after role upgrades
    const customerLogin = await api("POST", "/api/users/signin", { body: { email: customerEmail, password: PASSWORD } });
    const sellerLogin = await api("POST", "/api/users/signin", { body: { email: sellerEmail, password: PASSWORD } });
    const adminLogin = await api("POST", "/api/users/signin", { body: { email: adminEmail, password: PASSWORD } });

    record("setup: customer signin (200 + token)", customerLogin.status === 200 && !!customerLogin.data?.token, `status=${customerLogin.status}`);
    record("setup: seller signin (200 + isSeller=true)", sellerLogin.status === 200 && sellerLogin.data?.isSeller === true, `status=${sellerLogin.status}`);
    record("setup: admin signin (200 + isAdmin=true)", adminLogin.status === 200 && adminLogin.data?.isAdmin === true, `status=${adminLogin.status}`);

    const customerToken = customerLogin.data?.token;
    const sellerToken = sellerLogin.data?.token;
    const adminToken = adminLogin.data?.token;

    const sellerUser = (await sql`SELECT id, seller_id FROM users WHERE email = ${sellerEmail}`)[0];
    record("setup: seller has seller_id in DB", !!sellerUser?.seller_id, `seller_id=${sellerUser?.seller_id}`);

    // ============================================================
    // 1. CUSTOMER FLOW: demo account, add to cart, checkout, pay
    // ============================================================
    console.log("\n=== 1. CUSTOMER: demo account + purchase flow ===");
    {
        const browser = await chromium.launch();
        const ctx = await browser.newContext();
        const page = await ctx.newPage();

        // Navigate to signin page
        await page.goto(`${BASE}/signin`, { waitUntil: "networkidle" });

        // Click the "Create & Login Demo Account" button
        const demoBtn = page.locator('button:has-text("Create & Login Demo Account")');
        const demoVisible = await demoBtn.isVisible();
        record("demo banner button is visible on /signin", demoVisible);

        // Click the demo account button (force: true to bypass shimmer animation)
        await demoBtn.click({ force: true });
        // Wait for navigation away from /signin
        await page.waitForURL((u) => !u.toString().endsWith("/signin"), { timeout: 15000 });
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);
        const afterLogin = page.url();
        record("demo login redirects away from /signin", !afterLogin.endsWith("/signin"), `url=${afterLogin.replace(BASE, "")}`);

        // Check that the JWT cookie was set
        const token = await getCookieFromContext(ctx, "token");
        record("demo login sets JWT cookie", !!token && token.length > 20, `token length=${token?.length}`);

        // Check that the demo dialog is open
        const bodyText = await page.locator("body").innerText();
        record("demo credentials dialog is visible", bodyText.includes("Demo Account Ready"), "");

        // Check that isDemo is true in Redux
        const state = await getReduxState(page);
        record("Redux state has isDemo=true", state?.app?.isDemo === true, `app.isDemo=${state?.app?.isDemo}`);

        // Verify the demo account is logged in via API
        const profile = await api("GET", "/api/users/profile", { token });
        record("demo account can fetch own profile", profile.status === 200 && !!profile.data?._id, `status=${profile.status}`);

        // Add a product to the cart
        const productId = await addProductToCart(page);
        record("add product to cart from /store", !!productId, `productId=${productId}`);

        // Open cart
        await page.goto(`${BASE}/store/cart`, { waitUntil: "networkidle" });
        await page.waitForTimeout(2000);
        const cartUrl = page.url();
        record("cart page loads", cartUrl.includes("/store/cart"), `url=${cartUrl.replace(BASE, "")}`);

        // Click "Proceed to Checkout"
        const checkoutBtn = page.locator('button:has-text("Proceed to Checkout")');
        const checkoutCount = await checkoutBtn.count();
        const hasCheckout = checkoutCount > 0;
        record("Proceed to Checkout button is visible on cart", hasCheckout, `count=${checkoutCount}`);

        if (hasCheckout) {
            // Direct DOM click — Playwright's .click({ force: true }) sometimes
            // doesn't fire the React onClick properly on these buttons
            // (the MUI Button with animation re-renders during the click).
            const clicked = await page.evaluate(() => {
                const buttons = document.querySelectorAll('button');
                const btn = Array.from(buttons).find((b) => b.textContent.trim() === 'Proceed to Checkout' && !b.disabled);
                if (!btn) return false;
                btn.click();
                return true;
            });
            // Next.js client-side routing — wait for the URL to change.
            // We poll manually because router.push doesn't fire a network
            // navigation event, so page.waitForURL is flaky.
            let checkoutUrl = page.url();
            for (let i = 0; i < 20; i++) {
                await page.waitForTimeout(500);
                checkoutUrl = page.url();
                if (checkoutUrl.includes("/store/shipping")) break;
            }
            record("checkout navigates to /store/shipping", checkoutUrl.includes("/store/shipping"), `url=${checkoutUrl.replace(BASE, "")}`);

            // Fill shipping form
            await fillShippingForm(page);
            record("shipping form filled and submitted to /store/payment-selection", page.url().includes("/store/payment-selection"), `url=${page.url().replace(BASE, "")}`);

            // Check that stripe is pre-selected (because isDemo = true)
            const stripeChecked = await page.locator('input[value="stripe"]:checked').count() > 0;
            record("payment selection has Stripe pre-selected in demo mode", stripeChecked);

            // Check paypal is disabled
            const paypalDisabled = await page.locator('input[value="paypal"][disabled]').count() > 0;
            record("PayPal is disabled in demo mode", paypalDisabled);

            // Continue
            await page.evaluate(() => {
                const buttons = document.querySelectorAll('button');
                const btn = Array.from(buttons).find((b) => b.textContent.trim() === 'Continue' && b.type === 'submit');
                if (btn) btn.click();
            });
            // Wait for navigation to /store/checkout
            let chkUrl = page.url();
            for (let i = 0; i < 20; i++) {
                await page.waitForTimeout(500);
                chkUrl = page.url();
                if (chkUrl.includes("/store/checkout")) break;
            }
            record("payment submission navigates to /store/checkout", chkUrl.includes("/store/checkout"), `url=${chkUrl.replace(BASE, "")}`);

            // Place order
            await page.waitForTimeout(2000);
            const placeOrderBtn = page.locator('button:has-text("Place Order")');
            const placeOrderCount = await placeOrderBtn.count();
            if (placeOrderCount > 0) {
                // Direct DOM click to bypass the shimmer animation
                await page.evaluate(() => {
                    const buttons = document.querySelectorAll('button');
                    const btn = Array.from(buttons).find((b) => b.textContent.includes("Place Order"));
                    if (btn) btn.click();
                });
                // Wait for navigation to /store/checkout/[orderId]
                let placeOrderUrl = page.url();
                for (let i = 0; i < 20; i++) {
                    await page.waitForTimeout(500);
                    placeOrderUrl = page.url();
                    if (/\/store\/checkout\/[a-f0-9-]+/.test(placeOrderUrl) && !placeOrderUrl.endsWith("/store/checkout")) break;
                }
                record("place order redirects to /store/checkout/[orderId]", /\/store\/checkout\/[a-f0-9-]+/.test(placeOrderUrl), `url=${placeOrderUrl.replace(BASE, "")}`);
                await page.waitForTimeout(2000);

                // Should see "One-Click Demo Payment (Stripe)" button
                const oneClickBtn = page.locator('button:has-text("One-Click Demo Payment")');
                const hasOneClick = await oneClickBtn.count() > 0;
                record("One-Click Demo Payment button is visible in demo mode", hasOneClick);

                if (hasOneClick) {
                    await page.evaluate(() => {
                        const buttons = document.querySelectorAll('button');
                        const btn = Array.from(buttons).find((b) => b.textContent.includes("One-Click Demo Payment"));
                        if (btn) btn.click();
                    });
                    // Wait for payment to process
                    await page.waitForTimeout(3000);
                    // Check for "Paid" status
                    const paidChip = await page.locator('text=/Paid/i').count();
                    const trackBtn = await page.locator('button:has-text("Track Order")').count();
                    const receiptBtn = await page.locator('button:has-text("View Receipt")').count();
                    record("one-click demo payment shows paid status", paidChip > 0 || trackBtn > 0 || receiptBtn > 0, `paidChip=${paidChip} trackBtn=${trackBtn} receiptBtn=${receiptBtn}`);

                    // Get the order id from URL and verify via API
                    const orderIdMatch = page.url().match(/\/store\/checkout\/([a-f0-9-]+)/);
                    if (orderIdMatch) {
                        const orderId = orderIdMatch[1];
                        const orderCheck = await api("GET", `/api/orders/${orderId}`, { token });
                        record("order shows isPaid=true after demo payment", orderCheck.data?.isPaid === true, `isPaid=${orderCheck.data?.isPaid}`);
                    }
                }
            } else {
                record("place order button is visible", false, "button not found");
            }
        }

        // Test that isDemo persists across page navigation
        await page.goto(`${BASE}/store`, { waitUntil: "networkidle" });
        const stateAfterNav = await getReduxState(page);
        record("isDemo stays true after page navigation", stateAfterNav?.app?.isDemo === true, `app.isDemo=${stateAfterNav?.app?.isDemo}`);

        // Test that closing the dialog doesn't reset isDemo
        const closeBtn = page.locator('button[aria-label="close"], .MuiDialog-root button:has(svg[data-testid="CloseIcon"])').first();
        if (await closeBtn.count() > 0) {
            await closeBtn.click({ force: true }).catch(() => {});
            await page.waitForTimeout(2000);
            const stateAfterClose = await getReduxState(page);
            record("isDemo stays true after closing the dialog", stateAfterClose?.app?.isDemo === true, `app.isDemo=${stateAfterClose?.app?.isDemo}`);
        }

        await browser.close();
    }

    // ============================================================
    // 2. SELLER FLOW: signin, add product, manage orders
    // ============================================================
    console.log("\n=== 2. SELLER: dashboard + product management ===");
    {
        const browser = await chromium.launch();
        const ctx = await browser.newContext();
        const page = await ctx.newPage();

        // Sign in as seller
        await page.goto(`${BASE}/signin`, { waitUntil: "networkidle" });
        await page.fill('input[name="email"]', sellerEmail);
        await page.fill('input[name="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL((u) => !u.toString().endsWith("/signin"), { timeout: 15000 });
        record("seller signin via UI", true, `landed at ${page.url().replace(BASE, "")}`);

        // Verify isDemo is false (regular seller signin)
        const sellerState = await getReduxState(page);
        record("seller signin keeps isDemo=false (regular signin)", sellerState?.app?.isDemo === false, `app.isDemo=${sellerState?.app?.isDemo}`);

        // Navigate to seller dashboard
        await page.goto(`${BASE}/seller/dashboard`, { waitUntil: "networkidle" });
        await page.waitForTimeout(2000);
        const dashUrl = page.url();
        record("seller lands on /seller/dashboard", dashUrl.includes("/seller/dashboard"), `url=${dashUrl.replace(BASE, "")}`);

        // Seller dashboard uses Redux state to switch sections
        // (overview / products / orders / profile). Click "Products" first.
        const productsSidebar = page.locator('text=/^Products$/i').first();
        if (await productsSidebar.count() > 0) {
            await productsSidebar.click({ force: true });
            await page.waitForTimeout(1500);
            const state = await getReduxState(page);
            record("clicking 'Products' switches seller section to 'products'", state?.seller?.section === "products", `section=${state?.seller?.section}`);
        }

        // Look for "Add Product" button
        const addProdBtn = page.locator('button:has-text("Add Product"), button:has-text("Add New Product"), a:has-text("Add Product")');
        const hasAddProd = await addProdBtn.count();
        record("Add Product button is visible on seller products section", hasAddProd > 0, `count=${hasAddProd}`);

        if (hasAddProd > 0) {
            await addProdBtn.first().click({ force: true });
            await page.waitForTimeout(2000);

            // The form is in a dialog. Fill the form.
            const prodName = `${TEST_PREFIX}SellerProduct_${SUFFIX}`;
            const nameField = page.locator('input[name="name"]').first();
            if (await nameField.count() > 0) {
                await nameField.fill(prodName);
            }
            const brandField = page.locator('input[name="brand"]');
            if (await brandField.count() > 0) await brandField.fill("TestBrand");
            const categoryField = page.locator('input[name="category"]');
            if (await categoryField.count() > 0) await categoryField.fill("Electronics");
            const priceField = page.locator('input[name="price"]');
            if (await priceField.count() > 0) await priceField.fill("99.99");
            const stockField = page.locator('input[name="countInStock"]');
            if (await stockField.count() > 0) await stockField.fill("10");
            const descField = page.locator('textarea[name="description"]');
            if (await descField.count() > 0) await descField.fill("Test product description for e2e test");

            // Submit
            const submitBtn = page.locator('button[type="submit"]:has-text("Add"), button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")').first();
            await submitBtn.click({ force: true });
            await page.waitForTimeout(3000);

            // Verify the product was created via API
            const productsList = await api("GET", "/api/sellers/products", { token: sellerToken });
            const created = (productsList.data || []).find((p) => p.name === prodName);
            record("seller can create a new product", !!created, `name=${prodName} found=${!!created}`);
        }

        // View seller orders
        const ordersSidebar = page.locator('text=/^Orders$/i').first();
        if (await ordersSidebar.count() > 0) {
            await ordersSidebar.click({ force: true });
            await page.waitForTimeout(1500);
            const state = await getReduxState(page);
            record("clicking 'Orders' switches seller section to 'orders'", state?.seller?.section === "orders", `section=${state?.seller?.section}`);
        }

        await browser.close();
    }

    // ============================================================
    // 3. ADMIN FLOW: signin, manage everything
    // ============================================================
    console.log("\n=== 3. ADMIN: user/product/order management ===");
    {
        const browser = await chromium.launch();
        const ctx = await browser.newContext();
        const page = await ctx.newPage();

        // Sign in as admin
        await page.goto(`${BASE}/signin`, { waitUntil: "networkidle" });
        await page.fill('input[name="email"]', adminEmail);
        await page.fill('input[name="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL((u) => !u.toString().endsWith("/signin"), { timeout: 15000 });
        record("admin signin via UI", true, `landed at ${page.url().replace(BASE, "")}`);

        // Navigate to admin dashboard
        await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
        await page.waitForTimeout(2000);
        record("admin lands on /admin", page.url().includes("/admin"), `url=${page.url().replace(BASE, "")}`);

        // The admin dashboard uses Redux state to switch sections
        // (Products / Users / Orders / Support). Click the sidebar items
        // and verify the right section content shows up.
        const adminStateBefore = await getReduxState(page);
        const sectionBefore = adminStateBefore?.admin?.section || "dashboard";
        record("admin section starts as 'dashboard' or 'summary'", ["dashboard", "summary"].includes(sectionBefore), `section=${sectionBefore}`);

        // Click "Users" in the sidebar
        const usersItem = page.locator('text=/^Users$/i').first();
        if (await usersItem.count() > 0) {
            await usersItem.click({ force: true });
            await page.waitForTimeout(1500);
            const state = await getReduxState(page);
            record("clicking 'Users' switches admin section to 'users'", state?.admin?.section === "users", `section=${state?.admin?.section}`);
        } else {
            record("admin sidebar has 'Users' item", false, "not found");
        }

        // Click "Products" in the sidebar
        const productsItem = page.locator('text=/^Products$/i').first();
        if (await productsItem.count() > 0) {
            await productsItem.click({ force: true });
            await page.waitForTimeout(1500);
            const state = await getReduxState(page);
            record("clicking 'Products' switches admin section to 'products'", state?.admin?.section === "products", `section=${state?.admin?.section}`);
        } else {
            record("admin sidebar has 'Products' item", false, "not found");
        }

        // Click "Orders" in the sidebar
        const ordersItem = page.locator('text=/^Orders$/i').first();
        if (await ordersItem.count() > 0) {
            await ordersItem.click({ force: true });
            await page.waitForTimeout(1500);
            const state = await getReduxState(page);
            record("clicking 'Orders' switches admin section to 'orders'", state?.admin?.section === "orders", `section=${state?.admin?.section}`);
        } else {
            record("admin sidebar has 'Orders' item", false, "not found");
        }

        // Check the API: admin can list all users
        const users = await api("GET", "/api/users", { token: adminToken });
        record("admin can list all users via API", users.status === 200 && Array.isArray(users.data), `status=${users.status} count=${users.data?.length}`);

        // Check the API: admin can list all orders
        const orders = await api("GET", "/api/orders", { token: adminToken });
        record("admin can list all orders via API", orders.status === 200 && Array.isArray(orders.data), `status=${orders.status} count=${orders.data?.length}`);

        await browser.close();
    }

    // === Cleanup ===
    console.log("\n=== CLEANUP: removing test data ===");
    try {
        // Delete the test orders first
        const testOrders = await sql`SELECT id FROM orders WHERE shipping_full_name LIKE ${TEST_PREFIX + "%Customer_" + SUFFIX + "%"} OR shipping_full_name LIKE ${TEST_PREFIX + "John Demo%" + SUFFIX + "%"} OR shipping_full_name LIKE ${TEST_PREFIX + "Sarah Demo%" + SUFFIX + "%"} OR shipping_full_name LIKE ${TEST_PREFIX + "Mike Demo%" + SUFFIX + "%"} OR shipping_full_name LIKE ${TEST_PREFIX + "Emma Demo%" + SUFFIX + "%"}`;
        for (const o of testOrders) {
            await sql`DELETE FROM order_items WHERE "order_id" = ${o.id}`;
            await sql`DELETE FROM orders WHERE id = ${o.id}`;
        }
        console.log(`  test orders: ${testOrders.length}`);

        // Delete the test products
        const testProducts = await sql`SELECT id FROM products WHERE name LIKE ${TEST_PREFIX + "%SellerProduct_" + SUFFIX + "%"}`;
        for (const p of testProducts) {
            await sql`DELETE FROM order_items WHERE product_id = ${p.id}`;
            await sql`DELETE FROM products WHERE id = ${p.id}`;
        }
        console.log(`  test products: ${testProducts.length}`);

        // Delete sellers
        const sellerRow = await sql`SELECT id FROM sellers WHERE store_name = ${sellerStoreName}`;
        for (const s of sellerRow) {
            await sql`DELETE FROM sellers WHERE id = ${s.id}`;
        }
        console.log(`  test sellers: ${sellerRow.length}`);

        // Delete users
        const usersDeleted = await sql`DELETE FROM users WHERE email = ${customerEmail} OR email = ${sellerEmail} OR email = ${adminEmail}`;
        console.log(`  test users: ${usersDeleted.count}`);
    } catch (e) {
        console.log(`  cleanup error: ${e.message}`);
    }

    await sql.end();

    console.log("\n════════════════════════════════════════════");
    console.log(`  Browser E2E (Role-based purchase flow)`);
    console.log(`  Passed: ${pass}`);
    console.log(`  Failed: ${fail}`);
    if (fail > 0) {
        console.log(`\n  Failures:`);
        for (const f of failures) {
            console.log(`    ❌ ${f.name} — ${f.detail}`);
        }
    }
    console.log("════════════════════════════════════════════");
    process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
