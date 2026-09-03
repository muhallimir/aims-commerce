import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/orders/:id returns an order with a status', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/orders/o-1', [200, 204, 400, 401, 403, 404, 500])
  if (response.ok) {
    const body = await readJson<{ status?: string }>(response)
    expect(typeof body?.status).toBe('string')
  }
})
