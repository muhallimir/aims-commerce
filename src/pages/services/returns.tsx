import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
import { ReturnsPickup } from "@components/ReturnsPickup";

export default function ReturnsPage() {
  return (
    <Container data-testid="services-returns-page" maxWidth="md" sx={{ py: 4 }}>
      <PageTitle>
        Returns
      </PageTitle>
      <PageIntro>
        Doorstep pickup in seconds. Instant quote, no phone calls.
      </PageIntro>
      <Box data-testid="service-returns" sx={{ mt: 4, mb: 4 }}>
        <ReturnsPickup />
      </Box>
    </Container>
  );
}
