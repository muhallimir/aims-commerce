import { Box, Chip, Typography } from "@mui/material"
import type { PriceMatchResult } from "@lib/services/price-match"

export interface PriceMatchProps extends PriceMatchResult {}

export function PriceMatch({ approved, matchPrice, reason }: PriceMatchProps) {
  return (
    <Box data-testid="price-match-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Price match</Typography>
      <Typography variant="h6" fontWeight={700}>
        {approved && matchPrice !== null ? `$${matchPrice.toFixed(2)}` : "Not matched"}
      </Typography>
      <Chip label={approved ? "Approved" : "Declined"} size="small" sx={{ mt: 1 }} />
      <Typography variant="caption" display="block" mt={1}>{reason}</Typography>
    </Box>
  )
}
