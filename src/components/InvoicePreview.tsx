import { Box, Paper, Stack, Typography } from '@mui/material'

export function InvoicePreview({ text, total, currency }: { text: string; total: number; currency: string }) {
  const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' }
  return (
    <Paper data-testid="ip" variant="outlined" sx={{ p: 2 }}>
      <Box component="pre" sx={{ m: 0, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>
        {text}
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, borderTop: 1, borderColor: 'divider', pt: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>Total ({currency})</Typography>
        <Typography data-testid="ip-total" variant="subtitle1" fontWeight={700}>
          {sym[currency.toUpperCase()] ?? ''}{total.toFixed(2)}
        </Typography>
      </Stack>
    </Paper>
  )
}
