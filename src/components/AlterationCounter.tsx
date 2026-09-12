import { useMemo, useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { alterationQuote } from "@lib/service-quotes";

const JOBS = [
  { id: "hem", label: "Hem ($12)" },
  { id: "taper", label: "Taper ($18)" },
  { id: "zip", label: "Replace zip ($15)" },
  { id: "resize", label: "Resize ($25)" },
  { id: "patch", label: "Patch ($9)" },
];

/**
 * Tailoring counter: tick the fixes, see price and turnaround.
 */
export function AlterationCounter() {
  const [jobs, setJobs] = useState<string[]>(["hem"]);

  const q = useMemo(() => alterationQuote(jobs), [jobs]);

  function toggle(id: string) {
    setJobs((j) => (j.includes(id) ? j.filter((x) => x !== id) : [...j, id]));
  }

  return (
    <Card data-testid="alteration-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Tailoring counter</Typography>
        <Typography variant="body2" color="text.secondary">
          In-house tailors. Tick every fix, get price and turnaround.
        </Typography>
        <FormGroup sx={{ mt: 1 }}>
          {JOBS.map((j) => (
            <FormControlLabel
              key={j.id}
              control={<Checkbox data-testid={`alteration-${j.id}`} checked={jobs.includes(j.id)} onChange={() => toggle(j.id)} />}
              label={j.label}
            />
          ))}
        </FormGroup>
        <Alert data-testid="alteration-result" severity="info" sx={{ mt: 1 }}>
          Total: <strong>${q.total.toFixed(2)}</strong> · ready in <strong>{q.days} days</strong>.
        </Alert>
      </CardContent>
    </Card>
  );
}
