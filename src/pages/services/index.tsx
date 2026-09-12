import { Box, Container, Typography } from "@mui/material";
import { OrderTracker } from "@components/OrderTracker";
import { DeliveryEstimator } from "@components/DeliveryEstimator";
import { ReturnsPickup } from "@components/ReturnsPickup";
import { CoverageChecker } from "@components/CoverageChecker";
import { SlotBooking } from "@components/SlotBooking";
import { InsuranceCalculator } from "@components/InsuranceCalculator";
import { WarrantyPlanner } from "@components/WarrantyPlanner";
import { PriceMatchDesk } from "@components/PriceMatchDesk";
import { RepairDesk } from "@components/RepairDesk";
import { TradeInDesk } from "@components/TradeInDesk";
import { GiftWrapPicker } from "@components/GiftWrapPicker";

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

      <Box data-testid="service-slots" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Delivery windows
        </Typography>
        <SlotBooking />
      </Box>

      <Box data-testid="service-insurance" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Parcel protection
        </Typography>
        <InsuranceCalculator />
      </Box>

      <Box data-testid="service-warranty" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Extended warranty
        </Typography>
        <WarrantyPlanner />
      </Box>

      <Box data-testid="service-pricematch" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Price match
        </Typography>
        <PriceMatchDesk />
      </Box>

      <Box data-testid="service-repair" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Repairs
        </Typography>
        <RepairDesk />
      </Box>

      <Box data-testid="service-tradein" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Trade-in
        </Typography>
        <TradeInDesk />
      </Box>

      <Box data-testid="service-giftwrap" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Gift wrap
        </Typography>
        <GiftWrapPicker />
      </Box>
    </Container>
  );
}
