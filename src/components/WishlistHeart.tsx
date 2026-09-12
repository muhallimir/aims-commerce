import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { inWishlist, loadWishlist, saveWishlist, toggleWishlist, type SavedProduct } from "@lib/wishlistStore";

/** Heart toggle wired to the on-device wishlist. */
export function WishlistHeart({ item }: { item: SavedProduct }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(inWishlist(loadWishlist(), item._id));
  }, [item._id]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const next = toggleWishlist(loadWishlist(), item);
    saveWishlist(next.list);
    setSaved(next.saved);
    window.dispatchEvent(new Event("aims:wishlist"));
  }

  return (
    <IconButton
      data-testid="wishlist-heart"
      data-active={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      size="small"
      onClick={toggle}
      sx={{ position: "absolute", bottom: 8, right: 8, zIndex: 1, bgcolor: "rgba(255,255,255,.9)" }}
    >
      {saved ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
