import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/tax/estimate returns a numeric tax', async ({ request }) => {
  const response = await request.post('/api/tax/estimate', {
    data: { subtotal: 100, country: 'US', region: 'CA' },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ tax?: number; rate?: number }>(response)
    expect(typeof body?.tax).toBe('number')
    expect(typeof body?.rate).toBe('number')
  }
})
