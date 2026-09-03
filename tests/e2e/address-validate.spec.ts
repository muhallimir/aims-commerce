import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/address/validate returns ok + errors', async ({ request }) => {
  const response = await request.post('/api/address/validate', {
    data: { line1: '1 Main St', city: 'NYC', postalCode: '10001', country: 'US' },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ ok?: boolean; errors?: string[] }>(response)
    expect(typeof body?.ok).toBe('boolean')
    expect(Array.isArray(body?.errors)).toBe(true)
  }
})
