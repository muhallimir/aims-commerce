import { installWindow } from "@lib/services/installation"

describe("installWindow", () => {
  it("generates one option per offset with three windows", () => {
    const r = installWindow("SW1A 1AA", [1, 3])
    expect(r.options).toHaveLength(2)
    expect(r.options[0].windows).toEqual(["08-12", "12-16", "16-20"])
  })
  it("generates dates offset from today", () => {
    const r = installWindow("10001", [0])
    const today = new Date().toISOString().slice(0, 10)
    expect(r.options[0].date).toBe(today)
    expect(r.options[0].windows).toHaveLength(3)
  })
})
