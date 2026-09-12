import { trackView, type RecentlyViewedState } from "@lib/recently-viewed";

export const RECENT_KEY = "aims-recent";

/** Append a product view to the on-device browsing trail. */
export function recordProductView(productId: string): RecentlyViewedState {
  let state: RecentlyViewedState = { userId: "guest", views: [] };
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.views)) state = { userId: "guest", views: parsed.views };
    }
  } catch {
    // Corrupt trail: start fresh below.
  }
  const next = trackView(state, productId);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Private mode: trail stays in memory only.
  }
  return next;
}
