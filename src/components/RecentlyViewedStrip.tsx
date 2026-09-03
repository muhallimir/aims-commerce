import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

export interface RecentlyViewedView { productId: string; viewedAt: string }

export function RecentlyViewedStrip({ views, products }: { views: RecentlyViewedView[]; products: { id: string; name: string }[] }) {
  if (views.length === 0) {
    return <Typography data-testid="rvs-empty" variant="body2" color="text.secondary">No recently viewed items.</Typography>
  }
  const map = new Map(products.map((p) => [p.id, p.name]))
  return (
    <Stack data-testid="rvs" direction="row" spacing={1.5} sx={{ overflowX: 'auto' }}>
      {views.map((v) => (
        <Card key={v.productId} variant="outlined" sx={{ minWidth: 140 }}>
          <CardContent>
            <Typography variant="body2" fontWeight={600} noWrap>
              {map.get(v.productId) ?? v.productId}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(v.viewedAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
