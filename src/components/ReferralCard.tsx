import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

export function referralCodeFor(userId: string | undefined): string {
  const base = (userId ?? "guest").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  return `AIMS-${base || "GUEST"}-10`;
}

/**
 * Refer-a-friend: personal code, copy button, give-10-get-10 terms.
 */
export function ReferralCard() {
  const { userInfo } = useSelector(({ user }: any) => user ?? {});
  const [copied, setCopied] = useState(false);
  const code = referralCodeFor(userInfo?._id);
  const link = `https://aims-commerce-amirsalis-projects.vercel.app/register?ref=${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card data-testid="referral-card" variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Give $10, get $10</Typography>
        <Typography variant="body2" color="text.secondary">
          Friends get $10 off their first order. You get $10 credit when they buy.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <TextField data-testid="referral-link" inputProps={{ "data-testid": "referral-link-input" }} size="small" value={link} InputProps={{ readOnly: true }} fullWidth />
          <Button data-testid="referral-copy" variant="contained" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </Box>
        {copied && (
          <Alert data-testid="referral-done" severity="success" sx={{ mt: 1 }}>
            Link copied — send it to a friend.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
