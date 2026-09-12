import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const ISSUES = ["Arrived damaged", "Item missing", "Wrong item", "Late delivery", "Something else"];

export function makeRef(orderId: string): string {
  return `SUP-${orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/**
 * Issue reporter: what went wrong with an order, reference number back.
 */
export function IssueReporter({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState(ISSUES[0]);
  const [details, setDetails] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  function submit() {
    setRef(makeRef(orderId));
  }

  function close() {
    setOpen(false);
    setRef(null);
    setDetails("");
  }

  return (
    <>
      <Button data-testid="issue-open" size="small" color="warning" onClick={() => setOpen(true)}>
        Report a problem
      </Button>
      <Dialog data-testid="issue-dialog" open={open} onClose={close} maxWidth="xs" fullWidth>
        <DialogTitle>Report order {orderId.slice(0, 8)}…</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel id="issue-type-label">What happened</InputLabel>
            <Select data-testid="issue-type" labelId="issue-type-label" label="What happened" value={issue} onChange={(e) => setIssue(e.target.value)}>
              {ISSUES.map((i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            inputProps={{ "data-testid": "issue-details" }}
            size="small"
            label="Details (optional)"
            multiline
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          {ref && (
            <Alert data-testid="issue-ref" severity="success" sx={{ mt: 2 }}>
              Report {ref} logged. Support replies within 24 hours.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
          <Button data-testid="issue-submit" variant="contained" onClick={submit}>
            Send report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
