import { Box, Typography } from '@mui/material'

export function SlugPreview({ source, slug }: { source: string; slug: string }) {
  return (
    <Box data-testid="sp" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
      <Typography variant="caption" color="text.secondary">From: {source}</Typography>
      <Typography variant="body2" fontFamily="monospace" data-testid="sp-value">{slug}</Typography>
    </Box>
  )
}
