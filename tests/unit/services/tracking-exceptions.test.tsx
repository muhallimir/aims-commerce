import { classifyException } from "@lib/services/tracking-exceptions"

describe("tracking-exceptions", () => {
  it("detects weather and customs keywords", () => {
    expect(classifyException("Delayed by snow storm").type).toBe("weather")
    expect(classifyException("Held at customs clearance").type).toBe("customs")
  })

  it("returns none with zero confidence for plain notes", () => {
    const res = classifyException("Package is moving normally")
    expect(res.type).toBe("none")
    expect(res.confidence).toBe(0)
  })
})
