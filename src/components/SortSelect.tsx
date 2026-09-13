import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

/** Grid sort control: featured, price and name ordering. */
export function SortSelect({ value, onChange }: { value: SortKey; onChange: (s: SortKey) => void }) {
  return (
    <FormControl size="small" sx={{ mb: 2, minWidth: 180, bgcolor: "common.white", borderRadius: 1 }} data-testid="sort-wrap">
      <InputLabel id="sort-label">Sort by</InputLabel>
      <Select data-testid="sort-select" labelId="sort-label" label="Sort by" value={value} onChange={(e) => onChange(e.target.value as SortKey)}>
        <MenuItem value="featured">Featured</MenuItem>
        <MenuItem value="price-asc">Price: low to high</MenuItem>
        <MenuItem value="price-desc">Price: high to low</MenuItem>
        <MenuItem value="name">Name A–Z</MenuItem>
      </Select>
    </FormControl>
  );
}
