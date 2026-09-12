import { Breadcrumbs, Link, Typography } from "@mui/material";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail: Store / Category / Product. */
export function BreadcrumbTrail({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumbs data-testid="breadcrumb-trail" aria-label="breadcrumb">
      {items.map((c, i) =>
        c.href && i < items.length - 1 ? (
          <Link key={c.label} data-testid={`breadcrumb-${i}`} href={c.href} underline="hover" color="inherit">
            {c.label}
          </Link>
        ) : (
          <Typography key={c.label} data-testid={`breadcrumb-${i}`} color="text.primary">
            {c.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
