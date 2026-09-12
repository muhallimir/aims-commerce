import { warrantyQuote } from "@lib/services/warranty"

describe("warrantyQuote", () => {
  it("quotes 1 year at 8 percent", () => {
    const q = warrantyQuote(100, 1)
    expect(q.premium).toBeCloseTo(8, 2)
    expect(q.coverage).toContain("Parts")
  })
  it("quotes 3 years at 19 percent with extended coverage", () => {
    const q = warrantyQuote(200, 3)
    expect(q.premium).toBeCloseTo(38, 2)
    expect(q.coverage).toContain("On-site service")
  })
})
