import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const APPAREL = ["shirts", "pants", "dresses", "jackets", "shoes", "clothing", "fashion", "apparel"];

const ROWS = [
  ["XS", "32", "26", "34"],
  ["S", "34", "28", "36"],
  ["M", "36", "30", "38"],
  ["L", "38", "32", "40"],
  ["XL", "40", "34", "42"],
];

export function needsSizeGuide(category: string | undefined): boolean {
  if (!category) return false;
  return APPAREL.some((a) => category.toLowerCase().includes(a));
}

/** Size guide: measurement table behind a link, apparel only. */
export function SizeGuide({ category }: { category: string }) {
  const [open, setOpen] = useState(false);
  if (!needsSizeGuide(category)) return null;
  return (
    <>
      <Button data-testid="size-guide-open" size="small" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Size guide
      </Button>
      <Dialog data-testid="size-guide-dialog" open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Size guide (inches)</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Size</TableCell>
                <TableCell>Chest</TableCell>
                <TableCell>Waist</TableCell>
                <TableCell>Hips</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r[0]}>
                  {r.map((c, i) => (
                    <TableCell key={i}>{c}</TableCell>
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
