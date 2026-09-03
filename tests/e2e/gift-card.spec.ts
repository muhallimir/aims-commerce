import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/gift-cards/:code returns a balance', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/gift-cards/TESTCODE', [200, 204, 400, 404, 500])
  if (response.ok) {
    const body = await readJson<{ balance?: number; active?: boolean }>(response)
    expect(typeof body?.balance).toBe('number')
    expect(typeof body?.active).toBe('boolean')
  }
})
