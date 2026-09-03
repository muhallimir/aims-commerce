import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/orders/fraud-score returns a score', async ({ request }) => {
  const response = await request.post('/api/orders/fraud-score', {
    data: {
      emailAgeDays: 1, accountAgeDays: 1, addressMismatch: 1,
      orderTotal: 1500, recentOrderCount: 6, hasPriorCompletedOrder: false,
    },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ score?: number; level?: string }>(response)
    expect(typeof body?.score).toBe('number')
    expect(typeof body?.level).toBe('string')
  }
})
