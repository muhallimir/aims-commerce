import { useEffect, useState } from "react";
import { Fab, Fade } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export function scrolledDistance(): number {
  if (typeof window === "undefined") return 0;
  return window.scrollY || document.body.scrollTop || document.documentElement.scrollTop || 0;
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
  // The app shell scrolls document.body on some routes.
  document.body.scrollTo?.({ top: 0, behavior: "smooth" });
  document.documentElement.scrollTo?.({ top: 0, behavior: "smooth" });
}

/** Pops up after scrolling, returns to top smoothly. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(scrolledDistance() > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Fade in={show}>
      <Fab
        data-testid="back-to-top"
        size="small"
        color="primary"
        aria-label="Back to top"
        onClick={scrollToTop}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Fade>
  );
}
