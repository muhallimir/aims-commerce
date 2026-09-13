import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
import { InsuranceCalculator } from "@components/InsuranceCalculator";
import { WarrantyPlanner } from "@components/WarrantyPlanner";
import { PriceMatchDesk } from "@components/PriceMatchDesk";
import { RepairDesk } from "@components/RepairDesk";

export default function ProtectionPage() {
  return (
    <Container data-testid="services-protection-page" maxWidth="md" sx={{ py: 4 }}>
      <PageTitle>
        Protection and repairs
      </PageTitle>
      <PageIntro>
        Cover the parcel, extend the warranty, match a price, fix what broke.
      </PageIntro>
      <Box data-testid="service-insurance" sx={{ mt: 4 }}>
        <SectionTitle>Parcel protection</SectionTitle>
        <InsuranceCalculator />
      </Box>
      <Box data-testid="service-warranty" sx={{ mt: 4 }}>
        <SectionTitle>Extended warranty</SectionTitle>
        <WarrantyPlanner />
      </Box>
      <Box data-testid="service-pricematch" sx={{ mt: 4 }}>
        <SectionTitle>Price match</SectionTitle>
        <PriceMatchDesk />
      </Box>
      <Box data-testid="service-repair" sx={{ mt: 4, mb: 4 }}>
        <SectionTitle>Repairs</SectionTitle>
        <RepairDesk />
      </Box>
    </Container>
  );
}
