import { Box, Container, Typography } from "@mui/material";
import { AddressChecker } from "@components/AddressChecker";
import { TaxEstimator } from "@components/TaxEstimator";
import { ServiceFaq } from "@components/ServiceFaq";
import { VisitStore } from "@components/VisitStore";
import { BrowsingTrail } from "@components/BrowsingTrail";

export default function HelpPage() {
  return (
    <Container data-testid="services-help-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Help and answers
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Addresses, taxes, FAQs, the flagship store and your browsing trail.
      </Typography>
      <Box data-testid="service-address" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Address check</Typography>
        <AddressChecker />
      </Box>
      <Box data-testid="service-tax" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Tax estimates</Typography>
        <TaxEstimator />
      </Box>
      <Box data-testid="service-faq" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Good to know</Typography>
        <ServiceFaq />
      </Box>
      <Box data-testid="service-visit" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Visit us</Typography>
        <VisitStore />
      </Box>
      <Box data-testid="service-recent" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Recently viewed</Typography>
        <BrowsingTrail />
      </Box>
    </Container>
  );
}
