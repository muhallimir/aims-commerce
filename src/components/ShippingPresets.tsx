import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

const KEY = "aims-shipping-presets";

export interface ShippingPreset {
  id: string;
  name: string;
  zone: string;
  rate: number;
}

export function loadPresets(): ShippingPreset[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function savePresets(list: ShippingPreset[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

/**
 * Shipping presets: named zone rates, one tap to copy the summary
 * into listings and buyer messages.
 */
export function ShippingPresets() {
  const [list, setList] = useState<ShippingPreset[]>([]);
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");
  const [rate, setRate] = useState("5");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setList(loadPresets());
  }, []);

  function persist(next: ShippingPreset[]) {
    setList(next);
    savePresets(next);
  }

  function add() {
    const r = Number(rate);
    if (!name.trim() || !zone.trim() || !(r >= 0)) return;
    persist([...list, { id: `sh-${Date.now()}`, name: name.trim(), zone: zone.trim(), rate: r }]);
    setName("");
    setZone("");
    setRate("5");
  }

  async function copy(p: ShippingPreset) {
    try {
      await navigator.clipboard.writeText(`${p.name}: ${p.zone} — $${p.rate.toFixed(2)} flat`);
      setCopied(p.id);
    } catch {
      setCopied(null);
    }
  }

  return (
    <Card data-testid="shipping-presets" variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Shipping presets</Typography>
        <Typography variant="body2" color="text.secondary">
          Reusable zone rates for listings and buyer messages.
        </Typography>
        {list.map((p) => (
          <Box key={p.id} data-testid={`preset-${p.id}`} sx={{ mt: 1, p: 1, border: 1, borderColor: "divider", borderRadius: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{p.name}</Typography>
              <Typography variant="body2" color="text.secondary">{p.zone} · ${p.rate.toFixed(2)}</Typography>
            </Box>
            <Button data-testid={`preset-copy-${p.id}`} size="small" onClick={() => copy(p)}>
              {copied === p.id ? "Copied" : "Copy"}
            </Button>
            <Button data-testid={`preset-remove-${p.id}`} size="small" color="error" onClick={() => persist(list.filter((x) => x.id !== p.id))}>
              Remove
            </Button>
          </Box>
        ))}
        <Box sx={{ mt: 2, display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" } }}>
          <TextField inputProps={{ "data-testid": "preset-name" }} size="small" label="Preset name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField inputProps={{ "data-testid": "preset-zone" }} size="small" label="Zone" value={zone} onChange={(e) => setZone(e.target.value)} />
          <TextField inputProps={{ "data-testid": "preset-rate" }} size="small" label="Rate ($)" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Box>
        <Button data-testid="preset-add" variant="outlined" size="small" sx={{ mt: 1 }} onClick={add}>
          Save preset
        </Button>
      </CardContent>
    </Card>
  );
}
