import { loadWishlist, saveWishlist, toggleWishlist, inWishlist } from "@lib/wishlistStore";

describe("wishlistStore", () => {
  beforeEach(() => localStorage.clear());

  it("toggles membership without duplicates", () => {
    const item = { _id: "p1", name: "Cap", price: 20 };
    expect(loadWishlist()).toEqual([]);
    const added = toggleWishlist(loadWishlist(), item);
    expect(added.saved).toBe(true);
    saveWishlist(added.list);
    expect(inWishlist(loadWishlist(), "p1")).toBe(true);
    const removed = toggleWishlist(loadWishlist(), item);
    expect(removed).toEqual({ list: [], saved: false });
  });
});
