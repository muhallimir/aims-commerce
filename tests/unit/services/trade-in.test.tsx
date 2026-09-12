import { tradeInCredit } from "@lib/services/trade-in"

describe("tradeInCredit", () => {
  it("computes mint phone credit with no depreciation", () => {
    const r = tradeInCredit("phone", "mint", 0)
    expect(r.credit).toBe(180)
    expect(r.note).toMatch(/phone/)
  })

  it("floors age depreciation at 0.2 and discounts poor condition", () => {
    const r = tradeInCredit("laptop", "poor", 20)
    expect(r.credit).toBeCloseTo(350 * 0.2 * 0.2, 5)
    expect(r.note).toMatch(/poor/)
  })
})
