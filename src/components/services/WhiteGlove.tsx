import { Box, Chip, Typography } from "@mui/material"
import type { WhiteGloveResult } from "@lib/services/white-glove"

export interface WhiteGloveProps extends WhiteGloveResult {}

export function WhiteGlove({ tier, fee }: WhiteGloveProps) {
  return (
    <Box data-testid="white-glove-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">White glove delivery</Typography>
      <Typography variant="h6" fontWeight={700}>${fee.toFixed(2)}</Typography>
      <Chip label={tier} size="small" sx={{ mt: 1 }} />
    </Box>
  )
}
