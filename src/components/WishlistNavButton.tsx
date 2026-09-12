import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Badge, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { loadWishlist } from "@lib/wishlistStore";

/** Header wishlist shortcut with live count. */
export function WishlistNavButton({ iconColor }: { iconColor?: string }) {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setList();
    function setList() {
      setCount(loadWishlist().length);
    }
    setList();
    window.addEventListener("aims:wishlist", refresh);
    return () => window.removeEventListener("aims:wishlist", refresh);
  }, []);

  return (
    <IconButton data-testid="wishlist-nav" aria-label="Wishlist" onClick={() => router.push("/wishlist")} sx={{ mr: 1 }}>
      <Badge badgeContent={count} color="secondary">
        <FavoriteBorderIcon sx={{ color: iconColor ?? "inherit" }} />
      </Badge>
    </IconButton>
  );
}
