import { buildTimeline } from "@lib/services/tracking-timeline"

describe("tracking-timeline", () => {
  it("marks steps relative to current and computes percent", () => {
    const first = buildTimeline("created")
    expect(first.percent).toBe(0)
    expect(first.steps[0].state).toBe("current")
    expect(first.steps[5].state).toBe("todo")
  })

  it("marks delivered as 100 percent with all prior done", () => {
    const last = buildTimeline("delivered")
    expect(last.percent).toBe(100)
    expect(last.steps.filter((s) => s.state === "done").length).toBe(5)
    expect(last.steps[5].state).toBe("current")
  })
})
