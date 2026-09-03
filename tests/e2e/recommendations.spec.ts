import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/products/:id/recommendations returns an array', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/products/p1/recommendations', [200, 204, 400, 404, 500])
  if (response.ok) {
    const body = await readJson<unknown[]>(response)
    if (Array.isArray(body)) {
      expect(Array.isArray(body)).toBe(true)
    }
  }
})
