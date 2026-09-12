import { Box, Chip } from "@mui/material";

export interface CategoryChipsProps {
  categories: string[];
  value: string;
  onChange: (c: string) => void;
}

/** Category quick-filter chips above the product grid. */
export function CategoryChips({ categories, value, onChange }: CategoryChipsProps) {
  if (categories.length <= 1) return null;
  return (
    <Box data-testid="category-chips" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
      {categories.map((c) => (
        <Chip
          key={c}
          data-testid={`category-chip-${c}`}
          label={c}
          clickable
          color={value === c ? "primary" : "default"}
          onClick={() => onChange(c)}
        />
      ))}
    </Box>
  );
}
