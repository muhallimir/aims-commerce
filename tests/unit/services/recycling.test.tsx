import { recyclingCredit } from "@lib/services/recycling"

describe("recyclingCredit", () => {
  it("credits a sofa in good condition with free pickup", () => {
    const r = recyclingCredit("sofa", "good")
    expect(r.credit).toBe(25)
    expect(r.pickupFree).toBe(true)
  })
  it("applies condition multiplier", () => {
    const r = recyclingCredit("fridge", "poor")
    expect(r.credit).toBeCloseTo(8, 2)
    expect(r.pickupFree).toBe(false)
  })
})
