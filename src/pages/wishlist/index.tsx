import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { loadWishlist, saveWishlist, type SavedProduct } from "@lib/wishlistStore";
import { updateCartList } from "@store/cart.slice";

/**
 * Wishlist page: saved products with move-to-cart and remove.
 */
export default function WishlistPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [list, setList] = useState<SavedProduct[]>([]);

  useEffect(() => {
    setList(loadWishlist());
    const refresh = () => setList(loadWishlist());
    window.addEventListener("aims:wishlist", refresh);
    return () => window.removeEventListener("aims:wishlist", refresh);
  }, []);

  function remove(id: string) {
    const next = list.filter((p) => p._id !== id);
    setList(next);
    saveWishlist(next);
  }

  function moveToCart(p: SavedProduct) {
    dispatch(updateCartList({ ...p, countInStock: 99 }));
    remove(p._id);
    router.push("/store/cart");
  }

  return (
    <Container data-testid="wishlist-page" maxWidth="md" sx={{ py: 4, minHeight: "60vh" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Wishlist
      </Typography>
      {list.length === 0 ? (
        <Alert data-testid="wishlist-empty" severity="info">
          Nothing saved yet. Tap the heart on any product to keep it here.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {list.map((p) => (
            <Card key={p._id} data-testid={`wishlist-item-${p._id}`} variant="outlined">
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">${Number(p.price).toFixed(2)}</Typography>
                </Box>
                <Button data-testid={`wishlist-move-${p._id}`} size="small" variant="contained" onClick={() => moveToCart(p)}>
                  Move to cart
                </Button>
                <Button data-testid={`wishlist-remove-${p._id}`} size="small" color="error" onClick={() => remove(p._id)}>
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
