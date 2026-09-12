import { nextCheckpoint } from "@lib/services/tracking-checkpoints"

describe("tracking-checkpoints", () => {
  it("returns the first missing plan step", () => {
    const res = nextCheckpoint([{ code: "a", at: "2026-01-01T00:00:00Z" }], ["a", "b", "c"])
    expect(res.next).toBe("b")
    expect(res.done).toBe(1)
    expect(res.remaining).toEqual(["b", "c"])
  })

  it("returns null when the plan is complete", () => {
    const res = nextCheckpoint(
      [
        { code: "a", at: "2026-01-01T00:00:00Z" },
        { code: "b", at: "2026-01-02T00:00:00Z" },
      ],
      ["a", "b"],
    )
    expect(res.next).toBeNull()
    expect(res.remaining).toEqual([])
  })
})
