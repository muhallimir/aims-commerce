import { carbonOffset } from "@lib/services/carbon-offset"

describe("carbonOffset", () => {
  it("computes van emissions and fee", () => {
    const r = carbonOffset(100, 10, "van")
    expect(r.kgCO2).toBeCloseTo(0.12, 5)
    expect(r.offsetFee).toBeCloseTo(0.18, 5)
  })

  it("charges more for air than bike", () => {
    const air = carbonOffset(100, 10, "air")
    const bike = carbonOffset(100, 10, "bike")
    expect(air.kgCO2).toBeGreaterThan(bike.kgCO2)
    expect(air.offsetFee).toBeGreaterThan(bike.offsetFee)
  })
})
