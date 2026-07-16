/**
 * postgres.js client — used by Next.js API routes under src/pages/api/.
 *
 * Server-only by convention. Do not import from client components.
 *
 * Lazy singleton: the postgres instance is created on first use, then
 * cached on the module object. Next.js dev mode hot-reloads modules, but
 * `globalThis` keeps the cache alive across reloads.
 */

import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __pg_client: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("postgres.js: missing DIRECT_URL or DATABASE_URL. Check .env.");
  }
  return postgres(url, {
    max: 10,
    onnotice: () => {},
  });
}

// One-time init; cached on globalThis so HMR doesn't recreate it
const _sql = globalThis.__pg_client ?? createClient();
if (process.env.NODE_ENV !== "production") globalThis.__pg_client = _sql;

// Default export is the postgres instance. Tagged templates and .unsafe() both work.
export default _sql;
export { _sql as sql };
