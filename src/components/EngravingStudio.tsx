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
import { engravingQuote } from "@lib/service-quotes";

const MATERIALS = ["wood", "metal", "glass", "leather"];

/**
 * Engraving studio: live text preview on the material, honest fee.
 */
export function EngravingStudio() {
  const [text, setText] = useState("A. Muhalli");
  const [material, setMaterial] = useState("metal");

  const q = useMemo(() => engravingQuote(text, material), [text, material]);

  return (
    <Card data-testid="engraving-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Make it yours</Typography>
        <Typography variant="body2" color="text.secondary">
          Hand engraving. First 10 characters free, 50 max.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" } }}>
          <TextField
            inputProps={{ "data-testid": "engraving-text", maxLength: 60 }}
            size="small"
            label="Engraving text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            helperText={`${text.length}/50 characters`}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="engraving-mat-label">Material</InputLabel>
            <Select data-testid="engraving-material" labelId="engraving-mat-label" label="Material" value={material} onChange={(e) => setMaterial(e.target.value)}>
              {MATERIALS.map((m) => (
                <MenuItem key={m} value={m} sx={{ textTransform: "capitalize" }}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box data-testid="engraving-preview" sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1, textAlign: "center", fontStyle: "italic" }}>
          {text || "Your text here"}
        </Box>
        <Alert data-testid="engraving-result" severity={q.ok ? "info" : "warning"} sx={{ mt: 2 }}>
          {q.ok ? <>Engraving: <strong>${q.fee.toFixed(2)}</strong> · {q.note}</> : q.note}
        </Alert>
      </CardContent>
    </Card>
  );
}
