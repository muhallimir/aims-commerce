import { Box, Container, Typography } from "@mui/material";
import { InsuranceCalculator } from "@components/InsuranceCalculator";
import { WarrantyPlanner } from "@components/WarrantyPlanner";
import { PriceMatchDesk } from "@components/PriceMatchDesk";
import { RepairDesk } from "@components/RepairDesk";

export default function ProtectionPage() {
  return (
    <Container data-testid="services-protection-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Protection and repairs
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Cover the parcel, extend the warranty, match a price, fix what broke.
      </Typography>
      <Box data-testid="service-insurance" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Parcel protection</Typography>
        <InsuranceCalculator />
      </Box>
      <Box data-testid="service-warranty" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Extended warranty</Typography>
        <WarrantyPlanner />
      </Box>
      <Box data-testid="service-pricematch" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Price match</Typography>
        <PriceMatchDesk />
      </Box>
      <Box data-testid="service-repair" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Repairs</Typography>
        <RepairDesk />
      </Box>
    </Container>
  );
}
