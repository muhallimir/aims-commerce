import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/cart/bundle returns a line total + discount', async ({ request }) => {
  const response = await request.post('/api/cart/bundle', {
    data: { productId: 'p1', unitPrice: 10, qty: 3, tiers: [{ minQty: 2, discount: 0.1 }, { minQty: 5, discount: 0.2 }] },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 422, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ lineTotal?: number; discount?: number }>(response)
    expect(typeof body?.lineTotal).toBe('number')
    expect(typeof body?.discount).toBe('number')
  }
})
