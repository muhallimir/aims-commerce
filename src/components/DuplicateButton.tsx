import { useState } from "react";
import { Button } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";

export interface DuplicableProduct {
  name?: string;
  image?: string;
  brand?: string;
  category?: string;
  description?: string;
  price?: number;
  countInStock?: number;
}

export function duplicatePayload(p: DuplicableProduct): Record<string, unknown> {
  return {
    name: `${p.name ?? "Product"} (Copy)`,
    image: p.image,
    brand: p.brand,
    category: p.category,
    description: p.description,
    price: p.price,
    countInStock: 0,
  };
}

/** Duplicate button: clones the listing at zero stock for review. */
export function DuplicateButton({ product, onDuplicate }: {
  product: DuplicableProduct;
  onDuplicate: (payload: Record<string, unknown>) => Promise<unknown>;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function run() {
    setBusy(true);
    try {
      await onDuplicate(duplicatePayload(product));
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      data-testid="duplicate-button"
      startIcon={<ContentCopy />}
      size="small"
      disabled={busy || done}
      onClick={run}
    >
      {done ? "Duplicated" : "Duplicate"}
    </Button>
  );
}
