import { Box, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'

export interface WeeklyAnalytics { weekStart: string; weekEnd: string; orderCount: number; revenue: number; unitsSold: number; averageOrderValue: number; topProducts: { productId: string; revenue: number; qty: number }[] }

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function WeeklyAnalyticsCard({ analytics }: { analytics: WeeklyAnalytics }) {
  return (
    <Box data-testid="wac" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Week of {analytics.weekStart} – {analytics.weekEnd}
      </Typography>
      <Stack direction="row" spacing={3}>
        <Stack>
          <Typography variant="caption" color="text.secondary">Revenue</Typography>
          <Typography data-testid="wac-rev" variant="h6" fontWeight={700}>{fmt(analytics.revenue)}</Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">Orders</Typography>
          <Typography variant="h6" fontWeight={700}>{analytics.orderCount}</Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">Units</Typography>
          <Typography variant="h6" fontWeight={700}>{analytics.unitsSold}</Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">AOV</Typography>
          <Typography variant="h6" fontWeight={700}>{fmt(analytics.averageOrderValue)}</Typography>
        </Stack>
      </Stack>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Top products</Typography>
      <List dense>
        {analytics.topProducts.map((p) => (
          <ListItem key={p.productId} disableGutters>
            <ListItemText
              primary={p.productId}
              secondary={`${p.qty} units · ${fmt(p.revenue)}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
