import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardContent, Chip, IconButton, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { getImageUrl } from "@helpers/commonFn";

export interface SpotlightProduct {
  _id: string;
  name?: string;
  title?: string;
  price?: number;
  sellingPrice?: number;
  image?: string;
  brand?: string;
  category?: string;
  rating?: number;
  numReviews?: number;
  num_reviews?: number;
  countInStock?: number;
  count_in_stock?: number;
}

export function reviewCountOf(p: SpotlightProduct): number {
  return Number(p.numReviews ?? p.num_reviews ?? 0);
}

export function topRatedList(products: SpotlightProduct[], limit = 8): SpotlightProduct[] {
  const rated = products.filter(
    (p) => Number(p.countInStock ?? p.count_in_stock ?? 0) > 0 && reviewCountOf(p) > 0
  );
  return rated
    .slice()
    .sort((a, b) => {
      const r = Number(b.rating ?? 0) - Number(a.rating ?? 0);
      if (r !== 0) return r;
      return reviewCountOf(b) - reviewCountOf(a);
    })
    .slice(0, limit);
}

export function topRated(products: SpotlightProduct[]): SpotlightProduct | null {
  // A crowd favorite needs a crowd: only products with real reviews
  // qualify, highest rating wins, review count breaks ties.
  return topRatedList(products, 1)[0] ?? null;
}

/** Top-rated multi-card carousel: premium responsive showcase, 1/2/3/4 across. */
export function TopRatedSpotlight({ products, onOpen }: { products: SpotlightProduct[]; onOpen: (id: string) => void }) {
  const list = topRatedList(products);
  const count = list.length;
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const mdUp = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const perView = lgUp ? 4 : mdUp ? 3 : smUp ? 2 : 1;
  const pageCount = Math.max(1, Math.ceil(count / perView));

  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  useEffect(() => {
    setPage(0);
    const el = trackRef.current as unknown as { scrollTo?: unknown };
    if (el && typeof el.scrollTo === "function") {
      (el.scrollTo as (o: object) => void)({ left: 0 });
    }
  }, [count, perView]);

  const scrollToPage = useCallback(
    (p: number) => {
      const next = ((p % pageCount) + pageCount) % pageCount;
      setPage(next);
      const el = trackRef.current as unknown as {
        scrollTo?: unknown;
        clientWidth?: number;
      } | null;
      if (!el || typeof el.scrollTo !== "function" || !el.clientWidth) return;
      (el.scrollTo as (o: object) => void)({ left: next * (el.clientWidth as number), behavior: "smooth" });
    },
    [pageCount]
  );

  const handleTrackScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setPage(Math.min(Math.max(next, 0), pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    if (paused || dragging || pageCount <= 1) return;
    const t = setInterval(() => {
      scrollToPage(page + 1);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, dragging, pageCount, page, scrollToPage]);

  const onDragStart = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: clientX, startLeft: el.scrollLeft, moved: false };
    setDragging(true);
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";
  }, []);

  const onDragMove = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  }, []);

  const onDragEnd = useCallback(() => {
    const el = trackRef.current;
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    if (el) {
      el.style.scrollSnapType = "";
      el.style.cursor = "";
    }
    // Let click-capture see the moved flag, then clear it.
    setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  }, []);

  if (count === 0) return null;

  return (
    <Card
      data-testid="top-rated-spotlight"
      variant="outlined"
      role="region"
      aria-roledescription="carousel"
      aria-label="Top rated products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{ mb: 2, bgcolor: "common.white", color: "common.black", overflow: "hidden" }}
    >
      <CardContent sx={{ pb: "12px !important" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="overline" color="secondary" sx={{ letterSpacing: 1.5 }}>
            Top rated today
          </Typography>
          <Chip size="small" label={`${count} crowd favorites`} />
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" data-testid="top-rated-counter">
              {page + 1} / {pageCount}
            </Typography>
            <IconButton
              data-testid="top-rated-prev"
              aria-label="Previous top rated page"
              onClick={() => scrollToPage(page - 1)}
              size="small"
              disabled={pageCount <= 1}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              data-testid="top-rated-next"
              aria-label="Next top rated page"
              onClick={() => scrollToPage(page + 1)}
              size="small"
              disabled={pageCount <= 1}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box
          ref={trackRef}
          data-testid="top-rated-track"
          onScroll={handleTrackScroll}
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            onDragStart(e.clientX);
          }}
          onMouseMove={(e) => onDragMove(e.clientX)}
          onMouseUp={onDragEnd}
          onMouseLeave={() => {
            onDragEnd();
            setPaused(false);
          }}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          sx={{
            display: "flex",
            gap: 1.5,
            mt: 1.5,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: dragging ? "auto" : "smooth",
            WebkitOverflowScrolling: "touch",
            pb: 1,
            mx: -0.5,
            px: 0.5,
            cursor: dragging ? "grabbing" : "grab",
            userSelect: dragging ? "none" : "auto",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 3 },
          }}
        >
          {list.map((p, i) => {
            const name = p.name ?? p.title ?? "Top rated pick";
            const price = Number(p.price ?? p.sellingPrice ?? 0);
            const rawImg = p.image ? getImageUrl(p.image) : "";
            const isFirst = i === 0;
            return (
              <Box
                key={p._id}
                data-testid={`top-rated-card-${p._id}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${name}`}
                sx={{
                  position: "relative",
                  flex: {
                    xs: "0 0 78%",
                    sm: "0 0 calc(50% - 6px)",
                    md: "0 0 calc(33.333% - 8px)",
                    lg: "0 0 calc(25% - 9px)",
                  },
                  scrollSnapAlign: "start",
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  bgcolor: "common.white",
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  minWidth: 0,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                }}
              >
                <Chip
                  size="small"
                  label={`#${i + 1}`}
                  color="secondary"
                  sx={{ position: "absolute", top: 8, left: 8, zIndex: 1, fontWeight: "bold" }}
                />
                <Box
                  onClick={() => onOpen(p._id)}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4 / 3",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    cursor: "pointer",
                  }}
                >
                  {rawImg ? (
                    <Image
                      src={rawImg}
                      alt={name}
                      fill
                      draggable={false}
                      style={{ objectFit: "contain", pointerEvents: "none" }}
                      sizes="(max-width: 600px) 78vw, (max-width: 900px) 45vw, (max-width: 1200px) 30vw, 22vw"
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        color: "text.secondary",
                        fontSize: 40,
                        fontWeight: "bold",
                      }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </Box>
                  )}
                </Box>
                <Typography
                  {...(isFirst
                    ? { "data-testid": "top-rated-name" }
                    : { "data-testid": `top-rated-name-${p._id}` })}
                  variant="subtitle1"
                  fontWeight="bold"
                  color="common.black"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "2.8em",
                    lineHeight: 1.4,
                  }}
                >
                  {name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                  <Rating value={Number(p.rating ?? 0)} readOnly precision={0.5} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {Number(p.rating ?? 0).toFixed(1)} ({reviewCountOf(p)})
                  </Typography>
                </Box>
                {(p.brand || p.category) && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {[p.category, p.brand].filter(Boolean).join(" • ")}
                  </Typography>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto", pt: 0.5 }}>
                  {price > 0 && (
                    <Typography variant="body2" fontWeight="bold" color="common.black">
                      ${price.toFixed(2)}
                    </Typography>
                  )}
                  <Button
                    {...(isFirst
                      ? { "data-testid": "top-rated-open" }
                      : { "data-testid": `top-rated-open-${p._id}` })}
                    variant="contained"
                    size="small"
                    onClick={() => onOpen(p._id)}
                    sx={{ ml: "auto", whiteSpace: "nowrap" }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>

        {pageCount > 1 && (
          <Box
            data-testid="top-rated-dots"
            role="tablist"
            aria-label="Choose top rated page"
            sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}
          >
            {Array.from({ length: pageCount }).map((_, i) => (
              <Box
                key={i}
                role="tab"
                aria-selected={i === page}
                aria-label={`Go to page ${i + 1}`}
                data-testid={`top-rated-dot-${i}`}
                onClick={() => scrollToPage(i)}
                sx={{
                  width: i === page ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: i === page ? "primary.main" : "grey.300",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
