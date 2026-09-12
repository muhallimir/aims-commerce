import { Box, Chip, Typography } from "@mui/material"
import type { BulkQuoteResult } from "@lib/services/bulk-quote"

export interface BulkQuoteProps extends BulkQuoteResult {}

export function BulkQuote({ discountPct, total, tier }: BulkQuoteProps) {
  return (
    <Box data-testid="bulk-quote-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Bulk quote</Typography>
      <Typography variant="h6" fontWeight={700}>${total.toFixed(2)}</Typography>
      <Chip label={`${discountPct}% off`} size="small" sx={{ mt: 1 }} />
      <Typography variant="caption" display="block" mt={1}>Tier: {tier}</Typography>
    </Box>
  )
}
