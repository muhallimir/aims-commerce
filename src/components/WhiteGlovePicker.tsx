import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
} from "@mui/material";
import { whiteGloveQuote } from "@lib/service-quotes";

/**
 * White-glove delivery: stairs, bulk and rooms in, service tier
 * and honest fee out.
 */
export function WhiteGlovePicker() {
  const [floor, setFloor] = useState(0);
  const [bulky, setBulky] = useState(false);
  const [rooms, setRooms] = useState(1);

  const q = useMemo(() => whiteGloveQuote(floor, bulky, rooms), [floor, bulky, rooms]);

  return (
    <Card data-testid="whiteglove-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">White-glove delivery</Typography>
        <Typography variant="body2" color="text.secondary">
          Room of choice, packaging removed, shoes on covers.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Floor (no lift): <span data-testid="whiteglove-floor-label">{floor}</span>
          </Typography>
          <Slider data-testid="whiteglove-floor" value={floor} min={0} max={6} step={1} onChange={(_, v) => setFloor(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Rooms: <span data-testid="whiteglove-rooms-label">{rooms}</span>
          </Typography>
          <Slider data-testid="whiteglove-rooms" value={rooms} min={1} max={5} step={1} onChange={(_, v) => setRooms(v as number)} valueLabelDisplay="auto" />
        </Box>
        <FormControlLabel
          control={<Checkbox data-testid="whiteglove-bulky" checked={bulky} onChange={(e) => setBulky(e.target.checked)} />}
          label="Bulky item (sofa, piano, gym rig)"
        />
        <Alert data-testid="whiteglove-result" severity="info" sx={{ mt: 1 }}>
          <span data-testid="whiteglove-tier" style={{ textTransform: "capitalize" }}>{q.tier}</span> service · <strong>${q.fee.toFixed(2)}</strong>.
        </Alert>
      </CardContent>
    </Card>
  );
}
