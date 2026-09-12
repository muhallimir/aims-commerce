import { Box, Card, CardContent, Chip, Typography } from "@mui/material"

export interface CheckpointsProps {
  next: string | null
  done: number
  remaining: string[]
}

export function Checkpoints({ next, done, remaining }: CheckpointsProps) {
  return (
    <Card data-testid="tracking-checkpoints-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Next checkpoint: {next ?? "complete"} ({done} done)
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {remaining.map((r) => (
            <Chip key={r} label={r} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
