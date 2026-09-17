import { Box, Chip } from "@mui/material";
import useThemeMode from "src/hooks/useThemeMode";

export interface CategoryChipsProps {
  categories: string[];
  value: string;
  onChange: (c: string) => void;
}

/** Category quick-filter chips above the product grid. */
export function CategoryChips({ categories, value, onChange }: CategoryChipsProps) {
  const { isDarkMode } = useThemeMode();
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
          variant={value === c || !isDarkMode ? "filled" : "outlined"}
          onClick={() => onChange(c)}
          sx={
            value === c || !isDarkMode
              ? {}
              : { color: "common.white", borderColor: "grey.500", bgcolor: "transparent" }
          }
        />
      ))}
    </Box>
  );
}
