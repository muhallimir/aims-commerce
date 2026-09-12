import { Box, Chip, Typography } from "@mui/material"
import type { ReturnsPickup as ReturnsPickupResult } from "@lib/services/returns-pickup"

export function ReturnsPickup(props: ReturnsPickupResult) {
  return (
    <Box data-testid="returns-pickup-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Returns pickup
      </Typography>
      <Typography variant="h6">{props.free ? "Free" : `$${props.fee.toFixed(2)}`}</Typography>
      <Typography variant="body2" color="text.secondary">
        ETA {props.etaDays} days
      </Typography>
      <Chip size="small" color={props.free ? "success" : "primary"} label={props.free ? "Free" : "Paid"} />
    </Box>
  )
}
