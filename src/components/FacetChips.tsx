import { Box, Chip, Stack, Typography } from '@mui/material'

export function FacetChips({ facets }: { facets: { value: string; count: number }[] }) {
  if (facets.length === 0) {
    return <Typography data-testid="fc-empty" variant="body2" color="text.secondary">No facets.</Typography>
  }
  return (
    <Stack data-testid="fc" direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {facets.map((f) => (
        <Chip
          key={f.value}
          data-testid={`fc-${f.value}`}
          label={`${f.value} (${f.count})`}
          size="small"
          variant="outlined"
        />
      ))}
    </Stack>
  )
}
