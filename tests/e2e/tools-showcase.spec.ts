/**
 * End-to-end verification of the aims-commerce /tools showcase.
 * 30 features, every one hit by the live API and rendered in the browser.
 */
import { test, expect } from '@playwright/test'

const FEATURES = [
  'cart-totals', 'coupon-engine', 'wishlist', 'product-search', 'recommendations',
  'review-summary', 'inventory', 'order-status', 'shipping-rates', 'fx',
  'seller-payout', 'bundle-pricing', 'recently-viewed', 'low-stock', 'product-slug',
  'refund-policy', 'invoice', 'gift-card', 'loyalty', 'address-validate',
  'compare', 'abandoned-cart', 'variants', 'tax', 'csv',
  'analytics-weekly', 'price-alert', 'delivery-eta', 'fraud-score', 'qa-moderation',
]

test('tools page renders all 30 feature cards with no fatal console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })

  await page.goto('/tools', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('tools-page')).toBeVisible()
  await expect(page.getByRole('heading', { name: /tools showcase/i })).toBeVisible()

  for (const id of FEATURES) {
    await expect(page.getByTestId(`card-${id}`), `missing card: ${id}`).toBeVisible()
    await expect(page.getByTestId(`run-${id}`), `missing run button: ${id}`).toBeVisible()
  }
  const fatal = errors.filter((e) =>
    !e.includes('Download the React DevTools') &&
    !e.includes('favicon') &&
    !e.includes('webpack-hmr') &&
    !e.includes('WebSocket') &&
    !e.includes('Failed to load resource') &&
    !e.includes('hydration') &&
    !e.includes('preloaded')
  )
  expect(fatal, `page errors: ${fatal.join(' | ')}`).toHaveLength(0)
})

test('every feature API returns 200 with a non-empty result', async ({ request }) => {
  for (const id of FEATURES) {
    const response = await request.post(`/api/tools/${id}`, { data: {} })
    expect(response.status(), `bad status for ${id}: ${response.status()}`).toBe(200)
    const body = await response.json()
    expect(body.tool, `missing tool field for ${id}`).toBe(id)
    expect(body.ok, `tool ${id} returned ok=false: ${JSON.stringify(body)}`).toBe(true)
    expect(body.result, `tool ${id} returned no result: ${JSON.stringify(body)}`).toBeDefined()
  }
})

test('unknown tool returns 404 with the catalog', async ({ request }) => {
  const response = await request.get('/api/tools/this-does-not-exist')
  expect(response.status()).toBe(404)
  const body = await response.json()
  expect(body.error).toBe('unknown_tool')
  expect(body.available).toHaveLength(30)
})

test('running a feature in the browser drives the API and renders a preview', async ({ page }) => {
  await page.goto('/tools', { waitUntil: 'networkidle' })
  // Wait for React hydration: the first Run button must have a click handler
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('[data-testid="run-cart-totals"]')
      if (!btn) return false
      const keys = Object.keys(btn)
      return keys.some((k) => k.startsWith('__reactProps'))
    },
    { timeout: 30_000 },
  )

  for (const id of FEATURES.slice(0, 5)) {
    await page.evaluate((testid) => {
      const el = document.querySelector('[data-testid="' + testid + '"]')
      if (el) (el).click()
    }, 'run-' + id)
    await expect(page.getByTestId('payload-' + id), `no payload for ${id}`).toBeVisible({ timeout: 15_000 })
    const text = await page.getByTestId('payload-' + id).textContent()
    expect(text, `empty payload for ${id}`).toContain('"ok": true')
  }
})
