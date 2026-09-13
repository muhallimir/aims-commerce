import { Box, Card, CardActionArea, CardContent, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

const HUBS = [
  { id: "tracking", title: "Order tracking", blurb: "Live parcel map plus printable invoices.", href: "/services/tracking" },
  { id: "delivery", title: "Delivery", blurb: "Rates, coverage, windows and green options.", href: "/services/delivery" },
  { id: "returns", title: "Returns", blurb: "Doorstep pickup booked in seconds.", href: "/services/returns" },
  { id: "protection", title: "Protection and repairs", blurb: "Parcel cover, warranties, price match, fixes.", href: "/services/protection" },
  { id: "home-services", title: "Home services", blurb: "Assembly, installation, white glove, tailoring.", href: "/services/home-services" },
  { id: "shopping", title: "Smart shopping", blurb: "Gifts, trade-ins, bulk deals and loyalty.", href: "/services/shopping" },
  { id: "help", title: "Help and answers", blurb: "Addresses, taxes, FAQs and the flagship store.", href: "/services/help" },
];

export default function ServicesHub() {
  const router = useRouter();
  return (
    <Container data-testid="services-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Services
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Thirty services, seven rooms. Pick where to go.
      </Typography>
      <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 4 }}>
        {HUBS.map((h) => (
          <Card key={h.id} data-testid={`hub-${h.id}`} variant="outlined">
            <CardActionArea data-testid={`hub-go-${h.id}`} onClick={() => router.push(h.href)} sx={{ p: 1 }}>
              <CardContent>
                <Typography variant="h6">{h.title}</Typography>
                <Typography variant="body2" color="text.secondary">{h.blurb}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
