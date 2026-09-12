import { Box, Chip, Typography } from "@mui/material"
import type { RecyclingCredit as RecyclingCreditResult } from "@lib/services/recycling"

export function RecyclingCredit(props: RecyclingCreditResult) {
  return (
    <Box data-testid="recycling-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Recycling credit
      </Typography>
      <Typography variant="h6">${props.credit.toFixed(2)}</Typography>
      <Chip
        size="small"
        color={props.pickupFree ? "success" : "default"}
        label={props.pickupFree ? "Free pickup" : "Pickup fee applies"}
      />
    </Box>
  )
}
