import { Box, Chip, Typography } from "@mui/material"
import type { WarrantyQuote as WarrantyQuoteResult } from "@lib/services/warranty"

export function WarrantyQuote(props: WarrantyQuoteResult) {
  return (
    <Box data-testid="warranty-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Warranty
      </Typography>
      <Typography variant="h6">${props.premium.toFixed(2)}</Typography>
      <Typography variant="body2" color="text.secondary">
        {props.coverage.join(", ")}
      </Typography>
      <Chip size="small" color="primary" label={`${props.coverage.length} coverages`} />
    </Box>
  )
}
