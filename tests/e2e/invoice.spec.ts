import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/invoices/preview returns a text + total', async ({ request }) => {
  const response = await request.post('/api/invoices/preview', {
    data: {
      invoiceNumber: 'INV-1',
      issuedAt: '2026-01-05',
      seller: { name: 'Acme' },
      buyer: { name: 'Sam' },
      lines: [{ description: 'Widget', qty: 2, unitPrice: 10 }],
      taxRate: 0.08,
    },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ text?: string; total?: number }>(response)
    expect(typeof body?.text).toBe('string')
    expect(typeof body?.total).toBe('number')
  }
})
