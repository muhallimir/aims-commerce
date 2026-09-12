import { interpolateRoute, routeProgress } from "@lib/services/tracking-route"

describe("tracking-route", () => {
  it("interpolates the midpoint of a straight segment", () => {
    const pos = interpolateRoute(
      [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 10 },
      ],
      0.5,
    )
    expect(pos.lng).toBeCloseTo(5, 5)
    expect(pos.segmentIndex).toBe(0)
  })

  it("clamps t and reports progress percent", () => {
    const pts = [
      { lat: 0, lng: 0 },
      { lat: 10, lng: 0 },
    ]
    expect(routeProgress(pts, 0.25)).toBe(25)
    expect(routeProgress(pts, 2)).toBe(100)
    expect(interpolateRoute(pts, 1).lat).toBeCloseTo(10, 5)
  })
})
