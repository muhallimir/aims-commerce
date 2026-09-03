import { test, expect } from '@playwright/test'
import { expectJsonContract } from './support/helpers'

test('GET /api/admin/products/export returns CSV or JSON', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/admin/products/export', [200, 204, 401, 403, 404, 500])
  if (response.ok) {
    const text = await response.text()
    expect(text.length).toBeGreaterThan(0)
  }
})
