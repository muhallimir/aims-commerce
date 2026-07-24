# AIMS Commerce — Agent Instructions

## Stack
- **Next.js 15** — Pages Router (not App Router). Port **3005** (not 3000).
- **Turbopack** for dev: `npm run dev`
- **Supabase Postgres** via `postgres.js` (raw SQL tagged templates). Not Prisma — Prisma is only for schema validation.
- **Redux Toolkit + RTK Query** for client state. Store slices in `src/store/`.
- **Vercel** deployment, region `iad1`.

## Developer commands
```bash
npm run dev          # Next.js dev on port 3005 with Turbopack
npm run build        # production build
npm run lint         # ESLint
npm run lint:fix     # ESLint auto-fix (also runs on pre-commit via husky)
npm run test:e2e     # 79 API tests against http://127.0.0.1:3005/api/*
npm run test:browser # 16 Playwright browser tests (Start Selling flow)
npm run test:chat    # 4 Supabase Realtime chat tests
npm run test:scan    # post-run DB cleanup verification
```

## Environment variables (required)
At minimum, `.env` must contain:
```
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true   # pooler (used by Next.js at runtime)
DIRECT_URL=postgresql://...:5432/postgres                     # direct (used by postgres.js client)
JWT_SECRET=<strong-random-string>
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SECRET_KEY=<service-role-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_LOCATIONIQ_API_KEY=...
```
See `.env.test.example` for the full test suite set. Test scripts load `.env` via `dotenv`.

## TypeScript path aliases
| Alias | Resolves to |
|---|---|
| `@pages/*` | `src/pages/*` |
| `@lib/*` | `src/lib/*` |
| `@store/*` | `src/store/*` |
| `@common/*` | `src/common/*` |
| `@helpers/*` | `src/helpers/*` |
| `@modules/*` | `src/modules/*` (alias defined but directory doesn't exist yet) |
| `@assets/*` | `src/assets/*` |
| `@styles/*` | `src/styles/*` |
| `@public/assets/*` | `public/assets/*` |

## Architecture essentials
- **API routes** live in `src/pages/api/<path>.ts` (Pages Router). Each handler that touches user data calls `requireAuth(req, res)`, `requireAdmin(req, res)`, or `requireSeller(req, res)` from `src/lib/auth.ts`.
- **Middleware** (`src/middleware.ts`) gates `/admin/*` and `/seller/*` **page routes** client-side by decoding the JWT cookie. API routes are not gated here.
- **DB access** goes through `src/lib/db.ts` — a postgres.js singleton cached on `globalThis.__pg_client` (survives HMR).
- **Response mapping** uses `src/lib/userMap.ts`, `src/lib/orderMap.ts`, `src/lib/sellerMap.ts` (snake_case DB columns → camelCase JSON).
- **Supabase calls** (storage, realtime) go through `src/lib/supabase.ts`.
- **Chatbot logic** is frontend-only in `src/services/chatbotService.ts` + `src/hooks/useChatbot.ts`.

## Roles & RBAC
Three roles: **Customer** (`isAdmin=false, isSeller=false`), **Seller** (`isSeller=true`), **Admin** (`isAdmin=true`). A user can be both. JWT carries both claims. See `docs/ROLE_BASED_ACCESS.md` for the full endpoint matrix.

## Data model (9 tables)
`users`, `sellers`, `products`, `orders`, `order_items`, `reviews`, `chat_sessions`, `chat_messages`, `_prisma_migrations` (ignored).

## Style conventions
- **Prettier**: no semicolons, no single quotes, trailing comma all, printWidth 100. Config in `prettierrc.json`.
- **ESLint**: extends `next/core-web-vitals`. `no-unused-vars` and `react/prop-types` turned off (TypeScript handles types). `react-hooks/exhaustive-deps` off. Max cyclomatic complexity: 60.
- **SVGs**: processed by SVGR with `react-inline-svg-unique-id` plugin (`.svgrrc.js`).
- **Vercel build**: uses `npm install --legacy-peer-deps` (see `vercel.json`).

## Testing notes
- Test-created data uses `__TEST__` prefix on `name`/`email`/`store_name` and is auto-cleaned.
- `test:e2e` runs against a live dev server — start `npm run dev` first.
- `test:browser` uses Playwright with a real browser instance.
- `test:scan` verifies no `__TEST__` rows remain after test runs.
- Results files (`e2e_test_results.json`, etc.) are gitignored and regenerated each run.

## Gotchas
- **Port is 3005**, not 3000. Hardcoded in `package.json` scripts and test runners.
- **No modules directory** — `@modules/*` alias exists in tsconfig but `src/modules/` doesn't exist yet.
- **`postgres.js` uses `sql.unsafe(query, values)`** not `sql.query()`. The `COALESCE` pattern needs `COALESCE(${x ?? null}, col)` to avoid `UNDEFINED_VALUE` errors.
- **Numeric columns** from postgres.js come back as strings — use `parseFloat()` before `.toFixed()`.
- **`DATABASE_URL`** (port 6543, pgbouncer) is for runtime. **`DIRECT_URL`** (port 5432) is for `src/lib/db.ts`. Don't swap them.
- **`GOOGLE_CLIENT_ID`** is server-side only (no `NEXT_PUBLIC_` prefix) so the `/api/config/google` route can return it at runtime.
- **`patch-package`** runs on `postinstall` — expect `patches/` dir if any deps are patched.
- **`npm` is the package manager** (v10.8.2), not yarn, despite the `.gitignore` comment about yarn lockfiles.

## Key docs
- `docs/ARCHITECTURE.md` — high-level architecture and request flow
- `docs/ROLE_BASED_ACCESS.md` — full RBAC matrix and test results
- `docs/CHATBOT_INTEGRATION.md` — chatbot feature docs
- `docs/CHATBOT_TESTING.md` — chatbot test cases
- `SERVERLESS_DEPLOYMENT_PLAN.md` — zero-cost Vercel+Supabase deployment plan
