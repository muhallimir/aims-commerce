import { rentalQuote } from "@lib/services/rental-price"

describe("rentalQuote", () => {
  it("computes weekly + daily fee plus deposit", () => {
    const r = rentalQuote(200, 7, 0.2)
    expect(r.rentalFee).toBeCloseTo(200 * 0.05 * 1 + 200 * 0.01 * 7, 5)
    expect(r.deposit).toBe(40)
    expect(r.total).toBeCloseTo(r.rentalFee + r.deposit, 5)
  })

  it("rounds up partial weeks", () => {
    const oneWeek = rentalQuote(100, 7, 0)
    const eightDays = rentalQuote(100, 8, 0)
    expect(eightDays.rentalFee).toBeGreaterThan(oneWeek.rentalFee)
    expect(eightDays.deposit).toBe(0)
  })
})
