import { Box, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { buildCompareRows } from '@lib/compare'

export function CompareTable({ products }: { products: { id: string; name: string; price: number; rating?: number; inStock: boolean; brand?: string; weightKg?: number }[] }) {
  if (products.length === 0) {
    return <Typography data-testid="ct-empty" variant="body2" color="text.secondary">No products to compare.</Typography>
  }
  const rows = buildCompareRows(products)
  return (
    <Box data-testid="ct" sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            {products.map((p) => (
              <TableCell key={p.id}>
                <Stack>
                  <Typography variant="subtitle2">{p.name}</Typography>
                  {p.brand && <Typography variant="caption" color="text.secondary">{p.brand}</Typography>}
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.field} data-testid={`ct-row-${r.field}`}>
              <TableCell>{r.label}</TableCell>
              {r.values.map((v, i) => {
                const isBest = r.bestIndex === i
                return (
                  <TableCell key={i}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <span>{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v ?? '—')}</span>
                      {isBest && <Chip data-testid={`ct-best-${products[i].id}`} size="small" color="success" label="best" />}
                    </Stack>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
