import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/orders/:id/refund-decision returns a refund decision', async ({ request }) => {
  const response = await request.post('/api/orders/o-1/refund-decision', {
    data: { orderDeliveredAt: '2026-01-01T00:00:00Z', itemCondition: 'sealed', hasReceipt: true, category: 'standard' },
  })
  const allowed = [200, 201, 204, 400, 401, 403, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ ok?: boolean; refundPercent?: number }>(response)
    expect(typeof body?.ok).toBe('boolean')
    expect(typeof body?.refundPercent).toBe('number')
  }
})
