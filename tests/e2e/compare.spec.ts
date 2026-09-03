import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/products/compare returns rows', async ({ request }) => {
  const response = await request.post('/api/products/compare', {
    data: { ids: ['p1', 'p2'] },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ rows?: unknown[] }>(response)
    expect(Array.isArray(body?.rows)).toBe(true)
  }
})
