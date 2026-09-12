import { matchConcierge } from "@lib/services/concierge-match"

const stylists = [
  { id: "a", name: "Ava", styles: ["modern", "boho"], minBudget: 100 },
  { id: "b", name: "Ben", styles: ["classic"], minBudget: 500 },
  { id: "c", name: "Cy", styles: ["modern", "classic", "boho"], minBudget: 200 },
]

describe("matchConcierge", () => {
  it("sorts by score descending with overlap winning", () => {
    const r = matchConcierge(300, ["modern", "boho", "classic"], stylists)
    expect(r[0].id).toBe("c")
    expect(r.map((x) => x.id)).toEqual(["c", "a", "b"])
  })

  it("penalizes stylists above budget", () => {
    const r = matchConcierge(100, ["classic"], stylists)
    const ben = r.find((x) => x.id === "b")!
    const ava = r.find((x) => x.id === "a")!
    expect(ben.score).toBeLessThan(ava.score)
    expect(r[0].score).toBeGreaterThanOrEqual(r[1].score)
  })
})
