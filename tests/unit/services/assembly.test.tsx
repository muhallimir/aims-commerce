import { assemblyQuote } from "@lib/services/assembly"

describe("assemblyQuote", () => {
  it("quotes a chair correctly", () => {
    const q = assemblyQuote("chair", 2)
    expect(q.minutes).toBe(20)
    expect(q.fee).toBe(30)
  })
  it("falls back to default minutes for unknown type", () => {
    const q = assemblyQuote("lamp", 1)
    expect(q.minutes).toBe(30)
    expect(q.fee).toBe(15)
  })
})
