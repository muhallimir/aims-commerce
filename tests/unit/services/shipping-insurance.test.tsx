import { insuranceQuote } from "@lib/services/shipping-insurance"

describe("insuranceQuote", () => {
  it("enforces the minimum fee", () => {
    const q = insuranceQuote(10, false, false)
    expect(q.fee).toBe(1.99)
    expect(q.covers).toMatch(/Up to/)
  })
  it("adds fragile and international surcharges", () => {
    const q = insuranceQuote(100, true, true)
    expect(q.fee).toBeCloseTo(6.2, 2)
    expect(q.covers).toMatch(/fragile/)
  })
})
