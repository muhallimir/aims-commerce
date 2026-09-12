import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { warrantyQuote } from "@lib/service-quotes";

/**
 * Extended warranty: item price plus cover length, instant premium
 * with the exact cover list.
 */
export function WarrantyPlanner() {
  const [price, setPrice] = useState(500);
  const [years, setYears] = useState<1 | 2 | 3>(2);

  const q = useMemo(() => warrantyQuote(price, years), [price, years]);

  return (
    <Card data-testid="warranty-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Cover it longer</Typography>
        <Typography variant="body2" color="text.secondary">
          Extended warranty beyond the standard 12 months.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Item price: <span data-testid="warranty-price-label">${price}</span>
          </Typography>
          <Slider
            data-testid="warranty-price"
            value={price}
            min={50}
            max={5000}
            step={50}
            onChange={(_, v) => setPrice(v as number)}
            valueLabelDisplay="auto"
          />
        </Box>
        <FormControl size="small" sx={{ mt: 1, minWidth: 160 }}>
          <InputLabel id="warranty-years-label">Cover length</InputLabel>
          <Select
            data-testid="warranty-years"
            labelId="warranty-years-label"
            label="Cover length"
            value={years}
            onChange={(e) => setYears(e.target.value as 1 | 2 | 3)}
          >
            <MenuItem value={1}>1 extra year</MenuItem>
            <MenuItem value={2}>2 extra years</MenuItem>
            <MenuItem value={3}>3 extra years</MenuItem>
          </Select>
        </FormControl>
        <Alert data-testid="warranty-result" severity="info" sx={{ mt: 2 }}>
          {years} extra year(s): <strong>${q.premium.toFixed(2)}</strong>
        </Alert>
        <List dense data-testid="warranty-cover">
          {q.perYear.map((c) => (
            <ListItem key={c}>
              <ListItemText primary={c} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
