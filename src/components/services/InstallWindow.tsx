import { Box, Chip, Typography } from "@mui/material"
import type { InstallWindowResult } from "@lib/services/installation"

export function InstallWindow(props: InstallWindowResult) {
  const first = props.options[0]
  return (
    <Box data-testid="installation-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Installation windows
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.options.length} dates available
      </Typography>
      {first && (
        <Typography variant="body2">
          {first.date}: {first.windows.join(", ")}
        </Typography>
      )}
      <Chip size="small" color="primary" label={`${props.options.length} options`} />
    </Box>
  )
}
