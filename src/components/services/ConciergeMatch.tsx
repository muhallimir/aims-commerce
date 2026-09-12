import { Box, Chip, Typography } from "@mui/material"
import type { ConciergeMatch } from "@lib/services/concierge-match"

export interface ConciergeMatchProps {
  matches: ConciergeMatch[]
}

export function ConciergeMatch({ matches }: ConciergeMatchProps) {
  const top = matches[0]
  return (
    <Box data-testid="concierge-match-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Concierge match</Typography>
      <Typography variant="h6" fontWeight={700}>{top ? top.name : "No match"}</Typography>
      {top ? <Chip label={`Score ${top.score}`} size="small" sx={{ mt: 1 }} /> : null}
      <Typography variant="caption" display="block" mt={1}>{matches.length} stylists</Typography>
    </Box>
  )
}
