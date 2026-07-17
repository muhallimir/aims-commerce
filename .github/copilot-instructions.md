# Aims Commerce — Copilot Instructions

> **Updated 2026-07-17.** This is a single Next.js monorepo. The old
> `aims-commerce-backend/` sidecar has been deleted. All API code,
> tests, docs, and ops scripts live in this repo.

## Project Overview

Full-stack multi-vendor e-commerce platform. Three user roles:
**Customer**, **Seller**, **Admin**. Deployed to Vercel as a single
Next.js project — no separate API server, no Express.

## Stack

- **Next.js 15** (Pages Router) + TypeScript + Material-UI v5 + Redux
  Toolkit + RTK Query + Formik + Yup.
- **31 API routes** under `src/pages/api/`, deployed as Vercel
  serverless functions. **30 active** (one is `_health`).
- **postgres.js** (raw parameterized SQL) for all DB access. No
  Prisma, no Mongoose, no ORM.
- **Database**: Supabase Postgres 15 (pgbouncer pooler). 9 tables:
  `users`, `sellers`, `products`, `orders`, `order_items`, `reviews`,
  `chat_sessions`, `chat_messages`, plus `_prisma_migrations` (ignored).
- **Live chat**: Supabase Realtime (`postgres_changes` on
  `chat_messages` + `chat_sessions`). No Socket.IO.
- **File storage**: Supabase Storage bucket `uploads` (public).
- **Auth**: JWT signed with `JWT_SECRET` (30-day expiry). Token claims:
  `{ _id, name, email, isAdmin, isSeller }`. Decoded by
  `src/middleware.ts` to gate `/admin/*` and `/seller/*` page
  navigation.

## Repo Layout

```
aims-commerce/                          ← the entire project
├── src/
│   ├── lib/                            ← @lib/* alias
│   │   ├── auth.ts                     ← requireAuth/Admin/Seller(req, res)
│   │   ├── db.ts                       ← postgres.js singleton (HMR-safe)
│   │   ├── supabase.ts                 ← getSupabaseAdmin / getStoragePublicUrl
│   │   ├── userMap.ts                  ← mapUser() shared by /api/users/*
│   │   ├── orderMap.ts                 ← buildOrderResponse() shared by /api/orders/*
│   │   └── sellerMap.ts                ← mapSeller() + ensureIsSeller()
│   ├── components/, forms/, hooks/, layouts/, pages/, services/, store/, helpers/, common/
│   ├── pages/api/                      ← 31 endpoints (serverless functions)
│   └── middleware.ts
├── scripts/test/                       ← e2e + browser + scan + chat tests
│   ├── e2e_test.mjs                    ← 79 API tests × 4 audiences
│   ├── browser_e2e_start_selling.mjs   ← 16 Playwright assertions for the click flow
│   ├── chat_test.mjs                   ← Supabase Realtime tests
│   └── scan_test_data.mjs              ← post-run DB cleanup checker
├── docs/
│   ├── ROLE_BASED_ACCESS.md            ← auth matrix + security notes
│   ├── MONGODB_TO_SUPABASE_MIGRATION_PLAN.md  ← historical, post-migration
│   ├── CHATBOT_INTEGRATION.md
│   ├── CHATBOT_TESTING.md
│   └── ARCHITECTURE.md
├── .env                                ← gitignored, loaded by `npm run test:*`
├── .env.test.example                   ← template documenting required env vars
├── vercel.json
└── package.json
```

## Testing

```bash
# Build + start the app
cd aims-commerce
npm i --legacy-peer-deps
npm run build
(npm run start &)                     # or `npm run dev` for hot reload

# Run the test suites (auto-loads .env via dotenv)
npm run test:e2e        # 79 API tests  (scripts/test/e2e_test.mjs)
npm run test:browser    # 16 browser tests (Playwright, scripts/test/browser_e2e_start_selling.mjs)
npm run test:chat       # 4 chat tests   (Supabase Realtime)
npm run test:all        # all three
npm run test:scan       # post-run DB cleanup check
```

All test-created data uses the `__TEST__` prefix on `name` / `email` /
`store_name` and is auto-cleaned at the end of each run. The
`test:scan` script verifies the DB is clean.

## Roles × Routes

| Role | Access |
|---|---|
| Public | `/api/products/*`, `/api/users/:id` (self/admin only), `/api/users/register`, `/api/users/signin`, `/api/users/google-auth`, `/api/config/*`, `/_health` |
| Customer | profile, own orders, place orders, leave reviews, `/api/sellers/become` |
| Seller | own products CRUD, own orders, own analytics, own profile |
| Admin | everything: all users, all products, all orders, all reviews |

Full matrix with pass/denied cases per role in `docs/ROLE_BASED_ACCESS.md`.

## Database Conventions

- IDs are UUIDs (`gen_random_uuid()`).
- Timestamps are `TIMESTAMPTZ` (`created_at`, `updated_at`).
- Booleans are stored as `boolean` (not 0/1). `is_admin`, `is_seller`, `is_active`, `is_paid`, `is_delivered`, `is_active_store`.
- Money is `NUMERIC(10, 2)` for products, `NUMERIC(12, 2)` for orders. Never `FLOAT`.
- Names are unique (`products.name`, `users.email`).
- `sellers.user_id` is unique (1:1 with users).
- `reviews (product_id, user_id)` is unique (one review per user per product).

## Path Aliases (`tsconfig.json`)

```
@pages/*    → src/pages/*
@helpers/*  → src/helpers/*
@lib/*      → src/lib/*
@store/*    → src/store/*
@common/*   → src/common/*
@styles/*   → src/styles/*
```

## Key Coding Rules

- **Server-only files** (`src/lib/db.ts`, `src/lib/supabase.ts`, `src/lib/auth.ts`): never import from client components.
- **postgres.js**: never pass `undefined` to a query — use `?? null` first. (`COALESCE(${x ?? null}, col)` not `COALESCE(${x}, col)`.)
- **Server-side DB calls**: use `sql\`\`` tagged templates, or `sql.unsafe(query, values)` for dynamic queries. **Do not** use `sql.query(query, values)` — that method does not exist on the `postgres` library.
- **Numeric columns** come back from postgres.js as **strings**. Call `Number()` or `parseFloat()` before doing math.
- **Boolean params**: use native `true` / `false`, not `"true"` / `"false"`. With the latter, `::boolean` casts on parameterized queries silently produce `false`.
- **CamelCase in responses**: API responses are camelCase (mapped via `userMap.ts`, `orderMap.ts`, `sellerMap.ts`). The DB is snake_case. Never return raw DB rows to the client.
- **Auth on every endpoint**: any endpoint that touches user data must use `requireAuth` / `requireAdmin` / `requireSeller` from `@lib/auth`. `GET /api/users/:id` requires auth (self or admin only — fixed 2026-07-17).

## Adding a New API Endpoint

1. Add the handler in `src/pages/api/<path>.ts`.
2. Use `requireAuth` / `requireAdmin` / `requireSeller` from `@lib/auth` as the first line.
3. Use `sql\`\`` tagged templates. Map DB rows to camelCase before returning.
4. Add a test case in `scripts/test/e2e_test.mjs` covering all three roles.
5. If the endpoint is part of a user-facing click flow, also add a browser test in `scripts/test/browser_e2e_*.mjs`.
6. Run `npm run test:e2e` and `npm run test:browser` to confirm.

## Frontend ↔ Backend

- Same-origin in production (Vercel). No `NEXT_PUBLIC_API_URI`.
- `apiSlice.baseUrl = ""` in `src/store/api.slice.js`.
- JWT attached in `apiSlice.prepareHeaders` from the `token` cookie.
- Redux slices in `src/store/`: `user`, `product`, `order`, `seller`, `admin`, `chat`, `app`, `cart`, `menu`, `summary`. Each co-locates state + RTK Query endpoints.

## AI Chatbot

Knowledge base in `src/services/chatbotService.ts` (frontend-only — no backend). Persists per-user in `localStorage` under `chatbot-messages-{userId}`. See `docs/CHATBOT_INTEGRATION.md` and `docs/CHATBOT_TESTING.md`.
