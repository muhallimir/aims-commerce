import { Box, Chip, Typography } from "@mui/material"
import type { EngravingQuote as EngravingQuoteResult } from "@lib/services/engraving"

export function EngravingQuote(props: EngravingQuoteResult) {
  return (
    <Box data-testid="engraving-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Engraving
      </Typography>
      <Typography variant="h6">{props.fee === 0 ? "Free" : `$${props.fee.toFixed(2)}`}</Typography>
      <Typography variant="body2" color="text.secondary">
        {props.note}
      </Typography>
      <Chip size="small" color={props.ok ? "success" : "warning"} label={props.ok ? "Available" : "Too long"} />
    </Box>
  )
}
