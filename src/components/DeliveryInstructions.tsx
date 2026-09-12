import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

const KEY = "aims-delivery-note";
const MAX = 200;

export function loadNote(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveNote(note: string): void {
  try {
    localStorage.setItem(KEY, note);
  } catch {}
}

/**
 * Delivery instructions: gate codes, drop-off spots, quiet hours.
 * Saved on device and shown back as the courier sees it.
 */
export function DeliveryInstructions() {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(loadNote());
  }, []);

  return (
    <Box data-testid="delivery-instructions" sx={{ mt: 2 }}>
      <TextField
        inputProps={{ "data-testid": "delivery-note-input", maxLength: MAX }}
        label="Delivery instructions (optional)"
        placeholder="e.g. Gate code 4410, leave with concierge"
        multiline
        rows={2}
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          saveNote(e.target.value);
        }}
        helperText={`${note.length}/${MAX}`}
        fullWidth
      />
      {note.trim().length > 0 && (
        <Typography data-testid="delivery-note-preview" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Courier will see: “{note.trim()}”.
        </Typography>
      )}
    </Box>
  );
}
