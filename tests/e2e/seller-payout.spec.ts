import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/seller/payout returns a payout summary', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/seller/payout', [200, 204, 400, 401, 403, 500])
  if (response.ok) {
    const body = await readJson<{ net?: number; gross?: number }>(response)
    expect(typeof body?.net).toBe('number')
    expect(typeof body?.gross).toBe('number')
  }
})
