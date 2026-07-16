# Aims Commerce — Copilot Instructions

> **Updated 2026-07-16** to reflect the post-migration architecture. Old instructions said
> "MongoDB + Mongoose + separate Express server" — that's gone. See `ARCHITECTURE.md` in
> `aims-commerce-backend/` for the full picture.

## Project Overview

Full-stack e-commerce platform. Multi-vendor (sellers + admin). Supports three user roles:
**Customer**, **Seller**, and **Admin**.

Current stack:
- **Single Next.js 15 app** (Pages Router), TypeScript, Material-UI v5, Redux Toolkit + RTK Query, Formik + Yup. Deployed to Vercel.
- **37 API routes under `src/pages/api/`** — run as Vercel serverless functions, no separate Express server in production.
- **postgres.js** (raw parameterized SQL) for all DB access.
- **Database**: Supabase (PostgreSQL 15 + pgbouncer pooler), 9 tables (users, sellers, products, orders, order_items, reviews, chat_sessions, chat_messages), 21 RLS policies, 5 triggers.
- **Live chat**: Supabase Realtime (`postgres_changes` on `chat_messages` + `chat_sessions`). No Socket.IO.
- **File storage**: Supabase Storage bucket `uploads` (public).
- **Deployment**: Vercel (single Next.js project). `aims-commerce-backend/` is a sidecar for migration scripts and E2E tests only.

## Architecture Quick Reference

```
aims/                                 ← workspace root
├── aims-commerce/                     ← Next.js 15 frontend + API routes (Vercel)
│   ├── src/
│   │   ├── lib/                       ← @lib/* alias
│   │   │   ├── auth.ts                ← requireAuth/Admin/Seller (takes req, res)
│   │   │   ├── db.ts                  ← postgres.js singleton (HMR-safe via globalThis)
│   │   │   ├── supabase.ts            ← getSupabaseAdmin / getSupabaseBrowser / getStoragePublicUrl
│   │   │   ├── userMap.ts             ← mapUser() shared by /api/users/*
│   │   │   ├── orderMap.ts            ← buildOrderResponse() shared by /api/orders/*
│   │   │   ├── sellerMap.ts           ← mapSeller() + ensureIsSeller()
│   │   │   └── chatClient.ts          ← Supabase Realtime adapter (replaces socket.io-client)
│   │   ├── helpers/, common/, components/, forms/, hooks/, layouts/, middleware.ts, pages/, services/, store/
│   │   └── pages/api/                 ← 37 endpoints (Vercel serverless functions)
│   ├── vercel.json
│   ├── .env
│   └── package.json
│
└── aims-commerce-backend/              ← scripts + E2E tests only (NOT deployed)
    ├── backend/
    │   ├── server.js                   ← Legacy Express (local dev only)
    │   ├── dbClient.js                 ← shared postgres.js pool
    │   ├── utils.js                    ← JWT helpers
    │   └── routers/                    ← Reference implementations of the same endpoints
    ├── prisma/
    │   ├── schema.prisma               ← table shape (source of truth)
    │   ├── seed.ts                     ← thin wrapper around db:migrate
    │   └── migrations/                 ← 0_init + RLS + triggers + 5_chat_supabase_realtime
    ├── scripts/
    │   ├── dumpMongo.mjs               ← MongoDB → mongo-dump/*.json
    │   ├── migrateMongoToSupabase.mjs  ← mongo-dump → Supabase (1:1)
    │   ├── setupSupabaseStorage.mjs    ← uploads bucket + image upload
    │   ├── applyChatMigration.mjs      ← chat_sessions + chat_messages tables
    │   ├── e2e_test.mjs                ← 43 endpoint tests × 3 roles
    │   └── chat_test.mjs               ← 4 Supabase Realtime tests
    ├── mongo-dump/                     ← JSON dump of original MongoDB data
    └── uploads/                        ← legacy local image folder
```

## Auth Flow

- JWT signed with `JWT_SECRET` (env var, 30-day expiry).
- Token claims: `{ _id, name, email, isAdmin, isSeller }`.
- `backend/utils.js` (Express): `isAuth`, `isAdmin`, `isSeller` middlewares.
- `src/lib/auth.ts` (Next.js): same `requireAuth/Admin/Seller` for the future API routes.
- `src/middleware.ts` (Next.js): decodes the JWT client-side to gate `/admin/*` and `/seller/*` page navigation.

## Roles × Routes

| Role | Access |
|---|---|
| Public (no auth) | `/api/products/*`, `/api/users/:id`, `/api/users/register`, `/api/users/signin`, `/api/users/google-auth`, `/api/config/*`, `/_health` |
| Customer (any auth user) | profile, own orders, place orders, leave reviews, `/api/sellers/become` |
| Seller (`isSeller=true`) | own products CRUD, own orders, own analytics, own profile |
| Admin (`isAdmin=true`) | everything: all users, all products, all orders, all reviews |

Full matrix in `aims-commerce-backend/ROLE_BASED_ACCESS.md`.

## Database Conventions

- IDs are UUIDs (`gen_random_uuid()`), never MongoDB-style ObjectIds.
- Timestamps are `TIMESTAMPTZ` (`created_at`, `updated_at`).
- Booleans are stored as `boolean` (not 0/1). `is_admin`, `is_seller`, `is_active`, `is_paid`, `is_delivered`, `is_active_store`.
- Money is `NUMERIC(10, 2)` for products, `NUMERIC(12, 2)` for orders. Never `FLOAT`.
- Names are unique (`products.name`, `users.email`).
- `sellers.user_id` is unique (1:1 with users).
- `reviews (product_id, user_id)` is unique (one review per user per product).

## E2E Testing

`aims-commerce-backend/scripts/e2e_test.mjs` covers all 37 active endpoints × 3 roles + negative cases. 43 assertions total. **Currently 43/43 passing.**

```bash
cd aims-commerce-backend
# Start Next.js dev server on port 3005
cd ../aims-commerce && npx next dev -p 3005 &
# Or for production build:
# npx next build && npx next start -p 3005 &

cd ../aims-commerce-backend
npm run test:e2e
```

All test-created data uses the `__TEST__` prefix on `name` / `email` / `store_name` and is auto-cleaned at the end of the run. The original MongoDB-dumped data is left untouched.

## Path Aliases (Next.js `tsconfig.json`)

```
@pages/*    → src/pages/*
@helpers/*  → src/helpers/*
@lib/*      → src/lib/*           ← NEW: shared lib layer for monorepo
@store/*    → src/store/*
@common/*   → src/common/*
@styles/*   → src/styles/*
```

## Key Coding Rules

- **Server-only files** (`src/lib/db.ts`, `src/lib/supabase.ts`, `src/lib/auth.ts`): never import from client components. Use `import "server-only"` once Next.js-side is wired up.
- **postgres.js**: never pass `undefined` to a query — use `?? null` first. (`COALESCE(${x ?? null}, col)` not `COALESCE(${x}, col)`.)
- **Server-side DB calls**: use `sql\`\`` tagged templates, or `sql.unsafe(query, values)` for dynamic queries. **Do not** use `sql.query(query, values)` — that method does not exist on the `postgres` library.
- **Numeric columns** come back from postgres.js as **strings**. Call `Number()` or `parseFloat()` before doing math.
- **Boolean params**: use native `true` / `false`, not `"true"` / `"false"`. With the latter, `::boolean` casts on parameterized queries silently produce `false`.
- **Mongoose patterns are forbidden**: no `Schema()`, no `Model.find()`, no `ObjectId`. Use `sql\`SELECT …\``.

## Adding a New API Endpoint

1. Add the handler in the appropriate `backend/routers/*Router.js`.
2. Use `isAuth` / `isAdmin` / `isSeller` from `../utils.js`.
3. Use `sql\`\`` tagged templates for queries. For dynamic column lists, use `sql.unsafe(query, valuesArray)`.
4. Add a test case in `scripts/e2e_test.mjs` covering all three roles (admin pass, seller pass/denied, customer pass/denied).
5. Run `npm run test:e2e` to confirm.

## Frontend ↔ Backend Wiring

- `NEXT_PUBLIC_API_URI` (frontend env) → `http://127.0.0.1:5003` in dev, deployed URL in prod.
- JWT attached in `apiSlice.prepareHeaders` (`src/store/apiSlice.js`).
- Redux slices in `src/store/`: `user`, `product`, `order`, `seller`, `admin`, `chat`. Each co-locates state + RTK Query endpoints.

## Migrations

```bash
# 1. Dump MongoDB to mongo-dump/
npm run db:dump

# 2. Apply Prisma migrations to Supabase
npx prisma migrate deploy

# 3. Load mongo-dump into Supabase (1:1)
npm run db:migrate

# Or: single-command seed (calls step 1+3 via seed.ts)
npm run db:seed
```

## AI Chatbot

Knowledge base in `aims-commerce/src/services/chatbotService.ts` (frontend-only — no backend). Persists per-user in `localStorage` under `chatbot-messages-{userId}`. See `docs/CHATBOT_INTEGRATION.md` and `docs/CHATBOT_TESTING.md` for full details.
