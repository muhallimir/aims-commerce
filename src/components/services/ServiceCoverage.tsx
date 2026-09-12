import { Box, Chip, Typography } from "@mui/material"
import type { CoverageCheckResult } from "@lib/services/service-coverage"

export interface ServiceCoverageProps extends CoverageCheckResult {}

export function ServiceCoverage({ served, etaDays, fee }: ServiceCoverageProps) {
  return (
    <Box data-testid="service-coverage-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Service coverage</Typography>
      <Typography variant="h6" fontWeight={700}>{served ? "Served" : "Unserved"}</Typography>
      <Chip
        label={served ? `${etaDays} days - $${fee?.toFixed(2)}` : "No coverage"}
        size="small"
        sx={{ mt: 1 }}
      />
    </Box>
  )
}
