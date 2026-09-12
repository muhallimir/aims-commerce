import { useState } from "react";
import { Button, Snackbar } from "@mui/material";

export function buildShareText(name: string, url: string): string {
  return `${name} — ${url}`;
}

/** Share button: copies the product link, confirms inline. */
export function ShareButton({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: buildShareText(name, url), url });
        return;
      }
      await navigator.clipboard.writeText(buildShareText(name, url));
      setOpen(true);
    } catch {
      setFailed(true);
    }
  }

  return (
    <>
      <Button data-testid="share-button" size="small" variant="outlined" onClick={share}>
        Share
      </Button>
      <Snackbar
        data-testid="share-confirm"
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
        message="Product link copied."
      />
      <Snackbar
        data-testid="share-failed"
        open={failed}
        autoHideDuration={2500}
        onClose={() => setFailed(false)}
        message="Copy this page URL to share."
      />
    </>
  );
}
