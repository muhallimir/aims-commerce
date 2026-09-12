import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { coverageFor } from "@lib/service-quotes";

/**
 * Coverage checker: type a postcode, find out if we deliver,
 * how fast, and whether it costs extra.
 */
export function CoverageChecker() {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<ReturnType<typeof coverageFor> | null>(null);

  function check() {
    setResult(coverageFor(postcode));
  }

  return (
    <Card data-testid="coverage-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Do we deliver to you?</Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your postcode for delivery speed and fees.
        </Typography>
        <TextField
          data-testid="coverage-postcode-wrap"
          inputProps={{ "data-testid": "coverage-postcode" }}
          size="small"
          label="Postcode"
          placeholder="e.g. 10001"
          value={postcode}
          onChange={(e) => {
            setPostcode(e.target.value);
            setResult(null);
          }}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button
          data-testid="coverage-check"
          variant="contained"
          disabled={postcode.trim().length < 3}
          onClick={check}
          sx={{ mt: 2 }}
        >
          Check coverage
        </Button>
        {result && (
          <Alert
            data-testid="coverage-result"
            severity={result.served ? "success" : "warning"}
            sx={{ mt: 2 }}
          >
            {result.served
              ? `${result.zone === "metro" ? "Free 2-day" : "4-day"} delivery to ${postcode.trim()}${result.fee ? ` · $${result.fee.toFixed(2)} surcharge` : " · no surcharge"}.`
              : `We don't deliver to ${postcode.trim()} yet. Join the waitlist at checkout.`}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
