import { Box, Typography } from '@mui/material'

export function CsvPreview({ csv, maxLines = 5 }: { csv: string; maxLines?: number }) {
  const lines = csv.split(/\r?\n/).slice(0, maxLines).join('\n')
  return (
    <Box data-testid="cp" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
      <Typography variant="caption" color="text.secondary">CSV preview (first {maxLines} lines)</Typography>
      <Box component="pre" sx={{ m: 0, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{lines}</Box>
    </Box>
  )
}
