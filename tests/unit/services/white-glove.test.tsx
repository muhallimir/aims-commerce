import { whiteGloveFee } from "@lib/services/white-glove"

describe("whiteGloveFee", () => {
  it("returns standard tier for a small job", () => {
    const r = whiteGloveFee(0, false, 1)
    expect(r.fee).toBe(49)
    expect(r.tier).toBe("standard")
  })

  it("returns premium tier for a large bulky job", () => {
    const r = whiteGloveFee(3, true, 4)
    expect(r.fee).toBe(49 + 30 + 40 + 45)
    expect(r.tier).toBe("premium")
  })

  it("returns plus tier for a mid-size job", () => {
    const r = whiteGloveFee(2, true, 2)
    expect(r.fee).toBe(49 + 20 + 40 + 15)
    expect(r.tier).toBe("plus")
  })
})
