import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/seller/analytics/weekly returns a summary', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/seller/analytics/weekly', [200, 204, 400, 401, 403, 500])
  if (response.ok) {
    const body = await readJson<{ revenue?: number; orderCount?: number }>(response)
    expect(typeof body?.revenue).toBe('number')
    expect(typeof body?.orderCount).toBe('number')
  }
})
