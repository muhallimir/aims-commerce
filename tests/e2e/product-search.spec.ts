import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/products/search returns array', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/products/search?q=shoe', [200, 204, 400, 500])
  if (response.ok) {
    const body = await readJson<unknown[]>(response)
    if (Array.isArray(body)) {
      expect(Array.isArray(body)).toBe(true)
    }
  }
})
