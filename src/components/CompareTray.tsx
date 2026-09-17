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
import useThemeMode from "src/hooks/useThemeMode";

export interface TrayItem extends CompareProduct {
  category?: string;
}

const TECH = ["electronics", "gaming", "computers", "audio", "phones"];
const APPAREL = ["shirts", "pants", "dresses", "jackets", "shoes", "clothing", "fashion", "apparel"];

/** Comparable families: tech compares with tech, apparel with apparel. */
export function groupOf(category: string | undefined): string {
  const c = (category ?? "").toLowerCase();
  if (TECH.includes(c)) return "tech";
  if (APPAREL.includes(c)) return "apparel";
  return c || "misc";
}

export function groupLabel(group: string): string {
  if (group === "tech") return "tech";
  if (group === "apparel") return "apparel";
  return group || "this category";
}

export type GuardDecision = { ok: true } | { ok: false; trayCategory: string };

/** Compare stays meaningful inside one family. */
export function canCompare(existing: TrayItem[], next: TrayItem): GuardDecision {
  if (existing.length === 0) return { ok: true };
  const trayGroup = groupOf(existing[0].category);
  const nextGroup = groupOf(next.category);
  if (!trayGroup || trayGroup === "misc" || trayGroup === nextGroup) return { ok: true };
  return { ok: false, trayCategory: groupLabel(trayGroup) };
}

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
          <Typography data-testid="compare-count" variant="body2" sx={{ color: "#1a1a1a" }}>
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
  const { isDarkMode } = useThemeMode();
  return (
    <FormControlLabel
      control={
        <Checkbox
          data-testid="compare-check"
          size="small"
          checked={checked}
          onChange={() => onToggle(item)}
          sx={isDarkMode ? { color: "grey.400", "&.Mui-checked": { color: "primary.main" } } : {}}
        />
      }
      label={<Typography variant="body2" color={isDarkMode ? "common.white" : "#1a1a1a"}>Compare</Typography>}
    />
  );
}

/**
 * Category guard: comparing across categories explains why it stops
 * you, and offers a one-tap switch.
 */
export function CompareCategoryGuard({ trayCategory, nextCategory, onSwitch, onKeep }: {
  trayCategory: string;
  nextCategory: string;
  onSwitch: () => void;
  onKeep: () => void;
}) {
  return (
    <Dialog data-testid="compare-guard" open onClose={onKeep} maxWidth="xs" fullWidth>
      <DialogTitle>One family at a time</DialogTitle>
      <DialogContent>
        <Typography data-testid="compare-guard-text" variant="body2" color="text.secondary">
          You&apos;re comparing {trayCategory}. Specs only line up within a family — switch to {nextCategory} or keep your current tray.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button data-testid="compare-guard-keep" onClick={onKeep}>
          Keep {trayCategory}
        </Button>
        <Button data-testid="compare-guard-switch" variant="contained" onClick={onSwitch} autoFocus>
          Switch to {nextCategory}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
