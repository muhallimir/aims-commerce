import { isLive } from "@lib/announcements";

describe("isLive", () => {
  const base = { id: "a", message: "hi", active: true, starts_at: null, ends_at: null, created_at: "2026-01-01" };

  it("honors active flag and window", () => {
    expect(isLive(base, new Date("2026-09-12"))).toBe(true);
    expect(isLive({ ...base, active: false }, new Date("2026-09-12"))).toBe(false);
    expect(isLive({ ...base, starts_at: "2026-10-01T00:00:00Z" }, new Date("2026-09-12"))).toBe(false);
    expect(isLive({ ...base, ends_at: "2026-01-01T00:00:00Z" }, new Date("2026-09-12"))).toBe(false);
  });
});
