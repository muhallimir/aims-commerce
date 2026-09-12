import { Box, LinearProgress, Typography } from "@mui/material";

export type Strength = "weak" | "fair" | "strong";

/** 0-4 score: length, mixed case, digit, symbol. */
export function scorePassword(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(4, s);
}

export function strengthOf(score: number): Strength {
  if (score >= 4) return "strong";
  if (score >= 2) return "fair";
  return "weak";
}

/** Live password strength meter under the field. */
export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = strengthOf(score);
  return (
    <Box data-testid="password-strength" sx={{ mt: 0.5 }}>
      <LinearProgress
        data-testid="password-strength-bar"
        variant="determinate"
        value={(score / 4) * 100}
        color={level === "strong" ? "success" : level === "fair" ? "warning" : "error"}
        sx={{ height: 6, borderRadius: 3 }}
      />
      <Typography data-testid="password-strength-label" variant="caption" color="text.secondary">
        {level === "strong" ? "Strong password." : level === "fair" ? "Fair — add length or a symbol." : "Weak — use 8+ characters with mixed case."}
      </Typography>
    </Box>
  );
}
