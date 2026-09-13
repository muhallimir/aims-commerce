import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
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
      <PageTitle>
        Smart shopping
      </PageTitle>
      <PageIntro>
        Gifts, trade-ins, bulk deals, currencies and loyalty — spend smarter.
      </PageIntro>
      <Box data-testid="service-giftwrap" sx={{ mt: 4 }}>
        <SectionTitle>Gift wrap</SectionTitle>
        <GiftWrapPicker />
      </Box>
      <Box data-testid="service-engraving" sx={{ mt: 4 }}>
        <SectionTitle>Engraving</SectionTitle>
        <EngravingStudio />
      </Box>
      <Box data-testid="service-subscription" sx={{ mt: 4 }}>
        <SectionTitle>Subscriptions</SectionTitle>
        <SubscriptionPlanner />
      </Box>
      <Box data-testid="service-bulk" sx={{ mt: 4 }}>
        <SectionTitle>Bulk orders</SectionTitle>
        <BulkDesk />
      </Box>
      <Box data-testid="service-fx" sx={{ mt: 4 }}>
        <SectionTitle>Currency converter</SectionTitle>
        <CurrencyConverter />
      </Box>
      <Box data-testid="service-bundle" sx={{ mt: 4 }}>
        <SectionTitle>Bundle savings</SectionTitle>
        <BundleSaver />
      </Box>
      <Box data-testid="service-tradein" sx={{ mt: 4 }}>
        <SectionTitle>Trade-in</SectionTitle>
        <TradeInDesk />
      </Box>
      <Box data-testid="service-loyalty" sx={{ mt: 4, mb: 4 }}>
        <SectionTitle>Loyalty rewards</SectionTitle>
        <LoyaltyPreview />
      </Box>
    </Container>
  );
}
