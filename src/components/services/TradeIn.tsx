import { Box, Chip, Typography } from "@mui/material"
import type { TradeInResult } from "@lib/services/trade-in"

export interface TradeInProps extends TradeInResult {}

export function TradeIn({ credit, note }: TradeInProps) {
  return (
    <Box data-testid="trade-in-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Trade-in credit</Typography>
      <Typography variant="h6" fontWeight={700}>${credit.toFixed(2)}</Typography>
      <Chip label="Credit" size="small" sx={{ mt: 1 }} />
      <Typography variant="caption" display="block" mt={1}>{note}</Typography>
    </Box>
  )
}
