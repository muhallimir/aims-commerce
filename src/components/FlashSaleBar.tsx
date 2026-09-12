import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { formatLeft, nextMidnight, timeLeft } from "@lib/countdown";

/**
 * Flash sale strip: countdown to midnight plus a CTA that scrolls
 * shoppers into the grid.
 */
export function FlashSaleBar() {
  const endsAt = useMemo(() => nextMidnight(), []);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = now ? timeLeft(now, endsAt) : null;

  return (
    <Box
      data-testid="flash-sale-bar"
      sx={{
        bgcolor: "error.main",
        color: "error.contrastText",
        borderRadius: 2,
        px: 2,
        py: 1.5,
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Flash sale ends in <span data-testid="flash-sale-timer">{t ? formatLeft(t) : "--h --m --s"}</span>
      </Typography>
      <Button
        data-testid="flash-sale-cta"
        variant="contained"
        color="warning"
        onClick={() => document.getElementById("store-grid")?.scrollIntoView({ behavior: "smooth" })}
      >
        Shop the sale
      </Button>
    </Box>
  );
}
