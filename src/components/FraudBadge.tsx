import { Box, Chip, Stack, Typography } from '@mui/material'

const COLORS: Record<string, 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
}

export function FraudBadge({ score, level, flags }: { score: number; level: 'low' | 'medium' | 'high'; flags: string[] }) {
  return (
    <Box data-testid="fb" data-level={level} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip size="small" color={COLORS[level]} label={`${level} risk`} />
        <Typography variant="body2" fontWeight={600}>{score}/100</Typography>
      </Stack>
      {flags.length > 0 && (
        <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" useFlexGap>
          {flags.map((f) => <Chip key={f} size="small" variant="outlined" label={f} />)}
        </Stack>
      )}
    </Box>
  )
}
