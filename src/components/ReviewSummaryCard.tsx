import { Box, LinearProgress, Stack, Typography } from '@mui/material'

export interface ReviewSummaryCardProps {
  summary: {
    count: number
    average: number
    histogram: Record<1 | 2 | 3 | 4 | 5, number>
    verifiedCount: number
    pctVerified: number
  }
}

export function ReviewSummaryCard({ summary }: ReviewSummaryCardProps) {
  if (summary.count === 0) {
    return <Typography data-testid="rsc-empty" variant="body2" color="text.secondary">No reviews yet.</Typography>
  }
  return (
    <Box data-testid="rsc" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography data-testid="rsc-avg" variant="h4" fontWeight={700}>{summary.average.toFixed(1)}</Typography>
          <Typography variant="caption" color="text.secondary">out of 5</Typography>
        </Box>
        <Box flex={1}>
          {([5, 4, 3, 2, 1] as const).map((s) => {
            const pct = summary.count > 0 ? Math.round((summary.histogram[s] / summary.count) * 100) : 0
            return (
              <Stack key={s} direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ width: 16 }}>{s}★</Typography>
                <LinearProgress data-testid={`rsc-bar-${s}`} variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                <Typography variant="caption" sx={{ width: 32, textAlign: 'right' }}>{pct}%</Typography>
              </Stack>
            )
          })}
        </Box>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Based on {summary.count} review{summary.count === 1 ? '' : 's'} · {summary.pctVerified}% verified
      </Typography>
    </Box>
  )
}
