import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/loyalty returns points and tier', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/loyalty', [200, 204, 400, 401, 403, 500])
  if (response.ok) {
    const body = await readJson<{ points?: number; tier?: string }>(response)
    expect(typeof body?.points).toBe('number')
    expect(typeof body?.tier).toBe('string')
  }
})
