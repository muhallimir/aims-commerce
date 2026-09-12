/**
 * E2E verification of the aims-commerce /services showcase.
 * 30 service features, every one hit by the live API and rendered.
 */
import { test, expect } from '@playwright/test'

const FEATURES = [
  'tracking-timeline', 'tracking-route', 'tracking-eta-live', 'tracking-checkpoints',
  'tracking-proof', 'tracking-exceptions', 'tracking-notify', 'tracking-signature',
  'pickup-points', 'delivery-slots',
  'gift-wrap', 'assembly', 'installation', 'recycling', 'warranty',
  'shipping-insurance', 'returns-pickup', 'alteration', 'engraving', 'subscription-saver',
  'bulk-quote', 'white-glove', 'carbon-offset', 'eco-packaging', 'concierge-match',
  'repair-estimate', 'rental-price', 'trade-in', 'price-match', 'service-coverage',
]

test('services page renders hero + all 30 feature cards with no fatal console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })

  await page.goto('/services', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('services-page')).toBeVisible()
  await expect(page.getByTestId('tracking-hero')).toBeVisible()
  await expect(page.getByTestId('hero-map')).toBeVisible()

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

test('every service API returns 200 with a non-empty result', async ({ request }) => {
  for (const id of FEATURES) {
    const response = await request.post(`/api/services/${id}`, { data: {} })
    expect(response.status(), `bad status for ${id}: ${response.status()}`).toBe(200)
    const body = await response.json()
    expect(body.service, `missing service field for ${id}`).toBe(id)
    expect(body.ok, `service ${id} returned ok=false: ${JSON.stringify(body)}`).toBe(true)
    expect(body.result, `service ${id} returned no result: ${JSON.stringify(body)}`).toBeDefined()
  }
})

test('unknown service returns 404 with the catalog', async ({ request }) => {
  const response = await request.get('/api/services/this-does-not-exist')
  expect(response.status()).toBe(404)
  const body = await response.json()
  expect(body.error).toBe('unknown_service')
  expect(body.available).toHaveLength(30)
})

test('running a service in the browser drives the API and renders a preview', async ({ page }) => {
  await page.goto('/services', { waitUntil: 'networkidle' })
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('[data-testid="run-tracking-timeline"]')
      if (!btn) return false
      const keys = Object.keys(btn)
      return keys.some((k) => k.startsWith('__reactProps'))
    },
    { timeout: 30_000 },
  )

  for (const id of ['tracking-timeline', 'tracking-route', 'tracking-eta-live', 'gift-wrap', 'bulk-quote']) {
    await page.evaluate((testid) => {
      const el = document.querySelector('[data-testid="' + testid + '"]')
      if (el) (el as HTMLElement).click()
    }, 'run-' + id)
    await expect(page.getByTestId('payload-' + id), `no payload for ${id}`).toBeVisible({ timeout: 15_000 })
    const text = await page.getByTestId('payload-' + id).textContent()
    expect(text, `empty payload for ${id}`).toContain('"ok": true')
  }
})
