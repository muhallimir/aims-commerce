import { Alert, Box, Link, Typography } from "@mui/material";

export interface SeoAdvice {
  titleUsed: number;
  titleLimit: number;
  descUsed: number;
  descLimit: number;
  warnings: string[];
}

export function seoAdvice(title: string, description: string): SeoAdvice {
  const warnings: string[] = [];
  if (!title.trim()) warnings.push("Add a product name first.");
  if (title.length > 60) warnings.push("Title truncates past 60 characters.");
  if (description.length > 160) warnings.push("Description truncates past 160 characters.");
  if (description.trim().length > 0 && description.trim().length < 50) warnings.push("Flesh the description out past 50 characters.");
  return { titleUsed: title.length, titleLimit: 60, descUsed: description.length, descLimit: 160, warnings };
}

export function slugifySeo(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "product";
}

/** Google-snippet preview with live length guidance. */
export function SeoPreview({ title, description }: { title: string; description: string }) {
  const advice = seoAdvice(title, description);
  return (
    <Box data-testid="seo-preview" sx={{ mt: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">Search preview</Typography>
      <Typography data-testid="seo-title" variant="subtitle1" color="primary.dark" sx={{ fontWeight: 500 }}>
        {title || "Product name"}
      </Typography>
      <Link data-testid="seo-url" variant="caption" underline="none" sx={{ color: "text.secondary" }}>
        aims-commerce.com/store/product/{slugifySeo(title)}
      </Link>
      <Typography data-testid="seo-desc" variant="body2" color="text.secondary">
        {description || "Product description shows here."}
      </Typography>
      <Typography variant="caption" color={advice.titleUsed > 60 ? "error" : "text.secondary"}>
        Title {advice.titleUsed}/{advice.titleLimit} · Description {advice.descUsed}/{advice.descLimit}
      </Typography>
      {advice.warnings.map((w) => (
        <Alert key={w} data-testid="seo-warning" severity="warning" sx={{ mt: 1 }}>
          {w}
        </Alert>
      ))}
    </Box>
  );
}
