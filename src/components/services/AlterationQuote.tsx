import { Box, Chip, Typography } from "@mui/material"
import type { AlterationQuote as AlterationQuoteResult } from "@lib/services/alteration"

export function AlterationQuote(props: AlterationQuoteResult) {
  return (
    <Box data-testid="alteration-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Alteration quote
      </Typography>
      <Typography variant="h6">${props.total.toFixed(2)}</Typography>
      <Typography variant="body2" color="text.secondary">
        Ready in {props.days} days
      </Typography>
      <Chip size="small" color="primary" label={`${props.days} days`} />
    </Box>
  )
}
