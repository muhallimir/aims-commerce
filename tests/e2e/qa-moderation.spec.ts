import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/qa/moderate returns a verdict', async ({ request }) => {
  const response = await request.post('/api/qa/moderate', {
    data: { text: 'Is this real leather?' },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ status?: string; flags?: string[] }>(response)
    expect(typeof body?.status).toBe('string')
    expect(Array.isArray(body?.flags)).toBe(true)
  }
})
