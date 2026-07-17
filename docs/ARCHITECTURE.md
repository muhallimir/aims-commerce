# Architecture

> **Single Next.js monorepo.** Deployed to Vercel. No separate API
> server, no Express in production.

## High level

```
Browser  ──►  Next.js 15  ──►  API routes (/api/*)  ──►  Supabase Postgres
   ▲              │                                       ▲
   │              ▼                                       │
   │         Vercel Serverless                            │
   │              │                                       │
   └──────── Middleware (JWT decode, route gate)  ◄────────┘
                  │
                  ▼
            Supabase Storage (uploads bucket, public)
            Supabase Realtime (chat_sessions + chat_messages)
```

## Request flow

1. **Browser** sends a request to `https://aims-commerce.vercel.app/...`
2. **Next.js middleware** (`src/middleware.ts`) decodes the JWT cookie
   and gates `/admin/*` and `/seller/*` page routes. API routes are
   not gated here.
3. **API route handler** (`src/pages/api/<path>.ts`) runs as a Vercel
   serverless function. The first line of every handler that touches
   user data is `requireAuth(req, res)` / `requireAdmin(req, res)` /
   `requireSeller(req, res)` from `src/lib/auth.ts`.
4. **postgres.js** (`src/lib/db.ts`) talks to Supabase Postgres via
   the pooler connection (`DATABASE_URL`).
5. **Response** is built by mapping the DB row through the appropriate
   `*Map.ts` helper (snake_case → camelCase) and returning JSON.

## Directory layout

See `.github/copilot-instructions.md` §"Repo Layout" for the full
tree. Key points:

- All DB access goes through `src/lib/db.ts` (HMR-safe singleton via
  `globalThis`).
- All auth checks go through `src/lib/auth.ts` (`requireAuth` etc.).
- All response shaping goes through `src/lib/userMap.ts`,
  `src/lib/orderMap.ts`, `src/lib/sellerMap.ts`.
- All Supabase calls (storage, realtime) go through
  `src/lib/supabase.ts`.
- All business logic for the chatbot lives in
  `src/services/chatbotService.ts` (frontend-only, localStorage
  persistence).

## Data model

9 tables (Supabase Postgres). Schema is in `aims-commerce-backend/prisma/schema.prisma`
(historical) — the source of truth is now the live DB itself.

```
users
sellers
products
orders
order_items
reviews
chat_sessions
chat_messages
_prisma_migrations   ← ignored
```

## Vercel env vars

12 public vars (NEXT_PUBLIC_*) + 4 server secrets, across 3 envs
(production, preview, development). Set via:

```bash
vercel env add <NAME> production
# ... repeat for preview and development
```

Vercel **excludes** env vars whose name starts with `_` from the
build, so use plain names. The `GOOGLE_CLIENT_ID` is server-side
(no `NEXT_PUBLIC_` prefix) so that the API route
`/api/config/google` can return it at runtime (avoids baking it into
the client bundle as a build-time var that Vercel might strip).

## Tests

```
npm run test:e2e        # 79 API tests, 4 audiences
npm run test:browser    # 16 browser tests (Playwright)
npm run test:chat       # 4 Supabase Realtime tests
npm run test:scan       # post-run DB cleanup check
```

All live under `scripts/test/`. Test-created data uses the
`__TEST__` prefix on `name` / `email` / `store_name` and is
auto-cleaned at the end of each run. See `docs/ROLE_BASED_ACCESS.md`
for the full RBAC matrix.

## What was killed in the 2026-07-17 cleanup

- `aims-commerce-backend/` repo — was a sidecar for migration scripts
  and tests. The migration scripts were one-shots (already run). The
  tests are now in this repo under `scripts/test/`. The Express
  server, Prisma client, Heroku Procfile, and Dockerfile were all
  dead code from before the Vercel migration.
