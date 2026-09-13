import { Box, Chip } from "@mui/material";

export interface SuggestProduct {
  name?: string;
  title?: string;
}

export function suggestionsFor(products: SuggestProduct[], query: string, limit = 5): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: string[] = [];
  for (const p of products) {
    const name = p.name ?? p.title ?? "";
    if (name.toLowerCase().includes(q) && !out.includes(name)) {
      out.push(name);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Live suggestions from the loaded catalog under the search box. */
export function SearchSuggestions({ products, query, onPick }: {
  products: SuggestProduct[];
  query: string;
  onPick: (name: string) => void;
}) {
  const items = suggestionsFor(products, query);
  if (items.length === 0) return null;
  return (
    <Box data-testid="search-suggestions" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2, justifyContent: "center" }}>
      {items.map((n) => (
        <Chip
          key={n}
          data-testid={`suggest-${n}`}
          label={n}
          clickable
          size="small"
          variant="outlined"
          onClick={() => onPick(n)}
        />
      ))}
    </Box>
  );
}
