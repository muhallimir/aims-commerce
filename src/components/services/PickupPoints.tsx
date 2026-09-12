import { Box, Card, CardContent, Chip, Typography } from "@mui/material"
import type { RankedPickup } from "@lib/services/pickup-points"

export interface PickupPointsProps {
  points: PickedPoint[]
}

export interface PickedPoint {
  id: string
  name: string
  distanceKm: number
  etaMin: number
}

export function PickupPoints({ points }: PickupPointsProps) {
  const list: PickedPoint[] = points as unknown as RankedPickup[]
  return (
    <Card data-testid="pickup-points-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Pickup points
        </Typography>
        <Box display="flex" flexDirection="column" gap={1} mt={1}>
          {list.map((p) => (
            <Box key={p.id} display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">{p.name}</Typography>
              <Chip label={`${p.distanceKm} km`} size="small" />
              <Typography variant="caption" color="text.secondary">
                ~{p.etaMin} min walk
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
