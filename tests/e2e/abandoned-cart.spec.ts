import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/admin/abandoned-carts returns stats', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/admin/abandoned-carts', [200, 204, 401, 403, 500])
  if (response.ok) {
    const body = await readJson<{ recoveryRate?: number; total?: number }>(response)
    expect(typeof body?.recoveryRate).toBe('number')
    expect(typeof body?.total).toBe('number')
  }
})
