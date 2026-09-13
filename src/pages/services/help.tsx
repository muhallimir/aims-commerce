import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
import { AddressChecker } from "@components/AddressChecker";
import { TaxEstimator } from "@components/TaxEstimator";
import { ServiceFaq } from "@components/ServiceFaq";
import { VisitStore } from "@components/VisitStore";
import { BrowsingTrail } from "@components/BrowsingTrail";

export default function HelpPage() {
  return (
    <Container data-testid="services-help-page" maxWidth="md" sx={{ py: 4 }}>
      <PageTitle>
        Help and answers
      </PageTitle>
      <PageIntro>
        Addresses, taxes, FAQs, the flagship store and your browsing trail.
      </PageIntro>
      <Box data-testid="service-address" sx={{ mt: 4 }}>
        <SectionTitle>Address check</SectionTitle>
        <AddressChecker />
      </Box>
      <Box data-testid="service-tax" sx={{ mt: 4 }}>
        <SectionTitle>Tax estimates</SectionTitle>
        <TaxEstimator />
      </Box>
      <Box data-testid="service-faq" sx={{ mt: 4 }}>
        <SectionTitle>Good to know</SectionTitle>
        <ServiceFaq />
      </Box>
      <Box data-testid="service-visit" sx={{ mt: 4 }}>
        <SectionTitle>Visit us</SectionTitle>
        <VisitStore />
      </Box>
      <Box data-testid="service-recent" sx={{ mt: 4, mb: 4 }}>
        <SectionTitle>Recently viewed</SectionTitle>
        <BrowsingTrail />
      </Box>
    </Container>
  );
}
