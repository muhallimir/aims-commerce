import { Box, Container, Typography } from "@mui/material";
import { OrderTracker } from "@components/OrderTracker";
import { OrderInvoice } from "@components/OrderInvoice";

export default function TrackingPage() {
  return (
    <Container data-testid="services-tracking-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Order tracking
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your parcels live on the map, plus printable invoices for every order.
      </Typography>
      <Box data-testid="service-tracking" sx={{ mt: 4 }}>
        <OrderTracker />
      </Box>
      <Box data-testid="service-invoice" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Invoices
        </Typography>
        <OrderInvoice />
      </Box>
    </Container>
  );
}
