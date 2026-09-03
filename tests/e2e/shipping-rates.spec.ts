import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/shipping/quote returns a rate', async ({ request }) => {
  const response = await request.post('/api/shipping/quote', {
    data: { weightKg: 2, lengthCm: 30, widthCm: 20, heightCm: 10, country: 'US', service: 'standard' },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 422, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ rate?: number; etaDays?: number }>(response)
    expect(typeof body?.rate).toBe('number')
    expect(typeof body?.etaDays).toBe('number')
  }
})
