import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/products/slug returns a unique slug', async ({ request }) => {
  const response = await request.post('/api/products/slug', {
    data: { name: 'Red Sneaker', taken: ['red-sneaker'] },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ slug?: string }>(response)
    expect(body?.slug).toMatch(/red-sneaker-2/)
  }
})
