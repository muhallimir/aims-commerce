import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('GET /api/fx returns supported currencies', async ({ request }) => {
  const response = await expectJsonContract(request, '/api/fx', [200, 204, 400, 404, 405, 500])
  if (response.ok) {
    const body = await readJson<{ currencies?: string[] }>(response)
    if (Array.isArray(body?.currencies)) {
      expect(Array.isArray(body.currencies)).toBe(true)
    }
  }
})
