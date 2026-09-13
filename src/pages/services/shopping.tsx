import { Box, Container, Typography } from "@mui/material";
import { GiftWrapPicker } from "@components/GiftWrapPicker";
import { EngravingStudio } from "@components/EngravingStudio";
import { SubscriptionPlanner } from "@components/SubscriptionPlanner";
import { BulkDesk } from "@components/BulkDesk";
import { CurrencyConverter } from "@components/CurrencyConverter";
import { BundleSaver } from "@components/BundleSaver";
import { TradeInDesk } from "@components/TradeInDesk";
import { LoyaltyPreview } from "@components/LoyaltyPreview";

export default function ShoppingPage() {
  return (
    <Container data-testid="services-shopping-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Smart shopping
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Gifts, trade-ins, bulk deals, currencies and loyalty — spend smarter.
      </Typography>
      <Box data-testid="service-giftwrap" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Gift wrap</Typography>
        <GiftWrapPicker />
      </Box>
      <Box data-testid="service-engraving" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Engraving</Typography>
        <EngravingStudio />
      </Box>
      <Box data-testid="service-subscription" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Subscriptions</Typography>
        <SubscriptionPlanner />
      </Box>
      <Box data-testid="service-bulk" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Bulk orders</Typography>
        <BulkDesk />
      </Box>
      <Box data-testid="service-fx" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Currency converter</Typography>
        <CurrencyConverter />
      </Box>
      <Box data-testid="service-bundle" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Bundle savings</Typography>
        <BundleSaver />
      </Box>
      <Box data-testid="service-tradein" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Trade-in</Typography>
        <TradeInDesk />
      </Box>
      <Box data-testid="service-loyalty" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Loyalty rewards</Typography>
        <LoyaltyPreview />
      </Box>
    </Container>
  );
}
