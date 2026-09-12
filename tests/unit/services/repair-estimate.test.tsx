import { repairEstimate } from "@lib/services/repair-estimate"

describe("repairEstimate", () => {
  it("returns phone base range and viable for young devices", () => {
    const r = repairEstimate("phone", "cracked screen", 2)
    expect(r.low).toBe(39)
    expect(r.high).toBe(129)
    expect(r.viable).toBe(true)
  })

  it("marks old devices as not viable and defaults unknown categories", () => {
    const r = repairEstimate("toaster", "won't heat", 10)
    expect(r.low).toBe(30)
    expect(r.high).toBe(100)
    expect(r.viable).toBe(false)
  })
})
