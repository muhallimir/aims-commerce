import { Box, Container, Typography } from "@mui/material";
import { OrderTracker } from "@components/OrderTracker";
import { DeliveryEstimator } from "@components/DeliveryEstimator";
import { ReturnsPickup } from "@components/ReturnsPickup";
import { CoverageChecker } from "@components/CoverageChecker";
import { SlotBooking } from "@components/SlotBooking";

export default function ServicesPage() {
  return (
    <Container data-testid="services-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Services
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Track your parcels live on the map, estimate delivery before you
        buy, and book doorstep returns in seconds.
      </Typography>

      <Box data-testid="service-tracking" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Order tracking
        </Typography>
        <OrderTracker />
      </Box>

      <Box data-testid="service-estimator" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Delivery estimates
        </Typography>
        <DeliveryEstimator />
      </Box>

      <Box data-testid="service-returns" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Returns pickup
        </Typography>
        <ReturnsPickup />
      </Box>

      <Box data-testid="service-coverage" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Delivery coverage
        </Typography>
        <CoverageChecker />
      </Box>

      <Box data-testid="service-slots" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Delivery windows
        </Typography>
        <SlotBooking />
      </Box>
    </Container>
  );
}
