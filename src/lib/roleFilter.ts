export type RoleFilter = "all" | "admin" | "seller" | "customer";

export interface RoleUser {
  isAdmin?: boolean;
  isSeller?: boolean;
}

export function roleOf(u: RoleUser): Exclude<RoleFilter, "all"> {
  if (u.isAdmin) return "admin";
  if (u.isSeller) return "seller";
  return "customer";
}

/** Admin user list role filter. */
export function filterByRole<T extends RoleUser>(users: T[], role: RoleFilter): T[] {
  if (role === "all") return users;
  return users.filter((u) => roleOf(u) === role);
}
