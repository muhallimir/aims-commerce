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
import { formatAddress, validateAddress } from "@lib/address-validate";

const COUNTRIES = ["US", "GB", "CA", "AU", "SG"];

/**
 * Address checker: type the shipping address the way the courier
 * sees it, catch mistakes before checkout rejects them.
 */
export function AddressChecker() {
  const [line1, setLine1] = useState("1 Main St");
  const [city, setCity] = useState("New York");
  const [postal, setPostal] = useState("10001");
  const [country, setCountry] = useState("US");

  const verdict = useMemo(
    () => validateAddress({ line1, city, postalCode: postal, country }),
    [line1, city, postal, country]
  );
  const formatted = useMemo(
    () => (verdict.ok ? formatAddress({ line1, city, postalCode: postal, country }) : null),
    [verdict.ok, line1, city, postal, country]
  );

  return (
    <Card data-testid="address-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Will the courier find you?</Typography>
        <Typography variant="body2" color="text.secondary">
          Validate the address format before checkout does it for you.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <TextField inputProps={{ "data-testid": "address-line1" }} size="small" label="Street" value={line1} onChange={(e) => setLine1(e.target.value)} />
          <TextField inputProps={{ "data-testid": "address-city" }} size="small" label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <TextField inputProps={{ "data-testid": "address-postal" }} size="small" label="Postcode" value={postal} onChange={(e) => setPostal(e.target.value)} />
          <FormControl fullWidth size="small">
            <InputLabel id="address-country-label">Country</InputLabel>
            <Select data-testid="address-country" labelId="address-country-label" label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Alert data-testid="address-result" severity={verdict.ok ? "success" : "error"} sx={{ mt: 2 }}>
          {verdict.ok ? (
            <>Looks deliverable: {formatted}.</>
          ) : (
            <>{verdict.errors.join(". ")}.</>
          )}
        </Alert>
      </CardContent>
    </Card>
  );
}
