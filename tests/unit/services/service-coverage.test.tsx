import { coverageCheck } from "@lib/services/service-coverage"

const zones = [
  { prefix: "SW1", etaDays: 2, fee: 4.99 },
  { prefix: "EH1", etaDays: 3, fee: 6.99 },
]

describe("coverageCheck", () => {
  it("matches postcode prefix case-insensitively", () => {
    const r = coverageCheck("sw1a 1aa", zones)
    expect(r.served).toBe(true)
    expect(r.etaDays).toBe(2)
    expect(r.fee).toBe(4.99)
  })

  it("returns unserved when no zone matches", () => {
    const r = coverageCheck("ZZ9 9ZZ", zones)
    expect(r.served).toBe(false)
    expect(r.etaDays).toBeNull()
    expect(r.fee).toBeNull()
  })
})
