import { Typography } from "@mui/material";
import { estimateDelivery } from "@lib/delivery-eta";

export function arrivalLabel(createdAt: string, businessDays = 5): string {
  try {
    const arrives = new Date(
      estimateDelivery({ orderPlacedAt: createdAt, businessDays, cutoffHour: 14, skipWeekends: true }).arrivesAt
    );
    return arrives.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

/** Arrival estimate for orders still on the road. */
export function ArrivalEstimate({ createdAt, isDelivered }: { createdAt: string; isDelivered: boolean }) {
  if (isDelivered) return null;
  const label = arrivalLabel(createdAt);
  if (!label) return null;
  return (
    <Typography data-testid="arrival-estimate" variant="body2" color="primary.main">
      Arriving around {label}
    </Typography>
  );
}
