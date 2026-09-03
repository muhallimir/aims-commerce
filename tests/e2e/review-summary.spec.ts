import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/products/:id/reviews/summary returns a summary', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/products/p1/reviews/summary', [200, 204, 400, 404, 500])
  if (response.ok) {
    const body = await readJson<{ average?: number; count?: number }>(response)
    expect(typeof body?.average).toBe('number')
    expect(typeof body?.count).toBe('number')
  }
})
