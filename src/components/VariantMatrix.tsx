import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { buildAxes, findVariant } from '@lib/variants'

export interface Variant { id: string; options: Record<string, string>; price: number; stock: number }

export function VariantMatrix({ variants }: { variants: Variant[] }) {
  if (variants.length === 0) {
    return <Typography data-testid="vm-empty" variant="body2" color="text.secondary">No variants.</Typography>
  }
  const axes = buildAxes(variants)
  const rows = axes[0]?.values ?? []
  const cols = axes[1]?.values ?? ['']
  return (
    <Box data-testid="vm" sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {cols.map((c) => <TableCell key={c}>{c}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r}>
              <TableCell>{r}</TableCell>
              {cols.map((c) => {
                const sel = axes.length === 2 ? { [axes[0].name]: r, [axes[1].name]: c } : { [axes[0].name]: r }
                const v = findVariant(variants, sel)
                return (
                  <TableCell key={c} data-testid={`vm-cell-${r}-${c}`}>
                    {v ? (v.stock > 0 ? `${v.stock} in stock` : 'out of stock') : '—'}
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
