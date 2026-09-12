import { useMemo } from "react";
import { Typography } from "@mui/material";
import { estimateDelivery } from "@lib/delivery-eta";

export function arrivalFor(now: Date, businessDays = 3): Date {
  return new Date(
    estimateDelivery({ orderPlacedAt: now.toISOString(), businessDays, cutoffHour: 14, skipWeekends: true }).arrivesAt
  );
}

export function cutoffCountdown(now: Date, cutoffHour = 14): string {
  const cutoff = new Date(now);
  cutoff.setHours(cutoffHour, 0, 0, 0);
  if (now.getTime() >= cutoff.getTime()) {
    cutoff.setDate(cutoff.getDate() + 1);
  }
  const mins = Math.max(0, Math.round((cutoff.getTime() - now.getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Delivery promise: order-within countdown plus the estimated
 * arrival date, straight from the ETA engine.
 */
export function DeliveryPromise({ now = new Date() }: { now?: Date }) {
  const arrives = useMemo(() => arrivalFor(now), [now]);
  const left = useMemo(() => cutoffCountdown(now), [now]);
  return (
    <Typography data-testid="delivery-promise" variant="body2" color="success.main" sx={{ mb: 2 }}>
      Order within {left}, get it by{" "}
      {arrives.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}.
    </Typography>
  );
}
