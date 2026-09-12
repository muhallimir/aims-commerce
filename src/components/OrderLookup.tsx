import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, TextField } from "@mui/material";

export function orderDetailPath(orderId: string): string {
  return `/admin/orders/${orderId.trim()}`;
}

/** Order lookup: paste an ID, jump straight to the order. */
export function OrderLookup() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  function go() {
    if (orderId.trim().length >= 3) router.push(orderDetailPath(orderId));
  }

  return (
    <Box data-testid="order-lookup" sx={{ display: "flex", gap: 1, mb: 2 }}>
      <TextField
        inputProps={{ "data-testid": "order-lookup-input" }}
        size="small"
        label="Order ID"
        placeholder="Paste an order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") go();
        }}
        fullWidth
      />
      <Button data-testid="order-lookup-go" variant="contained" disabled={orderId.trim().length < 3} onClick={go}>
        Open
      </Button>
    </Box>
  );
}
