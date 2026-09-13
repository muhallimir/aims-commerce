export interface PriceCheck {
  saved: number;
  live: number | null;
}

/** Drop amount when the live price undercuts the saved one. */
export function dropFor(saved: number, live: number | null): number | null {
  if (live == null) return null;
  const drop = Math.round((saved - live) * 100) / 100;
  return drop > 0 ? drop : null;
}
