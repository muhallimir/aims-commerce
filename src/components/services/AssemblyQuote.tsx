import { Box, Chip, Typography } from "@mui/material"
import type { AssemblyQuote as AssemblyQuoteResult } from "@lib/services/assembly"

export function AssemblyQuote(props: AssemblyQuoteResult) {
  return (
    <Box data-testid="assembly-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Assembly quote
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.minutes} min
      </Typography>
      <Typography variant="h6">${props.fee.toFixed(2)}</Typography>
      <Chip size="small" color="primary" label={`${props.minutes} min`} />
    </Box>
  )
}
