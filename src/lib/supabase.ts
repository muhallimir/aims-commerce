/**
 * Supabase client (monorepo target).
 *
 * Server-side (API routes, server actions): use `getSupabaseAdmin()` — the
 * service-role client, which bypasses RLS. Server-only. Never import this
 * into client components.
 *
 * Client-side (React components): use `getSupabaseBrowser()` — the anon-key
 * client, which respects RLS. Safe to import anywhere.
 *
 * Both are lazy singletons so we don't read env vars at module load (which
 * fails during `next build` if env is missing).
 *
 * SERVER-ONLY (admin only): `getSupabaseAdmin()` uses the service-role key
 * and bypasses RLS. Never expose it to the browser. The browser client is
 * safe to use anywhere. Use `import "server-only"` at the top of this file
 * in a real Next.js codebase — disabled here only so the smoke test
 * (`src/lib/smoke-test.ts`) can run in plain Node.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;
let _browser: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin client: missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL or SUPABASE_SECRET_KEY"
    );
  }

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "Content-Type": "application/json" } },
  });
  return _admin;
}

export function getSupabaseBrowser(): SupabaseClient {
  if (_browser) return _browser;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase browser client: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  _browser = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _browser;
}

/**
 * Convenience: read a public URL for a file in the `uploads` bucket.
 * Replace Phase 8's local `/uploads/...` references once the bucket exists.
 */
export function getStoragePublicUrl(path: string): string {
  return getSupabaseAdmin().storage.from("uploads").getPublicUrl(path)
    .data.publicUrl;
}
