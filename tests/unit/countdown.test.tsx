import { nextMidnight, timeLeft } from "@lib/countdown";
import { isNewArrival, stockUrgency } from "@lib/countdown";

describe("countdown", () => {
  it("counts down to midnight", () => {
    const now = new Date("2026-09-12T20:00:00");
    const t = timeLeft(now, nextMidnight(now));
    expect(t.ended).toBe(false);
    expect(t).toMatchObject({ hours: 4, minutes: 0, seconds: 0 });
  });

  it("reports ended past the deadline", () => {
    const now = new Date("2026-09-13T00:00:01");
    const t = timeLeft(now, nextMidnight(new Date("2026-09-12T20:00:00")));
    expect(t.ended).toBe(true);
  });

  it("flags thin stock and stays quiet otherwise", () => {
    expect(stockUrgency(0)).toBeNull();
    expect(stockUrgency(1)).toBe("Only 1 left");
    expect(stockUrgency(5)).toBe("Only 5 left");
    expect(stockUrgency(6)).toBeNull();
    expect(stockUrgency(51)).toBeNull();
  });

  it("spots new arrivals within two weeks", () => {
    const now = new Date("2026-09-12T12:00:00Z");
    expect(isNewArrival("2026-09-05T12:00:00Z", 14, now)).toBe(true);
    expect(isNewArrival("2026-08-01T12:00:00Z", 14, now)).toBe(false);
    expect(isNewArrival(null, 14, now)).toBe(false);
    expect(isNewArrival("not-a-date", 14, now)).toBe(false);
  });
});
