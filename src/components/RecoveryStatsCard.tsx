import { Box, Stack, Typography } from '@mui/material'

export interface RecoveryStats { total: number; recovered: number; pending: number; recoveryRate: number; recoveredRevenue: number; pendingRevenue: number }

const fmt = (n: number) => `$${n.toFixed(2)}`

export function RecoveryStatsCard({ stats }: { stats: RecoveryStats }) {
  return (
    <Box data-testid="rsc" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack>
          <Typography variant="caption" color="text.secondary">Recovery rate</Typography>
          <Typography data-testid="rsc-rate" variant="h4" fontWeight={700}>{stats.recoveryRate}%</Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">Recovered</Typography>
          <Typography fontWeight={600}>{stats.recovered} of {stats.total}</Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">Recovered revenue</Typography>
          <Typography fontWeight={600}>{fmt(stats.recoveredRevenue)}</Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">Pending revenue</Typography>
          <Typography fontWeight={600}>{fmt(stats.pendingRevenue)}</Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
