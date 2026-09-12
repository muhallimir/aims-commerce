import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Metro postcodes: 2 days free. Regional areas: 4 days with a small surcharge. Exact dates per service level are in the delivery estimator above.",
  },
  {
    q: "How do returns work?",
    a: "Book a doorstep pickup above with your order number. The courier brings the label; refunds land 3–5 days after the warehouse scan.",
  },
  {
    q: "What if my parcel arrives damaged?",
    a: "Photograph the box and the item, then start a return within 14 days. Orders with parcel protection are refunded first, no inspection wait.",
  },
  {
    q: "Do you price-match?",
    a: "Yes, against Amazon, Best Buy, Target, Walmart and Costco, as long as their price is lower and the item is in stock. Check instantly at the price-match desk above.",
  },
];

/**
 * Service FAQ: the answers shoppers actually ask, expandable
 * one at a time.
 */
export function ServiceFaq() {
  const [open, setOpen] = useState(0);

  return (
    <Card data-testid="faq-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Questions, answered</Typography>
        {FAQS.map((f, i) => (
          <Accordion
            key={f.q}
            data-testid={`faq-item-${i}`}
            expanded={open === i}
            onChange={() => setOpen(i)}
          >
            <AccordionSummary data-testid={`faq-toggle-${i}`}>
              <Typography fontWeight={600}>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography data-testid={`faq-answer-${i}`} variant="body2" color="text.secondary">
                {f.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
}
