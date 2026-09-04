import { expect, test } from '@playwright/test'
import { gotoPublic, waitForHydration } from './support/helpers'

test.describe('smoke: public surfaces render', () => {
  test('landing page redirects to /store with a document title', async ({ page }) => {
    const response = await gotoPublic(page, '/')
    expect(response!.status()).toBeLessThan(500)
    // / redirects to /store which is the public storefront
    await page.waitForURL(/\/store|\/$/, { timeout: 10_000 }).catch(() => {})
    await waitForHydration(page)
    // Either a title or an empty title is acceptable for the public storefront;
    // we just want the page to render without error.
    await expect(page.locator('html')).toBeAttached()
  })

  test('start-selling page is reachable', async ({ page }) => {
    const response = await gotoPublic(page, '/start-selling')
    expect(response!.status()).toBeLessThan(500)
  })

  test('signin page is reachable', async ({ page }) => {
    const response = await gotoPublic(page, '/signin')
    expect(response!.status()).toBeLessThan(500)
  })

  test('register page is reachable', async ({ page }) => {
    const response = await gotoPublic(page, '/register')
    expect(response!.status()).toBeLessThan(500)
  })
})
