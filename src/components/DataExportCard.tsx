import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Card, CardContent, Typography } from "@mui/material";
import { apiFetch } from "@lib/authFetch";

export interface DataExport {
  exportedAt: string;
  profile: unknown;
  orders: unknown[];
}

export function buildDataExport(profile: unknown, orders: unknown[]): DataExport {
  return { exportedAt: new Date().toISOString(), profile, orders };
}

/**
 * My data export: profile plus order history as a JSON download.
 * Signed-in shoppers only; everyone else gets pointed to sign-in.
 */
export function DataExportCard() {
  const { userInfo } = useSelector(({ user }: any) => user ?? {});
  const signedIn = Boolean(userInfo?._id);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    setError("");
    try {
      const [pRes, oRes] = await Promise.all([apiFetch("/api/users/profile"), apiFetch("/api/orders/mine")]);
      if (!pRes.ok || !oRes.ok) throw new Error("Export failed, try again.");
      const payload = buildDataExport(await pRes.json(), await oRes.json());
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aims-my-data.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card data-testid="data-export" variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Your data, yours</Typography>
        <Typography variant="body2" color="text.secondary">
          Download your profile and order history as JSON.
        </Typography>
        {signedIn ? (
          <Button data-testid="data-export-btn" variant="outlined" disabled={busy} onClick={download} sx={{ mt: 1 }}>
            {busy ? "Preparing…" : "Download my data"}
          </Button>
        ) : (
          <Typography data-testid="data-export-signin" variant="body2" sx={{ mt: 1 }}>
            <a href="/signin">Sign in</a> to export your data.
          </Typography>
        )}
        {error && (
          <Alert data-testid="data-export-error" severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
