import { expect, test } from '@playwright/test'
import { gotoPublic, waitForHydration } from './support/helpers'

test.describe('smoke: public surfaces render', () => {
  test('landing page renders with a document title', async ({ page }) => {
    const response = await gotoPublic(page, '/')
    expect(response!.status()).toBeLessThan(500)
    await waitForHydration(page)
    await expect(page).toHaveTitle(/.+/)
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
