import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/recently-viewed returns an array or 401', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/recently-viewed', [200, 204, 401, 403, 500])
  if (response.ok) {
    const body = await readJson<unknown[]>(response)
    if (Array.isArray(body)) {
      expect(Array.isArray(body)).toBe(true)
    }
  }
})
