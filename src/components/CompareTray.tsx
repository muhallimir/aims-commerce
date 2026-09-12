import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { buildCompareRows, compareLimit, type CompareProduct } from "@lib/compare";

export interface TrayItem extends CompareProduct {}

/**
 * Compare tray: tick up to 3 products anywhere on the grid, open a
 * side-by-side table with the best price and rating highlighted.
 */
export function CompareTray({ items, onToggle, onClear }: {
  items: TrayItem[];
  onToggle: (p: TrayItem) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const shown = compareLimit(items, 3);
  const rows = buildCompareRows(shown);

  return (
    <>
      {items.length > 0 && (
        <Box
          data-testid="compare-tray"
          sx={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1200, bgcolor: "background.paper", boxShadow: 4, borderRadius: 2, px: 2, py: 1, display: "flex", gap: 1, alignItems: "center" }}
        >
          <Typography data-testid="compare-count" variant="body2">
            {items.length} to compare
          </Typography>
          <Button data-testid="compare-open" size="small" variant="contained" disabled={items.length < 2} onClick={() => setOpen(true)}>
            Compare
          </Button>
          <Button data-testid="compare-clear" size="small" onClick={onClear}>
            Clear
          </Button>
        </Box>
      )}
      <Dialog data-testid="compare-dialog" open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Side by side</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                {shown.map((p) => (
                  <TableCell key={p.id} data-testid={`compare-head-${p.id}`}><strong>{p.name}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.field}>
                  <TableCell>{r.label}</TableCell>
                  {r.values.map((v, i) => (
                    <TableCell key={i} data-testid={`compare-cell-${r.field}-${i}`} sx={{ fontWeight: r.bestIndex === i ? 700 : 400 }}>
                      {String(v ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function CompareCheckbox({ item, checked, onToggle }: { item: TrayItem; checked: boolean; onToggle: (p: TrayItem) => void }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          data-testid="compare-check"
          size="small"
          checked={checked}
          onChange={() => onToggle(item)}
        />
      }
      label="Compare"
    />
  );
}
