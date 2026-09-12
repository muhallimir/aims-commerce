import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Typography } from "@mui/material";

export interface PairCandidate {
  _id: string;
  id?: string;
  name?: string;
  title?: string;
  price?: number;
}

export function pickPair(products: PairCandidate[], currentId: string): PairCandidate | null {
  return products.find((p) => (p._id ?? p.id) !== currentId) ?? null;
}

/**
 * Frequently bought together: pairs this product with another from
 * the same category, one click adds both to the cart.
 */
export function BoughtTogether({ productId, category, price, onAddBoth }: {
  productId: string;
  category: string;
  price: number;
  onAddBoth: (pairId: string) => void;
}) {
  const [pair, setPair] = useState<PairCandidate | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPair(null);
    setAdded(false);
    if (!category) return;
    fetch(`/api/products?category=${encodeURIComponent(category)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: PairCandidate[]) => {
        if (!cancelled) setPair(pickPair(Array.isArray(list) ? list : [], productId));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [category, productId]);

  const pairPrice = Number(pair?.price ?? 0);
  const total = useMemo(() => Math.round((Number(price) + pairPrice) * 100) / 100, [price, pairPrice]);

  if (!pair) return null;

  return (
    <Card data-testid="bought-together" variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Frequently bought together
        </Typography>
        <Typography data-testid="bought-together-pair" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          This item + {pair.name ?? pair.title} (${pairPrice.toFixed(2)})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <Typography data-testid="bought-together-total" variant="h6">
            ${total.toFixed(2)} together
          </Typography>
          <Button
            data-testid="bought-together-add"
            size="small"
            variant="contained"
            onClick={() => {
              onAddBoth(pair._id ?? pair.id ?? "");
              setAdded(true);
            }}
          >
            Add both
          </Button>
        </Box>
        {added && (
          <Alert data-testid="bought-together-added" severity="success" sx={{ mt: 1 }}>
            Both items are in your cart.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
