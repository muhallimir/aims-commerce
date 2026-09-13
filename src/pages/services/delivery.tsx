import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
import { DeliveryEstimator } from "@components/DeliveryEstimator";
import { CoverageChecker } from "@components/CoverageChecker";
import { SlotBooking } from "@components/SlotBooking";
import { CarbonOffsetter } from "@components/CarbonOffsetter";
import { EcoPackagingPicker } from "@components/EcoPackagingPicker";

export default function DeliveryPage() {
  return (
    <Container data-testid="services-delivery-page" maxWidth="md" sx={{ py: 4 }}>
      <PageTitle>
        Delivery
      </PageTitle>
      <PageIntro>
        Rates, coverage, windows and green options before you buy.
      </PageIntro>
      <Box data-testid="service-estimator" sx={{ mt: 4 }}>
        <SectionTitle>Delivery estimates</SectionTitle>
        <DeliveryEstimator />
      </Box>
      <Box data-testid="service-coverage" sx={{ mt: 4 }}>
        <SectionTitle>Delivery coverage</SectionTitle>
        <CoverageChecker />
      </Box>
      <Box data-testid="service-slots" sx={{ mt: 4 }}>
        <SectionTitle>Delivery windows</SectionTitle>
        <SlotBooking />
      </Box>
      <Box data-testid="service-carbon" sx={{ mt: 4 }}>
        <SectionTitle>Carbon-neutral delivery</SectionTitle>
        <CarbonOffsetter />
      </Box>
      <Box data-testid="service-eco" sx={{ mt: 4, mb: 4 }}>
        <SectionTitle>Green packaging</SectionTitle>
        <EcoPackagingPicker />
      </Box>
    </Container>
  );
}
