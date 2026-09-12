import { nextMidnight, timeLeft } from "@lib/countdown";

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
});
