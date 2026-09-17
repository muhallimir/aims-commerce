import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

interface MagnifierProps {
  src: string;
  alt: string;
  /** pane: Amazon-style lens plus side zoom pane. inner: cursor-following zoom inside the frame. */
  mode?: "pane" | "inner";
  zoom?: number;
  /** Zoom pane width on large screens. Capped on medium screens so the card never clips it. */
  paneWidth?: number;
  /** Tap or click action, e.g. open the fullscreen viewer. */
  onTap?: () => void;
  /** Test id prefix: image becomes `${testId}-image`, lens `${testId}-lens`, zoom `${testId}-zoom`. */
  testId?: string;
  sx?: object;
}

/**
 * Amazon-style hover magnifier for product imagery.
 * Lens plus side zoom pane on hover-capable desktops, cursor-following
 * inner zoom in inner mode, plain image with tap action on touch devices.
 */
export function ProductImageMagnifier({
  src,
  alt,
  mode = "pane",
  zoom = 2.8,
  paneWidth = 520,
  onTap,
  testId = "product-magnifier",
  sx = {},
}: MagnifierProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dims = useRef({ w: 0, h: 0 });
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  // Large pane like Amazon on wide screens, capped on medium so the card never clips it.
  const effPane = lgUp ? paneWidth : Math.min(paneWidth, 380);
  const [canHover, setCanHover] = useState(false);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const update = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    dims.current = { w: r.width, h: r.height };
    const x = Math.min(Math.max(((clientX - r.left) / r.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - r.top) / r.height) * 100, 0), 100);
    setPos({ x, y });
  }, []);

  const { w, h } = dims.current;
  // Amazon mapping: the lens is exactly the area shown in the pane,
  // so lens size is pane size divided by zoom, clamped to the photo.
  const lensW = w > 0 ? Math.min(effPane / zoom, w) : effPane / zoom;
  const lensH = h > 0 ? Math.min(h / zoom, h) : 180;
  const lensLeft = w > 0 ? Math.min(Math.max((pos.x / 100) * w - lensW / 2, 0), Math.max(w - lensW, 0)) : 0;
  const lensTop = h > 0 ? Math.min(Math.max((pos.y / 100) * h - lensH / 2, 0), Math.max(h - lensH, 0)) : 0;
  const showLens = canHover && active && mode === "pane";
  const showPane = canHover && active && mode === "pane";
  const innerZoom = canHover && active && mode === "inner";

  return (
    <Box
      ref={ref}
      data-testid={testId}
      tabIndex={onTap ? 0 : undefined}
      role={onTap ? "button" : undefined}
      aria-label={alt}
      onMouseEnter={(e) => {
        if (!canHover) return;
        update(e.clientX, e.clientY);
        setActive(true);
      }}
      onMouseMove={(e) => {
        if (!canHover) return;
        update(e.clientX, e.clientY);
      }}
      onMouseLeave={() => setActive(false)}
      onFocus={() => {
        setPos({ x: 50, y: 50 });
        setActive(true);
      }}
      onBlur={() => setActive(false)}
      onClick={() => {
        if (onTap) onTap();
      }}
      onKeyDown={(e) => {
        if (onTap && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onTap();
        }
      }}
      sx={{
        position: "relative",
        overflow: mode === "inner" ? "hidden" : "visible",
        cursor: showLens ? "none" : onTap ? "zoom-in" : "default",
        borderRadius: 1,
        ...sx,
      }}
    >
      <img
        src={src}
        alt={alt}
        data-testid={`${testId}-image`}
        draggable={false}
        style={
          innerZoom
            ? {
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `scale(${zoom})`,
                transformOrigin: `${pos.x}% ${pos.y}%`,
                transition: "transform 0.15s ease",
                userSelect: "none",
              }
            : { width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }
        }
      />
      {showLens && (
        <Box
          data-testid={`${testId}-lens`}
          aria-hidden
          sx={{
            position: "absolute",
            width: lensW,
            height: lensH,
            left: lensLeft,
            top: lensTop,
            border: "1px solid",
            borderColor: "primary.main",
            bgcolor: "rgba(255, 255, 255, 0.35)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      )}
      {showPane && (
        <Box
          data-testid={`${testId}-zoom`}
          aria-hidden
          sx={{
            position: "absolute",
            left: "calc(100% + 16px)",
            top: 0,
            width: effPane,
            height: "100%",
            minHeight: 320,
            zIndex: 5,
            bgcolor: "white",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 1,
            boxShadow: 3,
            backgroundImage: `url("${src}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${pos.x}% ${pos.y}%`,
            backgroundSize: `${zoom * 100}%`,
            pointerEvents: "none",
            display: { xs: "none", md: "block" },
          }}
        />
      )}
      {canHover && !active && (
        <Box
          data-testid={`${testId}-hint`}
          sx={{
            position: "absolute",
            left: 8,
            bottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "rgba(255, 255, 255, 0.92)",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            pointerEvents: "none",
          }}
        >
          <ZoomInIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Hover to zoom
          </Typography>
        </Box>
      )}
      {!canHover && onTap && (
        <Box
          data-testid={`${testId}-hint`}
          sx={{
            position: "absolute",
            left: 8,
            bottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "rgba(255, 255, 255, 0.92)",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            pointerEvents: "none",
          }}
        >
          <ZoomInIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Tap to expand
          </Typography>
        </Box>
      )}
    </Box>
  );
}
