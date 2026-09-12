import { liveEta } from "@lib/services/tracking-eta-live"

describe("tracking-eta-live", () => {
  it("returns base time unchanged when there is no delay", () => {
    const res = liveEta("2026-01-08T10:00:00.000Z", 0, 1)
    expect(res.addedMinutes).toBe(0)
    expect(res.onTime).toBe(true)
    expect(res.revisedAt).toBe("2026-01-08T10:00:00.000Z")
  })

  it("applies traffic factor and flags late arrivals", () => {
    const res = liveEta("2026-01-08T10:00:00.000Z", 30, 2)
    expect(res.addedMinutes).toBe(60)
    expect(res.onTime).toBe(false)
    expect(res.revisedAt).toBe("2026-01-08T11:00:00.000Z")
  })
})
