import { Box, LinearProgress, Typography } from "@mui/material";
import useThemeMode from "src/hooks/useThemeMode";
import { shippingProgress, FREE_SHIPPING_THRESHOLD } from "@lib/shippingProgress";

/** Free-shipping meter above the cart summary. */
export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const p = shippingProgress(subtotal);
  const { isDarkMode } = useThemeMode();
  return (
    <Box data-testid="free-shipping-bar" sx={{ mb: 2 }}>
      <Typography data-testid="free-shipping-text" variant="body2" color={p.unlocked ? "success.main" : isDarkMode ? "common.white" : "text.secondary"}>
        {p.unlocked
          ? `Free shipping unlocked on your $${p.subtotal.toFixed(2)} order.`
          : `$${p.remaining.toFixed(2)} away from free shipping (over $${FREE_SHIPPING_THRESHOLD}).`}
      </Typography>
      <LinearProgress data-testid="free-shipping-progress" variant="determinate" value={p.percent} sx={{ mt: 0.5, height: 8, borderRadius: 4 }} />
    </Box>
  );
}
