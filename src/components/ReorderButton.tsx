import { useState } from "react";
import { Button } from "@mui/material";

export interface ReorderItem {
  product: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
  seller?: string;
}

/** Buy-again button: re-adds every unit, then hands off to the cart. */
export function ReorderButton({ items, onReorder }: { items: ReorderItem[]; onReorder: (items: ReorderItem[]) => void }) {
  const [added, setAdded] = useState(false);
  const units = items.reduce((n, i) => n + Math.max(0, i.qty), 0);

  return (
    <Button
      data-testid="reorder-button"
      variant="outlined"
      sx={{ ml: 1 }}
      disabled={units === 0 || added}
      onClick={() => {
        onReorder(items);
        setAdded(true);
      }}
    >
      {added ? "Added to cart" : `Buy again (${units})`}
    </Button>
  );
}
