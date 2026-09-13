import { Box, Container } from "@mui/material";
import { PageTitle, PageIntro, SectionTitle } from "@components/ServiceText";
import { AssemblyBooking } from "@components/AssemblyBooking";
import { InstallationScheduler } from "@components/InstallationScheduler";
import { WhiteGlovePicker } from "@components/WhiteGlovePicker";
import { AlterationCounter } from "@components/AlterationCounter";
import { RentalPlanner } from "@components/RentalPlanner";

export default function HomeServicesPage() {
  return (
    <Container data-testid="services-home-page" maxWidth="md" sx={{ py: 4 }}>
      <PageTitle>
        Home services
      </PageTitle>
      <PageIntro>
        Assembly, installation, white-glove delivery, tailoring and try-before-you-buy.
      </PageIntro>
      <Box data-testid="service-assembly" sx={{ mt: 4 }}>
        <SectionTitle>Furniture assembly</SectionTitle>
        <AssemblyBooking />
      </Box>
      <Box data-testid="service-install" sx={{ mt: 4 }}>
        <SectionTitle>Appliance installation</SectionTitle>
        <InstallationScheduler />
      </Box>
      <Box data-testid="service-whiteglove" sx={{ mt: 4 }}>
        <SectionTitle>White-glove delivery</SectionTitle>
        <WhiteGlovePicker />
      </Box>
      <Box data-testid="service-alteration" sx={{ mt: 4 }}>
        <SectionTitle>Tailoring</SectionTitle>
        <AlterationCounter />
      </Box>
      <Box data-testid="service-rental" sx={{ mt: 4, mb: 4 }}>
        <SectionTitle>Try before you buy</SectionTitle>
        <RentalPlanner />
      </Box>
    </Container>
  );
}
