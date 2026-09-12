export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
}

/** Midnight tonight in local time: when today's flash sale ends. */
export function nextMidnight(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(24, 0, 0, 0);
  return d;
}

export function timeLeft(now: Date, endsAt: Date): TimeLeft {
  const ms = endsAt.getTime() - now.getTime();
  if (ms <= 0) return { hours: 0, minutes: 0, seconds: 0, ended: true };
  const s = Math.floor(ms / 1000);
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    ended: false,
  };
}

export function formatLeft(t: TimeLeft): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(t.hours)}h ${p(t.minutes)}m ${p(t.seconds)}s`;
}

/**
 * Shelf urgency: nudge shoppers when stock runs thin, silence
 * otherwise (including out-of-stock, which has its own state).
 */
export function stockUrgency(countInStock: number): string | null {
  if (countInStock <= 0 || countInStock > 5) return null;
  return `Only ${countInStock} left`;
}
