import { haversineKm, rankPickups } from "@lib/services/pickup-points"

describe("pickup-points", () => {
  it("ranks nearest first with walk eta", () => {
    const ranked = rankPickups({ lat: 0, lng: 0 }, [
      { id: "far", name: "Far", lat: 1, lng: 0, hours: "9-5" },
      { id: "near", name: "Near", lat: 0.01, lng: 0, hours: "9-5" },
    ])
    expect(ranked[0].id).toBe("near")
    expect(ranked[0].etaMin).toBeGreaterThan(0)
  })

  it("haversineKm is near zero for identical points", () => {
    expect(haversineKm({ lat: 10, lng: 20 }, { lat: 10, lng: 20 })).toBeCloseTo(0, 5)
    expect(haversineKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeGreaterThan(100)
  })
})
