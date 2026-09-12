import { engravingQuote } from "@lib/services/engraving"

describe("engravingQuote", () => {
  it("is free up to 10 chars", () => {
    const q = engravingQuote(8, "wood")
    expect(q.fee).toBe(0)
    expect(q.ok).toBe(true)
  })
  it("rejects over 50 chars and adds material fee", () => {
    const q = engravingQuote(51, "metal")
    expect(q.ok).toBe(false)
    expect(q.fee).toBeCloseTo(25.5, 1)
    expect(q.note).toMatch(/50/)
  })
})
