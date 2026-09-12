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
import { EngravingStudio } from "@components/EngravingStudio";
import { SubscriptionPlanner } from "@components/SubscriptionPlanner";
import { EcoPackagingPicker } from "@components/EcoPackagingPicker";
import { CarbonOffsetter } from "@components/CarbonOffsetter";
import { AssemblyBooking } from "@components/AssemblyBooking";
import { InstallationScheduler } from "@components/InstallationScheduler";
import { WhiteGlovePicker } from "@components/WhiteGlovePicker";
import { AlterationCounter } from "@components/AlterationCounter";
import { RentalPlanner } from "@components/RentalPlanner";
import { BulkDesk } from "@components/BulkDesk";
import { CurrencyConverter } from "@components/CurrencyConverter";

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

      <Box data-testid="service-giftwrap" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Gift wrap
        </Typography>
        <GiftWrapPicker />
      </Box>

      <Box data-testid="service-engraving" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Engraving
        </Typography>
        <EngravingStudio />
      </Box>

      <Box data-testid="service-subscription" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Subscriptions
        </Typography>
        <SubscriptionPlanner />
      </Box>

      <Box data-testid="service-eco" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Green packaging
        </Typography>
        <EcoPackagingPicker />
      </Box>

      <Box data-testid="service-carbon" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Carbon-neutral delivery
        </Typography>
        <CarbonOffsetter />
      </Box>

      <Box data-testid="service-assembly" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Furniture assembly
        </Typography>
        <AssemblyBooking />
      </Box>

      <Box data-testid="service-install" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Appliance installation
        </Typography>
        <InstallationScheduler />
      </Box>

      <Box data-testid="service-whiteglove" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          White-glove delivery
        </Typography>
        <WhiteGlovePicker />
      </Box>

      <Box data-testid="service-alteration" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Tailoring
        </Typography>
        <AlterationCounter />
      </Box>

      <Box data-testid="service-rental" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Try before you buy
        </Typography>
        <RentalPlanner />
      </Box>

      <Box data-testid="service-bulk" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Bulk orders
        </Typography>
        <BulkDesk />
      </Box>

      <Box data-testid="service-fx" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Currency converter
        </Typography>
        <CurrencyConverter />
      </Box>
    </Container>
  );
}
