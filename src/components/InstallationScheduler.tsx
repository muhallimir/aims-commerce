import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { coverageFor, installOptions } from "@lib/service-quotes";

/**
 * Installation scheduling: postcode eligibility, then real visit
 * days with time windows and a booking reference.
 */
export function InstallationScheduler() {
  const [postcode, setPostcode] = useState("");
  const [checked, setChecked] = useState(false);
  const [served, setServed] = useState(false);
  const [choice, setChoice] = useState("");
  const [booking, setBooking] = useState<string | null>(null);

  const options = useMemo(() => installOptions([1, 2, 3]), []);

  function check() {
    const c = coverageFor(postcode);
    setServed(c.served);
    setChecked(true);
    setBooking(null);
  }

  return (
    <Card data-testid="install-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Appliance installation</Typography>
        <Typography variant="body2" color="text.secondary">
          Certified installers for kitchen and laundry appliances.
        </Typography>
        <TextField
          inputProps={{ "data-testid": "install-postcode" }}
          size="small"
          label="Postcode"
          value={postcode}
          onChange={(e) => {
            setPostcode(e.target.value);
            setChecked(false);
            setBooking(null);
          }}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button data-testid="install-check" variant="outlined" disabled={postcode.trim().length < 3} onClick={check} sx={{ mt: 1 }}>
          Check area
        </Button>
        {checked && !served && (
          <Alert data-testid="install-unserved" severity="warning" sx={{ mt: 2 }}>
            Our installers don&apos;t cover {postcode.trim()} yet.
          </Alert>
        )}
        {checked && served && (
          <>
            <FormControl sx={{ mt: 2 }}>
              <RadioGroup value={choice} onChange={(e) => { setChoice(e.target.value); setBooking(null); }}>
                {options.flatMap((o) =>
                  o.windows.map((w) => {
                    const v = `${o.date} ${w}`;
                    return (
                      <FormControlLabel
                        key={v}
                        value={v}
                        control={<Radio data-testid={`install-option-${o.date}`} />}
                        label={`${o.date}, ${w}`}
                      />
                    );
                  })
                )}
              </RadioGroup>
            </FormControl>
            <Button data-testid="install-book" variant="contained" disabled={!choice} onClick={() => setBooking(`IN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)} sx={{ mt: 1 }}>
              Book installation
            </Button>
          </>
        )}
        {booking && (
          <Alert data-testid="install-result" severity="success" sx={{ mt: 2 }}>
            Installation {booking}: {choice}. The installer calls 30 minutes ahead.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
