import { Box, Container, Typography } from "@mui/material";
import { AssemblyBooking } from "@components/AssemblyBooking";
import { InstallationScheduler } from "@components/InstallationScheduler";
import { WhiteGlovePicker } from "@components/WhiteGlovePicker";
import { AlterationCounter } from "@components/AlterationCounter";
import { RentalPlanner } from "@components/RentalPlanner";

export default function HomeServicesPage() {
  return (
    <Container data-testid="services-home-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Home services
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Assembly, installation, white-glove delivery, tailoring and try-before-you-buy.
      </Typography>
      <Box data-testid="service-assembly" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Furniture assembly</Typography>
        <AssemblyBooking />
      </Box>
      <Box data-testid="service-install" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Appliance installation</Typography>
        <InstallationScheduler />
      </Box>
      <Box data-testid="service-whiteglove" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>White-glove delivery</Typography>
        <WhiteGlovePicker />
      </Box>
      <Box data-testid="service-alteration" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Tailoring</Typography>
        <AlterationCounter />
      </Box>
      <Box data-testid="service-rental" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Try before you buy</Typography>
        <RentalPlanner />
      </Box>
    </Container>
  );
}
