import { quoteReturnsPickup } from "@lib/returns-pickup";

describe("quoteReturnsPickup", () => {
  it("is free for members", () => {
    const q = quoteReturnsPickup({ distanceKm: 25, bulky: true, isMember: true });
    expect(q.free).toBe(true);
    expect(q.fee).toBe(0);
  });

  it("is free for nearby non-bulky pickups", () => {
    const q = quoteReturnsPickup({ distanceKm: 2, bulky: false, isMember: false });
    expect(q.free).toBe(true);
  });

  it("charges distance plus bulky handling otherwise", () => {
    const q = quoteReturnsPickup({ distanceKm: 10, bulky: true, isMember: false });
    expect(q.free).toBe(false);
    expect(q.fee).toBeCloseTo(4.99 + 12 + 10, 2);
    expect(q.etaDays).toBe(3);
  });
});
