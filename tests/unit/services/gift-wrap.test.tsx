import { giftWrapQuote } from "@lib/services/gift-wrap"

describe("giftWrapQuote", () => {
  it("quotes standard wrap with no message fee", () => {
    const q = giftWrapQuote(2, false)
    expect(q.perItem).toBe(2.99)
    expect(q.subtotal).toBeCloseTo(5.98, 2)
    expect(q.messageFee).toBe(0)
    expect(q.total).toBeCloseTo(5.98, 2)
  })
  it("quotes premium wrap with long message fee", () => {
    const q = giftWrapQuote(1, true, "x".repeat(141))
    expect(q.perItem).toBe(4.99)
    expect(q.messageFee).toBe(1.99)
    expect(q.total).toBeCloseTo(6.98, 2)
  })
})
