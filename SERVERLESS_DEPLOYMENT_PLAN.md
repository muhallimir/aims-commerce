# Zero-Cost Deployment Plan (Monorepo Merge Path)

> **Goal:** Eliminate Railway backend ($5-10/mo) by merging backend API routes into this Next.js monorepo → deploy everything on Vercel (free tier) + Supabase (free tier).

## 📊 Current Architecture (Cost: ~$5-10/mo)

```
┌─────────────────┐     ┌─────────────────────────────────────────┐     ┌─────────────────┐
│  Next.js Front  │────▶│  Backend Express Server (separate repo) │────▶│ Supabase Postgres │
│   (Vercel)      │     │  ┌──────────────────────────────────┐   │     │  (Free Tier)    │
│                 │────▶│  │  postgres.js (38 endpoints)      │   │     │                 │
│                 │────▶│  │  Socket.IO (live chat)           │   │     │  ✓ 6 tables     │
│                 │─────│  │  Mongoose import (stub only)     │   │     │  ✓ Seed loaded  │
└─────────────────┘     │  └──────────────────────────────────┘   │     │  ✓ RLS enabled  │
                        └─────────────────────────────────────────┘     └─────────────────┘
```

**Backend repo:** `aims-commerce-backend` — Fully migrated from MongoDB → postgres.js. All routers use `sql` tagged template queries.

---

## 🎯 Target Architecture (Cost: $0/mo) — Monorepo

```
┌─────────────────────────────────────────────────────────────────┐
│                   Single Repo: aims-commerce                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 (API Routes + Pages) — Vercel Serverless     │  │
│  │                                                           │  │
│  │  /src/app/api/users/          → register, login, profile │  │
│  │  /src/app/api/products/       → CRUD, search, reviews    │  │
│  │  /src/app/api/orders/         → create, pay, mine        │  │
│  │  /src/app/api/sellers/        → become, analytics        │  │
│  │  /src/app/api/upload/         → Supabase Storage upload  │  │
│  │  /src/app/api/config/         → paypal, google keys      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Supabase PostgreSQL + Realtime (Free Tier)               │  │
│  │  ┌────────┐  ┌──────────────┐  ┌──────────────────┐      │  │
│  │  │ PG  DB │  │ Supabase RT  │  │ Storage (images) │      │  │
│  │  └────────┘  └──────────────┘  └──────────────────┘      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Total Monthly Cost: $0** ✅

---

## 📊 Vercel Free Tier vs Our Usage

| Resource | Free Limit | Expected Usage | Headroom |
|---|---|---|---|
| Serverless Functions | 100 hrs/month (~7.2M requests @ 100ms) | ~500K requests (10% of limit) | **90% unused** |
| Bandwidth | 100 GB/month | ~10 GB (images cached) | **90% unused** |
| Build Minutes | 6,000/month | ~30 min (auto-deploy) | **99.5% unused** |
| Storage | 1 GB (Supabase) | ~100 MB (images) | **~900 MB free** |

**Verdict: EASILY handled on free tier.**

---

## ✅ What's Already Done (Backend Repo)

| Component | Status | Details |
|---|---|---|
| **Prisma 7 Schema** | ✅ Done | 6 models (User, Seller, Product, Order, OrderItem, Review) |
| **PostgreSQL DDL** | ✅ Done | All 6 tables + indexes + FKs applied to Supabase |
| **RLS Policies** | ✅ Done | 15 policies across all user-facing tables |
| **Seed Data** | ✅ Done | 2 users + 1 seller + 15 products in Supabase |
| **User Router** | ✅ Done | 9 endpoints migrated to postgres.js |
| **Product Router** | ✅ Done | 8 endpoints migrated to postgres.js |
| **Order Router** | ✅ Done | 10 endpoints migrated to postgres.js |
| **Seller Router** | ✅ Done | 10 endpoints migrated to postgres.js |
| **Total Endpoints** | **38/38** | All migrated, 0 Mongoose usage in routers |

**Note:** `server.js` in the backend repo still has:
- `mongoose` import (stub — not called by any router, can be removed)
- `Socket.IO` server (needed for live chat until we migrate to Supabase Realtime)
- `mongoose.connect()` call (fails silently if MongoDB unavailable, can be removed)

---

## 📋 Next Steps — Monorepo Merge Plan

### Phase 1: Prepare Backend for Monorepo

**Goal:** Clean up backend so it can be moved into Next.js structure.

**Tasks:**
1. Remove `mongoose` import from `server.js` (all routers use postgres.js now)
2. Remove `mongoose.connect()` from `server.js`
3. Keep Socket.IO in `server.js` for live chat (until Phase 2 is done) — or migrate Socket.IO
4. Create `src/middleware/auth.ts` from `backend/utils.js` 
5. Create `src/lib/supabase.ts` client for direct Supabase access
6. Create `src/lib/db.ts` — shared postgres.js client (replace backend `dbClient.js`)

### Phase 2: Migrate Socket.IO to Supabase Realtime (Or Keep Both)

**Option A — Replace Socket.IO with Supabase Realtime:**  
Create `messages` + `online_status` tables in Supabase, replace `socket.emit/on` with `supabase.channel('chat-room').on('postgres_changes', ...)`.

**Option B — Keep Socket.IO on Edge (Recommended for Phase X):**  
Supabase Edge Functions support WebSockets, or we keep the small Express process on a $0-tier platform. Socket.IO is the most expensive part to migrate.

### Phase 3: Move API Routes to Next.js App Router

**Create `src/app/api/` routes that proxy to our existing postgres.js queries:**

```
src/app/api/
├── users/
│   ├── seed/route.ts
│   ├── google-auth/route.ts
│   ├── signin/route.ts
│   ├── register/route.ts
│   └── [id]/
│       ├── GET/route.ts
│       ├── PUT/route.ts
│       └── DELETE/route.ts
├── products/
│   ├── GET/route.ts
│   ├── POST/route.ts
│   └── [id]/
│       ├── GET/route.ts
│       ├── PUT/route.ts
│       ├── DELETE/route.ts
│       └── reviews/POST/route.ts
├── orders/
│   ├── GET/route.ts
│   ├── POST/route.ts
│   └── [id]/
│       ├── GET/route.ts
│       ├── PUT/pay/route.ts
│       ├── PUT/deliver/route.ts
│       └── DELETE/route.ts
├── sellers/
│   ├── become/route.ts
│   ├── analytics/route.ts
│   └── [id]/
│       ├── GET/route.ts
│       └── PUT/route.ts
├── upload/
│   └── POST/route.ts
└── health/route.ts
```

**Strategy:** Don't rewrite logic — import the existing postgres.js queries from the backend repo (or copy them). The router logic is already written and tested.

### Phase 4: Migrate Frontend Store to New API Paths

Update Redux slices to use `/api/...` paths instead of the Railway backend URL:

```js
// Before (Railway)
apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/users/signin",  // Railway env
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// After (Monorepo)
apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/users/signin",  // Next.js API Route
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
```

No URL changes needed — both point to `/api/...` since they're on the same domain.

### Phase 5: Vercel Deployment

**Environment Variables for Vercel:**

```env
# Client-side (NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://tmnsezftbqitxibndtlk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Server-side (not exposed to browser)
DATABASE_URL=postgresql://postgres.tmnsezftbqitxibndtlk:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.tmnsezftbqitxibndtlk:pass@aws-0-us-east-1.pooler.supabase.com:5432/postgres
SUPABASE_SECRET_KEY=<service-role-key>
JWT_SECRET=<strong-random-string>
STRIPE_SECRET_KEY=<stripe-live-key>
GOOGLE_CLIENT_ID=<google-id>
GOOGLE_CLIENT_SECRET=<google-secret>
PAYPAL_CLIENT_ID=<paypal-id>
```

---

## 🔀 Current State vs Monorepo Plan Alignment

This plan has been updated to match what we've actually done:

| Plan Section | Original | Updated | Reason |
|---|---|---|---|
| **Current Architecture** | MongoDB + Railway | postgres.js + Supabase | Phase 1-4 backend migration completed |
| **Phase 1** | Supabase Client | Prepare Backend for Monorepo | Backend done, need cleanup + client setup |
| **Phase 2** | Socket.IO → Supabase Realtime | Socket.IO Keep OR Replace | Live chat migration is optional, not urgent |
| **Phase 3** | New API Routes (from scratch) | Copy from backend repo | 38 routers already written with postgres.js |
| **Phase 4** | Supabase Storage | Keep as-is | uploadRouter already migrated to Supabase Storage in backend |
| **Phase 5** | Vercel Deployment | Same | Unchanged |

---

## 🧹 Backend Cleanup Needed (Before Merge)

| File | Action | Priority |
|---|---|---|
| `backend/server.js` | Remove `mongoose` import + `mongoose.connect()` | High |
| `backend/server.js` | Keep Socket.IO (until Supabase Realtime replaces it) | — |
| `backend/server.js` | Delete `/uploads/` static folder — use Supabase Storage instead | Medium |
| `backend/package.json` | Remove `mongoose` from dependencies | High |
| `MONGODB_TO_SUPABASE_MIGRATION_PLAN.md` | Already updated ✅ | Done |

---

## 📝 Notes

1. **38 endpoints already migrated:** All routers in `backend/routers/` use postgres.js with `sql` tagged templates. Zero Mongoose usage. Ready to copy to Next.js API routes.
2. **Socket.IO is the only server-state we need:** All DB work is done. Socket.IO is for live chat only. Consider keeping the small Express server on Railway's free tier (stops spinning down, no charge for idle) or migrating to Supabase Realtime.
3. **Upload router:** `uploadRouter.js` already migrated to Supabase Storage in the backend. Use the same `@supabase/supabase-js` client in Next.js.
4. **Backend repo is production-ready for testing:** Deploy to Railway temporarily (with Supabase env vars) to test the full flow before merging into monorepo.
5. **Frontend needs ONE change:** Update `NEXT_PUBLIC_API_URI` in frontend `.env` to point to either the Railway backend URL or the new Vercel API routes once deployed.
