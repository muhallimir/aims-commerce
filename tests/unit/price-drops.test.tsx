import { dropFor } from "@lib/priceDrops";

describe("dropFor", () => {
  it("reports drops only when live undercuts saved", () => {
    expect(dropFor(100, 80)).toBe(20);
    expect(dropFor(80, 100)).toBeNull();
    expect(dropFor(80, 80)).toBeNull();
    expect(dropFor(80, null)).toBeNull();
  });
});
