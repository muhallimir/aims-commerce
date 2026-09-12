export interface SavedProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

const KEY = "aims-wishlist";

export function loadWishlist(): SavedProduct[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveWishlist(list: SavedProduct[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

/** Toggle membership; returns true when the item ends up saved. */
export function toggleWishlist(list: SavedProduct[], item: SavedProduct): { list: SavedProduct[]; saved: boolean } {
  if (list.some((p) => p._id === item._id)) {
    return { list: list.filter((p) => p._id !== item._id), saved: false };
  }
  return { list: [...list, item], saved: true };
}

export function inWishlist(list: SavedProduct[], id: string): boolean {
  return list.some((p) => p._id === id);
}
