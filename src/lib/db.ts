/**
 * postgres.js client — monorepo replacement for backend/dbClient.js.
 *
 * Used in Next.js API routes (src/app/api/.../route.ts) to query the
 * Supabase Postgres database directly. This is the same library the
 * existing Express backend uses, so query syntax carries over 1:1.
 *
 * IMPORTANT: do NOT import this from a client component. The DIRECT_URL
 * carries elevated privileges.
 *
 * Why a singleton? Next.js dev mode hot-reloads modules; without a cache
 * the pool would balloon and exhaust Supabase's connection limit.
 *
 * SERVER-ONLY: do not import from a client component. The DIRECT_URL
 * carries elevated privileges. Use `import "server-only"` at the top of
 * this file in a real Next.js codebase — disabled here only so the smoke
 * test (`src/lib/smoke-test.ts`) can run in plain Node.
 */

import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

let _sql: Sql | null = null;

export function getSql(): Sql {
  if (_sql) return _sql;

  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "postgres.js: missing DIRECT_URL or DATABASE_URL. Check .env."
    );
  }

  _sql = postgres(url, {
    max: 10,
    onnotice: () => {},
    // Supabase pooler requires TLS in some regions; safe to leave off for the
    // pooler host which already terminates TLS.
  });
  return _sql;
}

/**
 * Default export for code that prefers `import sql from "@lib/db"`.
 * Same singleton as `getSql()`.
 */
const sql: Sql = new Proxy({} as Sql, {
  get(_target, prop, receiver) {
    const real = getSql();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export default sql;
