export interface RecentView {
  productId: string
  viewedAt: string
}

export interface RecentlyViewedState {
  userId: string
  views: RecentView[]
  maxItems?: number
}

export function trackView(state: RecentlyViewedState, productId: string, now: Date = new Date()): RecentlyViewedState {
  const filtered = state.views.filter((v) => v.productId !== productId)
  const next: RecentView[] = [{ productId, viewedAt: now.toISOString() }, ...filtered]
  const max = state.maxItems ?? 20
  return { userId: state.userId, views: next.slice(0, max), maxItems: max }
}

export function clearViews(state: RecentlyViewedState): RecentlyViewedState {
  return { ...state, views: [] }
}

export function mostRecent(state: RecentlyViewedState, n?: number): RecentView[] {
  return n ? state.views.slice(0, n) : state.views
}
