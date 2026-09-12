import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { convert, formatCurrency, RATES_TO_USD } from "@lib/fx";

const CURRENCIES = Object.keys(RATES_TO_USD);

/**
 * Currency converter: amount and currency pair in, converted total
 * with the day's store rate.
 */
export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const result = useMemo(() => {
    const n = Number(amount);
    if (!n || n <= 0) return null;
    try {
      const c = convert(n, from, to);
      return { text: `${formatCurrency(n, from)} = ${formatCurrency(c, to)}` };
    } catch {
      return null;
    }
  }, [amount, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <Card data-testid="fx-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Pay in your currency</Typography>
        <Typography variant="body2" color="text.secondary">
          Indicative store rates, locked at checkout.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" } }}>
          <TextField
            inputProps={{ "data-testid": "fx-amount" }}
            size="small"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="fx-from-label">From</InputLabel>
            <Select data-testid="fx-from" labelId="fx-from-label" label="From" value={from} onChange={(e) => setFrom(e.target.value)}>
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="fx-to-label">To</InputLabel>
            <Select data-testid="fx-to" labelId="fx-to-label" label="To" value={to} onChange={(e) => setTo(e.target.value)}>
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography data-testid="fx-swap" onClick={swap} sx={{ cursor: "pointer", color: "primary.main", fontSize: 13 }}>
            Swap currencies
          </Typography>
        </Box>
        {result && (
          <Alert data-testid="fx-result" severity="info" sx={{ mt: 1 }}>
            {result.text}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
