import { priceMatch } from "@lib/services/price-match"

describe("priceMatch", () => {
  it("approves eligible lower in-stock competitor prices", () => {
    const r = priceMatch(100, 80, "Amazon", true)
    expect(r.approved).toBe(true)
    expect(r.matchPrice).toBe(80)
    expect(r.reason).toMatch(/approved/i)
  })

  it("rejects ineligible competitors, out-of-stock, and higher prices", () => {
    expect(priceMatch(100, 80, "acme", true).approved).toBe(false)
    expect(priceMatch(100, 80, "amazon", false).approved).toBe(false)
    const higher = priceMatch(100, 120, "walmart", true)
    expect(higher.approved).toBe(false)
    expect(higher.matchPrice).toBeNull()
  })
})
