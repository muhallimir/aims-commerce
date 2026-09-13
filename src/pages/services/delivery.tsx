import { Box, Container, Typography } from "@mui/material";
import { DeliveryEstimator } from "@components/DeliveryEstimator";
import { CoverageChecker } from "@components/CoverageChecker";
import { SlotBooking } from "@components/SlotBooking";
import { CarbonOffsetter } from "@components/CarbonOffsetter";
import { EcoPackagingPicker } from "@components/EcoPackagingPicker";

export default function DeliveryPage() {
  return (
    <Container data-testid="services-delivery-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Delivery
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Rates, coverage, windows and green options before you buy.
      </Typography>
      <Box data-testid="service-estimator" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Delivery estimates</Typography>
        <DeliveryEstimator />
      </Box>
      <Box data-testid="service-coverage" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Delivery coverage</Typography>
        <CoverageChecker />
      </Box>
      <Box data-testid="service-slots" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Delivery windows</Typography>
        <SlotBooking />
      </Box>
      <Box data-testid="service-carbon" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Carbon-neutral delivery</Typography>
        <CarbonOffsetter />
      </Box>
      <Box data-testid="service-eco" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Green packaging</Typography>
        <EcoPackagingPicker />
      </Box>
    </Container>
  );
}
