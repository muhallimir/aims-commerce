/**
 * Auth helpers — Next.js monorepo replacement for backend/utils.js
 *
 * Usage in API routes / server actions:
 *   import { generateToken, getUserFromRequest } from "@lib/auth";
 *   const token = generateToken(user);
 *   const user = getUserFromRequest(request); // returns { _id, name, email, isAdmin, isSeller } | null
 *
 * In Next.js Edge runtime, jsonwebtoken is replaced by `jose`. For now, the
 * existing Express backend keeps signing tokens with jsonwebtoken, so we use
 * the same library here for symmetry.
 *
 * SERVER-ONLY: do not import from a client component. The JWT_SECRET and
 * decoded tokens are sensitive. Use `import "server-only"` at the top of
 * this file in a real Next.js codebase — disabled here only so the smoke
 * test (`src/lib/smoke-test.ts`) can run in plain Node.
 */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "somethingsecret";
const TOKEN_TTL = "30d";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract and verify a Bearer token from a Next.js Request.
 * Returns the decoded user, or null if missing/invalid.
 */
export function getUserFromRequest(req: any): AuthUser | null {
  let auth: string | null | undefined;
  if (typeof req.headers?.get === "function") {
    auth = req.headers.get("authorization");
  } else {
    const h = req.headers?.authorization;
    auth = Array.isArray(h) ? h[0] : h;
  }
  if (!auth) return null;
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  return verifyToken(token);
}

/**
 * Read the `token` cookie set by the frontend signin flow.
 */
export function getUserFromCookieToken(cookieToken: string | undefined): AuthUser | null {
  if (!cookieToken) return null;
  return verifyToken(cookieToken);
}

/**
 * Auth helpers for Next.js Pages Router API routes.
 *
 * Each `requireX` takes `(req, res)`. Returns the user on success.
 * On failure it writes the 401/403 response and returns null —
 * the handler should `if (!user) return;` after the call.
 *
 *   const user = requireAdmin(req, res);
 *   if (!user) return;
 *   // user is AuthUser from here on
 */
type ReqLike =
  | Request
  | { headers: Record<string, string | string[] | undefined> | { get(name: string): string | null } };
type ResLike = { status(code: number): any; json(body: any): any };

export function requireAuth(req: ReqLike, res: ResLike): AuthUser | null {
  const user = getUserFromRequest(req as any);
  if (!user) {
    res.status(401).json({ message: "No Token" });
    return null;
  }
  return user;
}

export function requireAdmin(req: ReqLike, res: ResLike): AuthUser | null {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (!user.isAdmin) {
    res.status(401).json({ message: "Invalid Admin Token" });
    return null;
  }
  return user;
}

export function requireSeller(req: ReqLike, res: ResLike): AuthUser | null {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (!user.isSeller) {
    res.status(403).json({ message: "Access denied. Must be a seller." });
    return null;
  }
  return user;
}
