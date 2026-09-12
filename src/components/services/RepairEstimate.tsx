import { Box, Chip, Typography } from "@mui/material"
import type { RepairEstimateResult } from "@lib/services/repair-estimate"

export interface RepairEstimateProps extends RepairEstimateResult {}

export function RepairEstimate({ low, high, viable }: RepairEstimateProps) {
  return (
    <Box data-testid="repair-estimate-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Repair estimate</Typography>
      <Typography variant="h6" fontWeight={700}>${low.toFixed(2)} - ${high.toFixed(2)}</Typography>
      <Chip label={viable ? "Viable" : "Not viable"} size="small" sx={{ mt: 1 }} />
    </Box>
  )
}
