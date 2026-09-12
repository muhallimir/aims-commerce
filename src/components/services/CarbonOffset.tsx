import { Box, Chip, Typography } from "@mui/material"
import type { CarbonOffsetResult } from "@lib/services/carbon-offset"

export interface CarbonOffsetProps extends CarbonOffsetResult {}

export function CarbonOffset({ kgCO2, offsetFee }: CarbonOffsetProps) {
  return (
    <Box data-testid="carbon-offset-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Carbon offset</Typography>
      <Typography variant="h6" fontWeight={700}>{kgCO2.toFixed(3)} kg CO2</Typography>
      <Chip label={`Offset $${offsetFee.toFixed(2)}`} size="small" sx={{ mt: 1 }} />
    </Box>
  )
}
