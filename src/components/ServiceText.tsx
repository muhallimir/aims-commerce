import { Typography } from "@mui/material";
import useThemeMode from "src/hooks/useThemeMode";

function modeColor(isDarkMode: boolean, light: string): string {
  return isDarkMode ? "common.white" : light;
}

/** Page title that stays readable on the flipping page background. */
export function PageTitle({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeMode();
  return (
    <Typography variant="h3" fontWeight={700} gutterBottom color={modeColor(isDarkMode, "text.primary")}>
      {children}
    </Typography>
  );
}

/** Intro paragraph under the page title. */
export function PageIntro({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeMode();
  return (
    <Typography variant="body1" gutterBottom color={modeColor(isDarkMode, "text.secondary")}>
      {children}
    </Typography>
  );
}

/** Section heading on service pages. */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeMode();
  return (
    <Typography variant="h5" fontWeight={600} gutterBottom color={modeColor(isDarkMode, "text.primary")}>
      {children}
    </Typography>
  );
}
