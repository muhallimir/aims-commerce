export interface ShippingProgress {
  subtotal: number;
  threshold: number;
  remaining: number;
  percent: number;
  unlocked: boolean;
}

export const FREE_SHIPPING_THRESHOLD = 50;

/** Free-shipping progress toward the threshold. */
export function shippingProgress(subtotal: number, threshold: number = FREE_SHIPPING_THRESHOLD): ShippingProgress {
  const safe = Math.max(0, subtotal);
  const remaining = Math.max(0, Math.round((threshold - safe) * 100) / 100);
  return {
    subtotal: safe,
    threshold,
    remaining,
    percent: Math.min(100, Math.round((safe / threshold) * 100)),
    unlocked: safe >= threshold,
  };
}
