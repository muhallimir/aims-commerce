import { recordProductView, RECENT_KEY } from "@lib/recentViews";

describe("recordProductView", () => {
  beforeEach(() => localStorage.clear());

  it("appends views newest-first without duplicates", () => {
    recordProductView("a");
    recordProductView("b");
    recordProductView("a");
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "{}");
    expect(stored.views.map((v: any) => v.productId)).toEqual(["a", "b"]);
  });
});
