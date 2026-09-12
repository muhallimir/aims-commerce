import { Box, Card, CardContent, Chip, Typography } from "@mui/material"

export interface DeliveryProofProps {
  ok: boolean
  missing: string[]
}

export function DeliveryProof({ ok, missing }: DeliveryProofProps) {
  return (
    <Card data-testid="tracking-proof-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Delivery proof
        </Typography>
        <Chip label={ok ? "Verified" : "Incomplete"} color={ok ? "success" : "default"} size="small" />
        {!ok && (
          <Box mt={1}>
            <Typography variant="caption" color="text.secondary">
              Missing: {missing.join(", ")}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
