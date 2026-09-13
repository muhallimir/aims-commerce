import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
import { OrderTracker } from "@components/OrderTracker";
import { OrderInvoice } from "@components/OrderInvoice";

export default function TrackingPage() {
  return (
    <Container data-testid="services-tracking-page" maxWidth="md" sx={{ py: 4 }}>
      <PageTitle>
        Order tracking
      </PageTitle>
      <PageIntro>
        Your parcels live on the map, plus printable invoices for every order.
      </PageIntro>
      <Box data-testid="service-tracking" sx={{ mt: 4 }}>
        <OrderTracker />
      </Box>
      <Box data-testid="service-invoice" sx={{ mt: 4, mb: 4 }}>
        <SectionTitle>Invoices</SectionTitle>
        <OrderInvoice />
      </Box>
    </Container>
  );
}
