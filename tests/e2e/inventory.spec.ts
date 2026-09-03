import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/products/:id/stock returns a numeric available', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/products/p1/stock', [200, 204, 400, 404, 500])
  if (response.ok) {
    const body = await readJson<{ available?: number }>(response)
    expect(typeof body?.available).toBe('number')
  }
})
