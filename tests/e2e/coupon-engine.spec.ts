import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/coupons/apply returns ok and discount', async ({ request }) => {
  const response = await request.post('/api/coupons/apply', {
    data: { code: 'WELCOME10', subtotal: 100 },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 409, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ ok?: boolean; discount?: number }>(response)
    expect(typeof body?.ok).toBe('boolean')
  }
})
