export interface Announcement {
  id: string;
  message: string;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export function isLive(a: Announcement, now: Date = new Date()): boolean {
  if (!a.active) return false;
  if (a.starts_at && new Date(a.starts_at).getTime() > now.getTime()) return false;
  if (a.ends_at && new Date(a.ends_at).getTime() < now.getTime()) return false;
  return true;
}
