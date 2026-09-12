import { Box, Button, Rating, Typography } from "@mui/material";

export interface SpotlightProduct {
  _id: string;
  name?: string;
  title?: string;
  price?: number;
  rating?: number;
  numReviews?: number;
  countInStock?: number;
  count_in_stock?: number;
}

export function topRated(products: SpotlightProduct[]): SpotlightProduct | null {
  const stocked = products.filter((p) => Number(p.countInStock ?? p.count_in_stock ?? 0) > 0);
  if (stocked.length === 0) return null;
  return stocked.reduce((best, p) => (Number(p.rating ?? 0) > Number(best.rating ?? 0) ? p : best));
}

/** Top-rated spotlight: the crowd favorite, one tap to its page. */
export function TopRatedSpotlight({ products, onOpen }: { products: SpotlightProduct[]; onOpen: (id: string) => void }) {
  const top = topRated(products);
  if (!top) return null;
  return (
    <Box
      data-testid="top-rated-spotlight"
      sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2, mb: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="overline" color="secondary">Top rated today</Typography>
        <Typography data-testid="top-rated-name" variant="h6">{top.name ?? top.title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating value={Number(top.rating ?? 0)} readOnly precision={0.5} size="small" />
          <Typography variant="body2" color="text.secondary">({top.numReviews ?? 0})</Typography>
        </Box>
      </Box>
      <Button data-testid="top-rated-open" variant="contained" onClick={() => onOpen(top._id)}>
        View product
      </Button>
    </Box>
  );
}
