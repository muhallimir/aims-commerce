import { ecoPackage } from "@lib/services/eco-packaging"

describe("ecoPackage", () => {
  it("selects reusable for more than 5 items with surcharge", () => {
    const r = ecoPackage(6, false)
    expect(r.option).toBe("reusable")
    expect(r.fee).toBeCloseTo(6 * 0.4 + 2, 5)
  })

  it("selects compostable for non-fragile small orders", () => {
    const r = ecoPackage(3, false)
    expect(r.option).toBe("compostable")
    expect(r.fee).toBeCloseTo(1.2, 5)
  })

  it("selects recycled for fragile small orders", () => {
    const r = ecoPackage(2, true)
    expect(r.option).toBe("recycled")
    expect(r.fee).toBeCloseTo(0.8, 5)
  })
})
