import { Box, Chip, Typography } from "@mui/material"
import type { EcoPackageResult } from "@lib/services/eco-packaging"

export interface EcoPackagingProps extends EcoPackageResult {}

export function EcoPackaging({ option, fee }: EcoPackagingProps) {
  return (
    <Box data-testid="eco-packaging-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Eco packaging</Typography>
      <Typography variant="h6" fontWeight={700}>${fee.toFixed(2)}</Typography>
      <Chip label={option} size="small" sx={{ mt: 1 }} />
    </Box>
  )
}
