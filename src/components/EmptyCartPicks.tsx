import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { updateCartList } from "@store/cart.slice";

export interface TopPick {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  price?: number;
  rating?: number;
}

export function topPicks(products: TopPick[], n = 3): TopPick[] {
  return [...products]
    .sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0))
    .slice(0, n);
}

/**
 * Empty-cart top picks: highest-rated products with one-tap add.
 */
export function EmptyCartPicks() {
  const dispatch = useDispatch();
  const [picks, setPicks] = useState<TopPick[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (Array.isArray(list)) setPicks(topPicks(list));
      })
      .catch(() => {});
  }, []);

  if (picks.length === 0) return null;

  return (
    <Box data-testid="empty-cart-picks" sx={{ mt: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Shoppers also love
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
        {picks.map((p) => {
          const id = p._id ?? p.id ?? "";
          return (
            <Card key={id} data-testid={`top-pick-${id}`} variant="outlined" sx={{ minWidth: 180, p: 1 }}>
              <CardContent>
                <Typography variant="subtitle2">{p.name ?? p.title}</Typography>
                <Typography variant="body2" color="text.secondary">${Number(p.price ?? 0).toFixed(2)}</Typography>
                <Button
                  data-testid={`top-pick-add-${id}`}
                  size="small"
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => dispatch(updateCartList({ ...p, _id: id, quantity: 1 }))}
                >
                  Add
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
