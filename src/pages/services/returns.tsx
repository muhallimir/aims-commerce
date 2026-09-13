import { Box, Container, Typography } from "@mui/material";
import { ReturnsPickup } from "@components/ReturnsPickup";

export default function ReturnsPage() {
  return (
    <Container data-testid="services-returns-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Returns
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Doorstep pickup in seconds. Instant quote, no phone calls.
      </Typography>
      <Box data-testid="service-returns" sx={{ mt: 4, mb: 4 }}>
        <ReturnsPickup />
      </Box>
    </Container>
  );
}
