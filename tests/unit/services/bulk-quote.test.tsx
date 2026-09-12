import { bulkQuote } from "@lib/services/bulk-quote"

describe("bulkQuote", () => {
  it("applies 20% discount for qty >= 100", () => {
    const r = bulkQuote(10, 100)
    expect(r.discountPct).toBe(20)
    expect(r.total).toBe(800)
    expect(r.tier).toBe("100+")
  })

  it("applies no discount below 10 units", () => {
    const r = bulkQuote(10, 5)
    expect(r.discountPct).toBe(0)
    expect(r.total).toBe(50)
  })

  it("applies 10% discount for qty >= 20", () => {
    const r = bulkQuote(25, 20)
    expect(r.discountPct).toBe(10)
    expect(r.total).toBe(450)
  })
})
