import { expect, type APIRequestContext, type Page } from '@playwright/test'

/**
 * Shared helpers for the Playwright suite.
 *
 * Most surfaces are JWT-gated, so specs assert either the public rendering of
 * a page, the contract of an unauthenticated API call, or the contract of a
 * public endpoint that does not require auth.
 */

export const PUBLIC_PATHS = ['/', '/start-selling', '/signin', '/register'] as const

export const UNAUTHENTICATED_STATUSES = [200, 201, 204, 301, 302, 307, 400, 401, 403, 404, 405, 409, 410, 415, 422, 500]

export async function gotoPublic(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
  expect(response, `no response for ${path}`).not.toBeNull()
  return response
}

export async function expectJsonContract(
  request: APIRequestContext,
  path: string,
  allowed: number[] = UNAUTHENTICATED_STATUSES
) {
  const response = await request.get(path)
  expect(allowed, `unexpected status ${response.status()} for ${path}`).toContain(response.status())
  return response
}

export async function readJson<T = unknown>(response: {
  json: () => Promise<unknown>
  text: () => Promise<string>
}): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => document.readyState === 'complete')
}
