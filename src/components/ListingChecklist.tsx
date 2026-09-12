import { Box, LinearProgress, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export interface ListingDraft {
  name: string;
  price: number;
  category: string;
  description: string;
  countInStock: number;
  image: string;
}

export function checklistFor(d: ListingDraft): { label: string; done: boolean }[] {
  return [
    { label: "Name your product", done: d.name.trim().length >= 3 },
    { label: "Set a price above $0", done: Number(d.price) > 0 },
    { label: "Pick a category", done: d.category.trim().length > 0 },
    { label: "Describe it (20+ chars)", done: d.description.trim().length >= 20 },
    { label: "Add stock", done: Number(d.countInStock) > 0 },
    { label: "Add a photo", done: d.image.trim().length > 0 },
  ];
}

/** Listing checklist: live progress toward a publishable product. */
export function ListingChecklist({ draft }: { draft: ListingDraft }) {
  const items = checklistFor(draft);
  const done = items.filter((i) => i.done).length;
  return (
    <Box data-testid="listing-checklist" sx={{ mt: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
      <Typography variant="subtitle2">
        Listing readiness: <span data-testid="listing-count">{done}/{items.length}</span>
      </Typography>
      <LinearProgress data-testid="listing-progress" variant="determinate" value={(done / items.length) * 100} sx={{ my: 1, height: 8, borderRadius: 4 }} />
      {items.map((i) => (
        <Box key={i.label} data-testid={`listing-item-${i.done ? "done" : "todo"}`} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {i.done ? <CheckCircleIcon color="success" fontSize="small" /> : <RadioButtonUncheckedIcon color="disabled" fontSize="small" />}
          <Typography variant="body2" color={i.done ? "text.primary" : "text.secondary"}>{i.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}
