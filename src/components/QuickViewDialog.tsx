import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export interface QuickViewProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  brand?: string;
  countInStock?: number;
}

interface Props {
  product: QuickViewProduct | null;
  onClose: () => void;
  onAdd: (p: QuickViewProduct) => void;
  onDetails: (p: QuickViewProduct) => void;
}

/**
 * Quick view: full product snapshot without leaving the grid.
 */
export function QuickViewDialog({ product, onClose, onAdd, onDetails }: Props) {
  const [added, setAdded] = useState(false);

  function close() {
    setAdded(false);
    onClose();
  }

  return (
    <Dialog open={Boolean(product)} onClose={close} maxWidth="sm" fullWidth>
      {product && (
        <>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogContent data-testid="quick-view-dialog">
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {[product.category, product.brand].filter(Boolean).join(" • ")}
            </Typography>
            {product.image && (
              <Box sx={{ textAlign: "center", my: 1 }}>
                {/* plain img keeps the dialog light and test-friendly */}
                <img data-testid="quick-view-image" src={product.image} alt={product.name} style={{ maxHeight: 220, maxWidth: "100%", objectFit: "contain" }} />
              </Box>
            )}
            <Typography variant="h6" data-testid="quick-view-price">${Number(product.price).toFixed(2)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {product.description || "No description yet."}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {(product.countInStock ?? 0) > 0 ? `In stock: ${product.countInStock}` : "Out of stock"}
            </Typography>
            {added && (
              <Typography data-testid="quick-view-added" variant="body2" color="success.main" sx={{ mt: 1 }}>
                Added to cart.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button data-testid="quick-view-close" onClick={close}>Close</Button>
            <Button data-testid="quick-view-details" onClick={() => { close(); onDetails(product); }}>Full details</Button>
            <Button
              data-testid="quick-view-add"
              variant="contained"
              disabled={(product.countInStock ?? 0) === 0}
              onClick={() => { onAdd(product); setAdded(true); }}
            >
              Add to cart
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
