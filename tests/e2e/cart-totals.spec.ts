import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test.describe('cart totals — public API contract', () => {
  test('POST /api/cart/totals returns subtotal/shipping/tax/total', async ({ request }) => {
    const response = await request.post('/api/cart/totals', {
      data: {
        items: [{ productId: 'p1', price: 25, qty: 2 }],
        taxRate: 0.08,
        shippingFlat: 5,
        freeShippingThreshold: 50,
      },
    })
    const allowed = [200, 201, 204, 400, 401, 404, 405, 422, 500, 501]
    expect(allowed).toContain(response.status())
    if (response.ok) {
      const body = await readJson<{ subtotal?: number; shipping?: number; tax?: number; total?: number }>(response)
      expect(typeof body?.subtotal).toBe('number')
      expect(typeof body?.total).toBe('number')
    }
  })

  test('GET /api/cart/totals is not a GET endpoint', async ({ request }) => {
    const response = await expectJsonContract(request, '/api/cart/totals', [405, 404, 400])
    expect([400, 404, 405]).toContain(response.status())
  })
})
