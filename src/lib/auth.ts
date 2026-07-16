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
export function getUserFromRequest(req: Request): AuthUser | null {
  const auth = req.headers.get("authorization");
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
 * Throw-style helpers for API route handlers. Throws a Response so callers
 * can let the error bubble up to Next.js's error boundary.
 */
export function requireAuth(req: Request): AuthUser {
  const user = getUserFromRequest(req);
  if (!user) {
    throw new Response(JSON.stringify({ message: "No Token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export function requireAdmin(req: Request): AuthUser {
  const user = requireAuth(req);
  if (!user.isAdmin) {
    throw new Response(JSON.stringify({ message: "Invalid Admin Token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export function requireSeller(req: Request): AuthUser {
  const user = requireAuth(req);
  if (!user.isSeller) {
    throw new Response(
      JSON.stringify({ message: "Access denied. Must be a seller." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return user;
}
