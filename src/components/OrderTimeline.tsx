import { Box, Chip, Stack, Typography } from "@mui/material";

export type StageState = "done" | "current" | "todo";

/** Per-stage truth from the order flags: placed always done. */
export function stageStates(isPaid: boolean, isDelivered: boolean): StageState[] {
  if (isDelivered) return ["done", "done", "done", "current"];
  if (isPaid) return ["done", "done", "current", "todo"];
  return ["done", "current", "todo", "todo"];
}

const STAGES = [
  { label: "Placed", hint: "We got your order" },
  { label: "Paid", hint: "Payment confirmed" },
  { label: "On its way", hint: "Courier has it" },
  { label: "Delivered", hint: "Signed and done" },
];

/**
 * What's-next timeline: stages derived from the order flags,
 * current stage highlighted.
 */
export function OrderTimeline({ isPaid, isDelivered }: { isPaid: boolean; isDelivered: boolean }) {
  const states = stageStates(isPaid, isDelivered);
  return (
    <Box data-testid="order-timeline" sx={{ mt: 1 }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        What&apos;s next
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        {STAGES.map((s, i) => (
          <Chip
            key={s.label}
            data-testid={`order-stage-${i}`}
            data-state={states[i]}
            label={`${s.label} · ${s.hint}`}
            color={states[i] === "done" ? "success" : states[i] === "current" ? "primary" : "default"}
            variant={states[i] === "todo" ? "outlined" : "filled"}
          />
        ))}
      </Stack>
    </Box>
  );
}
