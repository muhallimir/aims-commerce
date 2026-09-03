import { Card, CardContent, Stack, Typography } from '@mui/material'

export function RecommendationRow({ items }: { items: { product: { id: string; name: string; category: string; price: number }; score: number }[] }) {
  if (items.length === 0) {
    return <Typography data-testid="rr-empty" variant="body2" color="text.secondary">No recommendations yet.</Typography>
  }
  return (
    <Stack data-testid="rr" direction="row" spacing={1.5} sx={{ overflowX: 'auto' }}>
      {items.map((i) => (
        <Card key={i.product.id} variant="outlined" sx={{ minWidth: 160 }}>
          <CardContent>
            <Typography variant="subtitle2" noWrap>{i.product.name}</Typography>
            <Typography variant="caption" color="text.secondary">{i.product.category}</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
              <Typography variant="body2" fontWeight={600}>${i.product.price.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">match {i.score}</Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
