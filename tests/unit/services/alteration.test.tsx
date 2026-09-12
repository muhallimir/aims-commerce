import { alterationQuote } from "@lib/services/alteration"

describe("alterationQuote", () => {
  it("sums job prices", () => {
    const q = alterationQuote("jeans", ["hem", "zip"])
    expect(q.total).toBe(27)
    expect(q.days).toBe(4)
  })
  it("handles empty jobs", () => {
    const q = alterationQuote("jacket", [])
    expect(q.total).toBe(0)
    expect(q.days).toBe(2)
  })
})
