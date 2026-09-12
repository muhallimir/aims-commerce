import { signatureRule } from "@lib/services/tracking-signature"

describe("tracking-signature", () => {
  it("requires signature for high totals", () => {
    const res = signatureRule(600, "books")
    expect(res.required).toBe(true)
    expect(res.reason).toMatch(/threshold/)
  })

  it("requires signature for electronics and skips books", () => {
    expect(signatureRule(50, "electronics").required).toBe(true)
    expect(signatureRule(50, "books").required).toBe(false)
  })
})
