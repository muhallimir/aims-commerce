import { returnsPickupFee } from "@lib/services/returns-pickup"

describe("returnsPickupFee", () => {
  it("is free for gold members", () => {
    const r = returnsPickupFee(25, true, "gold")
    expect(r.free).toBe(true)
    expect(r.fee).toBe(0)
  })
  it("charges non-members for bulky distant pickup", () => {
    const r = returnsPickupFee(10, true, "bronze")
    expect(r.free).toBe(false)
    expect(r.fee).toBeGreaterThan(0)
    expect(r.etaDays).toBeGreaterThanOrEqual(3)
  })
})
