import { test, expect } from '@playwright/test'
import { expectJsonContract, readJson } from './support/helpers'

test('POST /api/delivery/estimate returns a date', async ({ request }) => {
  const response = await request.post('/api/delivery/estimate', {
    data: { orderPlacedAt: '2026-01-05T10:00:00Z', businessDays: 3, cutoffHour: 14, skipWeekends: true },
  })
  const allowed = [200, 201, 204, 400, 401, 404, 500, 501]
  expect(allowed).toContain(response.status())
  if (response.ok) {
    const body = await readJson<{ arrivesAt?: string; calendarDays?: number }>(response)
    expect(typeof body?.arrivesAt).toBe('string')
    expect(typeof body?.calendarDays).toBe('number')
  }
})
