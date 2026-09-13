/**
 * Contrast audit: sampled text from the new features must hit WCAG AA
 * against its effective background in BOTH themes.
 */
import { test, expect } from "@playwright/test";
import { contrastRatio } from "../helpers/contrast";

const PAGES: { url: string; selectors: string[]; seedCart?: boolean }[] = [
  {
    url: "/store",
    selectors: [
      '[data-testid="flash-sale-bar"]',
      '[data-testid="top-rated-name"]',
      '[data-testid="category-chip-All"]',
      '[data-testid="card-stock"]',
      '[data-testid="quick-view-open"]',
      '[data-testid="newsletter-signup"]',
    ],
  },
  { url: "/services/tracking", selectors: ['[data-testid="tracker-signin-prompt"]'] },
  { url: "/services/delivery", selectors: ['[data-testid="service-estimator"]', '[data-testid="service-slots"]'] },
  { url: "/services/returns", selectors: ['[data-testid="service-returns"]'] },
  { url: "/services/protection", selectors: ['[data-testid="service-insurance"]', '[data-testid="service-warranty"]'] },
  { url: "/services/home-services", selectors: ['[data-testid="service-assembly"]', '[data-testid="service-rental"]'] },
  { url: "/services/shopping", selectors: ['[data-testid="service-giftwrap"]', '[data-testid="service-bulk"]', '[data-testid="service-loyalty"]'] },
  { url: "/services/help", selectors: ['[data-testid="service-faq"]', '[data-testid="service-address"]'] },
  { url: "/wishlist", selectors: ['[data-testid="wishlist-page"]'] },
  { url: "/profile", selectors: ['[data-testid="address-book"]', '[data-testid="notify-prefs"]', '[data-testid="referral-card"]'] },
  { url: "/store/cart", selectors: ['[data-testid="free-shipping-bar"]', '[data-testid="gift-options"]'], seedCart: true },
];

for (const theme of ["light", "dark"]) {
  for (const { url, selectors, seedCart } of PAGES) {
    test(`contrast AA on ${url} in ${theme} mode`, async ({ page }) => {
      await page.addInitScript(
        ({ t, cart }: { t: string; cart: boolean }) => {
          const store: Record<string, string> = {
            app: JSON.stringify({ theme: t, loading: false, error: null, routeBack: false, transitioning: false, isDemo: false }),
          };
          if (cart) {
            store.cart = JSON.stringify({
              cartItems: [{ _id: "p1", name: "Cap", price: 20, quantity: 1, image: "", countInStock: 5 }],
              shippingAddress: [],
              paymentMethod: null,
              isCheckingOut: false,
            });
          }
          store._persist = JSON.stringify({ version: -1, rehydrated: true });
          localStorage.setItem("persist:root", JSON.stringify(store));
        },
        { t: theme, cart: Boolean(seedCart) }
      );
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      if (url === "/store") {
        await page.getByTestId("store-grid").waitFor({ timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(1500);
      }
      const failures: string[] = [];
      for (const sel of selectors) {
        const count = await page.locator(sel).count();
        if (count === 0) {
          failures.push(`${sel}: missing`);
          continue;
        }
        const sample: { text: string; fg: string; bg: string; size: number; weight: string }[] = await page
          .locator(sel)
          .first()
          .evaluate((el) => {
            const parse = (s: string): number[] => {
              const m = s.match(/rgba?\(([^)]+)\)/);
              if (!m) return [0, 0, 0, 1];
              return m[1].split(",").map((x) => parseFloat(x.trim()));
            };
            const compositeBg = (from: Element): string => {
              // Alpha-blend the ancestor chain over white.
              let r = 255, g = 255, b = 255;
              const chain: Element[] = [];
              let cur: Element | null = from;
              while (cur) {
                chain.unshift(cur);
                cur = cur.parentElement;
              }
              for (const node of chain) {
                const [br, bg2, bb, ba] = parse(getComputedStyle(node).backgroundColor);
                const a = ba ?? 1;
                r = br * a + r * (1 - a);
                g = bg2 * a + g * (1 - a);
                b = bb * a + b * (1 - a);
              }
              return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
            };
            const isDisabled = (from: Element): boolean => {
              let cur: Element | null = from;
              while (cur) {
                if ((cur as HTMLElement).tagName === "BUTTON" && (cur as HTMLButtonElement).disabled) return true;
                if (cur.getAttribute("aria-disabled") === "true") return true;
                cur = cur.parentElement;
              }
              return false;
            };
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const out: { text: string; fg: string; bg: string; size: number; weight: string }[] = [];
            let node: Node | null = walker.nextNode();
            while (node && out.length < 14) {
              const content = (node.textContent ?? "").trim();
              const parent = node.parentElement;
              if (content && parent) {
                const cs = getComputedStyle(parent);
                const rect = (parent as HTMLElement).getBoundingClientRect();
                if (cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.1 && rect.width > 0 && rect.height > 0 && !isDisabled(parent)) {
                  out.push({ text: content.slice(0, 60), fg: cs.color, bg: compositeBg(parent), size: parseFloat(cs.fontSize), weight: cs.fontWeight });
                }
              }
              node = walker.nextNode();
            }
            return out;
          });
        for (const t of sample) {
          const ratio = contrastRatio(t.fg, t.bg);
          const large = t.size >= 24 || (t.size >= 18.66 && parseInt(t.weight) >= 700);
          const min = large ? 3 : 4.5;
          if (ratio < min) {
            failures.push(`"${t.text}" ratio ${ratio.toFixed(2)} < ${min} (fg ${t.fg} on ${t.bg})`);
          }
        }
      }
      expect(failures, failures.join("\n")).toHaveLength(0);
    });
  }
}
