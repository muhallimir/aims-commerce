# Serverless Zero-Cost Deployment Plan

> **Goal:** Eliminate Railway backend ($5-10/mo) by moving all backend logic into Next.js API Routes on Vercel (free tier), while connecting to Supabase (free tier) for PostgreSQL + Realtime.

## 🏗️ Current vs. Target Architecture

### Current Architecture (Cost: ~$5-10/mo)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Next.js Front  │────▶│  Express Server │────▶│  MongoDB/Railway│
│   (Vercel)      │     │  (Railway)      │     │   Collection    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              Socket.IO             (500MB)
                              + Mongoose
```

### Target Architecture (Cost: $0/mo)

```
┌─────────────────┐     ┌─────────────────────────────────────────┐
│  Next.js Front  │────▶│  Next.js API Routes (Vercel Serverless) │
│   (Vercel Free) │     │   ┌──────────────────────────────────┐  │
│                 │────▶│   │  Supabase PostgreSQL + Realtime   │  │
│                 │────▶│   │   (Supabase Free Tier)            │  │
│                 │────▶│   │   ┌────────┐  ┌──────────────┐   │  │
│                 │────▶│   │   │ PG DB  │  │ Supabase RT  │   │  │
│                 │────▶│   │   └────────┘  └──────────────┘   │  │
└─────────────────┘     │   └──────────────────────────────────┘  │
                        │                                        │
                        │   ┌──────────────────────────────────┐  │
                        │   │  Storage (Supabase S3)           │  │
                        │   └──────────────────────────────────┘  │
                        └─────────────────────────────────────────┘
```

**Total Monthly Cost: $0** ✅

---

## 📊 Vercel Free Tier Limits vs Our Usage

| Resource | Free Limit | Expected Usage | Headroom |
|---|---|---|---|
| Serverless Functions | 100 hrs/month (~7.2M requests @ 100ms) | ~500K requests (10% of limit) | **90% unused** |
| Bandwidth | 100 GB/month | ~10 GB (images cached) | **90% unused** |
| Build Minutes | 6,000/month | ~30 min (auto-deploy) | **99.5% unused** |
| Server Execution Time | 100 GB-hours/month | Negligible | ✅ |
| Edge Functions | 1,000/day | Not used | ✅ |

**Verdict: EASILY handled on free tier.**

---

## 🚧 Supabase Free Tier Limits

| Resource | Free Limit | Our Usage | Headroom |
|---|---|---|---|
| Database | 500 MB | Currently empty (~few MB after seed) | **~500 MB free** |
| API Requests | Unlimited | ~1M/month (free tier) | ✅ |
| Monthly Active Users | Unlimited | ~100 users | ✅ |
| Connections | 50 concurrent | ~10 avg | ✅ |
| Storage | 1 GB | ~100 MB (images) | **~900 MB free** |

**Verdict: Perfectly sized for our e-commerce app.**

---

## 📋 Migration Phases

### Phase 1: Supabase Client & Realtime Setup (Frontend)

#### 1.1 Install Supabase Dependencies
```bash
cd aims-commerce
npm install @supabase/supabase-js
```

#### 1.2 Create Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Admin key for server-side operations (next-api routes only)
export const supabaseAdmin = supabase
  .asServiceRole()
  .asClient // For server-side API routes only

```

#### 1.3 Add Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://tmnsezftbqitxibndtlk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

#### 1.4 Create Realtime Channel Hook (`src/hooks/useSupabaseRealtime.tsx`)
```typescript
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Channel } from '@supabase/supabase-js'

interface ChatMessage {
  id?: string
  body: string
  name: string
  _id: string
  isAdmin?: boolean
  created_at?: string
}

interface UserStatus {
  _id: string
  name: string
  online: boolean
  socketId?: string // Legacy, not used in RT
  messages?: ChatMessage[]
}

export function useSupabaseRealtime(
  userId: string | null,
  isAdmin: boolean,
  onMessage: (msg: ChatMessage) => void,
  onUserStatusChange: (users: UserStatus[]) => void,
) {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [users, setUsers] = useState<UserStatus[]>([])

  useEffect(() => {
    if (!userId) return

    // Create realtime channel for chat
    const rtChannel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages', // We'll create this table
        },
        (payload) => {
          onMessage(payload.new as ChatMessage)
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime chat channel subscribed')
        }
      })

    setChannel(rtChannel)

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, onMessage])

  return { users, setUsers }
}
```

#### 1.5 Create Messages Table in PostgreSQL
```sql
-- Create messages table for Supabase Realtime
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body TEXT NOT NULL,
  name TEXT NOT NULL,
  user_id UUID NOT NULL, -- references users.id
  is_admin BOOLEAN DEFAULT FALSE,
  is_bot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read all messages (public chat)
CREATE POLICY "Messages are readable by all authenticated users"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR is_admin = true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

---

### Phase 2: Replace Socket.IO with Supabase Realtime (Frontend Components)

#### 2.1 Replace `CustomerChatbox.tsx` Socket.IO

| Old (Socket.IO) | New (Supabase Realtime) |
|---|---|
| `socketIOClient(endpoint)` | `supabase.channel('chat-room')` |
| `socket.emit('onLogin', user)` | Insert `users online_status` table row |
| `socket.on('message', handler)` | `on('postgres_changes', { event: 'INSERT', table: 'messages' }, handler)` |
| `socket.emit('onMessage', msg)` | Insert into `messages` table |
| `socket.emit('onUserSelected', user)` | Update messages read status in DB |

#### 2.2 Replace `AdminSupportLayout.tsx` Socket.IO

| Old (Socket.IO) | New (Supabase Realtime) |
|---|---|
| Socket.IO event tracking | Realtime database changes |
| `sk.on('listUsers')` | Realtime query on `users online_status` table |
| `sk.on('updateUser')` | Realtime INSERT/UPDATE on `users online_status` |
| Polling unread messages | Database `is_read` flag + realtime |

#### 2.3 Create `users.online_status` Table
```sql
CREATE TABLE IF NOT EXISTS online_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  messages JSONB DEFAULT '[]'::jsonb,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE online_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view online status"
  ON online_status FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own status"
  ON online_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own status"
  ON online_status FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE online_status;
```

#### 2.4 Create Supabase Trigger for Auto-Online/User Sync
Create a Supabase Edge Function to handle user login/logout:
```typescript
// supabase/functions/handle-user-status/index.ts
import { serve } from 'https://deno.land/x/siftmod@0.0.5/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // This function receives auth events from Supabase
  // and updates online_status table accordingly
})
```

---

### Phase 3: Move Backend API Routes to Next.js

#### 3.1 Create Next.js API Routes Structure
```
aims-commerce/src/app/api/
├── users/
│   ├── auth/[...nextauth]/route.ts        # OAuth & JWT auth
│   ├── register/route.ts                  # User registration
│   ├── login/route.ts                     # User login
│   ├── profile/route.ts                   # Get/update profile
│   ├── admin/route.ts                     # Admin-only endpoints
│   └── escalate-to-human/route.ts         # Chatbot escalation
├── products/
│   ├── route.ts                           # GET all, POST create
│   └── [id]/route.ts                      # GET/PUT/DELETE by id
├── orders/
│   ├── route.ts                           # GET all, POST create
│   └── [id]/route.ts                      # GET/UPDATE by id
├── sellers/
│   ├── route.ts                           # GET all, POST create
│   └── [id]/route.ts                      # GET/PUT/DELETE by id
├── config/
│   ├── paypal/route.ts                    # PAYPAL_CLIENT_ID
│   └── google/route.ts                    # GOOGLE_API_KEY
└── upload/
    ├── route.ts                           # Handle file uploads (Multer)
    └── [id]/delete/route.ts               # Delete uploaded file
```

#### 3.2 Example: Users API Route (`src/app/api/users/login/route.ts`)
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = jwt.sign(
      { 
        _id: user.id, 
        name: user.name, 
        email: user.email,
        isAdmin: user.is_admin,
        is_seller: user.is_seller 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      isSeller: user.is_seller,
      token,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
```

---

### Phase 4: Handle File Uploads (Images)

#### 4.1 Option A: Use Supabase Storage (Recommended ✅)
```typescript
// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('image') as File

  // Upload to Vercel Blob Storage (free tier)
  const blob = await put(file.name, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  return NextResponse.json({ url: blob.url })
}
```

#### 4.2 Option B: Use Supabase Storage Bucket
```typescript
// Upload to Supabase Storage with same structure as /uploads
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('image') as File
  const folder = formData.get('folder') || 'products'

  const { data, error } = await supabase.storage
    .from('images')
    .upload(`${folder}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
```

#### 4.3 Required Supabase Storage Setup
```sql
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);

-- Set RLS policies for bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

---

### Phase 5: Testing Strategy

#### 5.1 Manual Testing Checklist

**Auth Endpoints:**
- [ ] User registration via `/api/users/register`
- [ ] User login via `/api/users/login`
- [ ] JWT token generation & validation
- [ ] Google OAuth flow (if enabled)
- [ ] Logout token invalidation

**Product API:**
- [ ] GET `/api/products` (all products)
- [ ] GET `/api/products/:id` (single product)
- [ ] POST `/api/products` (create product - admin)
- [ ] PUT `/api/products/:id` (update product)
- [ ] DELETE `/api/products/:id` (delete product)
- [ ] Product seller relationship sync

**Order API:**
- [ ] POST `/api/orders` (create order)
- [ ] GET `/api/orders` (fetch orders)
- [ ] GET `/api/orders/:id` (order details)
- [ ] Order status updates
- [ ] Order item relationship integrity

**Seller Dashboard API:**
- [ ] Seller profile creation
- [ ] Product CRUD for sellers
- [ ] Order fulfillment management
- [ ] User escalation handling

**Realtime Chat:**
- [ ] Admin sees user online status
- [ ] Messages persist in Supabase
- [ ] Realtime updates across tabs
- [ ] Chat history persists after refresh
- [ ] User switches between bot/admin mode
- [ ] Escalation workflow

**File Uploads:**
- [ ] Product images upload & return URL
- [ ] File deletion endpoint
- [ ] Storage bucket access policies

#### 5.2 Supabase Dashboard Verification
```sql
-- Check data integrity post-migration
SELECT 
  (SELECT count(*) FROM users) as total_users,
  (SELECT count(*) FROM sellers) as total_sellers,
  (SELECT count(*) FROM products) as total_products,
  (SELECT count(*) FROM orders) as total_orders,
  (SELECT count(*) FROM reviews) as total_reviews,
  (SELECT count(*) FROM messages) as total_messages;

-- Check relationships
SELECT 
  u.name, s.store_name, 
  (SELECT count(*) FROM products WHERE seller_id = s.id) as product_count,
  (SELECT count(*) FROM orders WHERE seller_id = s.id) as order_count
FROM users u
JOIN sellers s ON u.id = s.user_id;
```

---

### Phase 6: Vercel Deployment

#### 6.1 Vercel Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://tmnsezftbqitxibndtlk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
# Server-only (not exposed to browser)
DATABASE_URL=postgresql://postgres.tmnsezftbqitxibndtlk:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.tmnsezftbqitxibndtlk:pass@aws-0-us-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=<strong-random-string>
PAYPAL_CLIENT_ID=<paypal-merchant-id>
GOOGLE_API_KEY=<google-maps-api-key>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

#### 6.2 Vercel Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

#### 6.3 Prisma Integration in Next.js
```bash
# Install in frontend repo
cd aims-commerce
npm install prisma
npx prisma init --datasource-provider postgresql
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String
  email     String   @unique
  password  String
  // ... rest of fields
}
// ... all other models
```

---

### Phase 7: Complete Cutover Checklist

#### 7.1 Before Removing Railway

- [ ] All API routes migrated to Next.js (`src/app/api/`)
- [ ] Supabase Realtime fully tested in production
- [ ] File uploads working with new storage solution
- [ ] Database schema matches Supabase (migration applied)
- [ ] Environment variables set in Vercel dashboard
- [ ] CI/CD pipeline updated for Next.js build
- [ ] Backend health check endpoint: `GET /api/_health`

#### 7.2 After Successful Deployment

- [ ] DNS pointing to Vercel
- [ ] Old Railway deployment terminated (or kept as backup for 1 week)
- [ ] MongoDB database marked as read-only
- [ ] Monitor Vercel function logs for errors
- [ ] Monitor Supabase for connection issues
- [ ] Update any hardcoded backend URLs in frontend config

---

## 🎯 Timeline & Milestones

| Phase | Task | Duration | Status |
|---|---|---|---|
| 1 | Supabase Client + Realtime Setup | 2 days | ⬜ |
| 2 | Socket.IO → Supabase Realtime Migration | 3 days | ⬜ |
| 3 | API Routes (User, Product, Order) | 5 days | ⬜ |
| 4 | File Uploads Integration | 1 day | ⬜ |
| 5 | Testing (Local + Supabase Dashboard) | 3 days | ⬜ |
| 6 | Vercel Deployment | 1 day | ⬜ |
| 7 | Cutover & Railway Decommission | 1 day | ⬜ |
| **Total** | | **~16 days** | |

---

## ⚠️ Known Limitations & Workarounds

### 1. Prisma Connection Pooling with Vercel Serverless

**Problem:** Serverless functions spin up/down, new connections each time.

**Solution:** Use Prisma 5+ with `@prisma/adapter-pg` + PgBouncer pooling:

```typescript
// src/lib/prisma.ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // PgBouncer is already handling pooling
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
```

### 2. Next.js Serverless Function Timeout (10s)

**Problem:** Long-running operations (e.g., bulk imports) will time out.

**Solution:** Use Vercel Cron Jobs or Supabase Edge Functions for heavy processing.

### 3. WebSocket Limitations

**Problem:** Supabase Realtime is based on WebSockets, but for our use case, database events via Realtime are sufficient.

**Solution:** Database events replace Socket.IO events perfectly:
- User online/offline → `online_status` table changes
- Messages → `messages` table INSERT/UPDATE events
- Read receipts → `is_read` column updates

---

## 📝 Notes

1. **Backward Compatibility:** All tables use `@@map()` to preserve original MongoDB collection names (`users`, `sellers`, `products`, `orders`, `order_items`, `reviews`).

2. **Frontend Store Changes:** Redux slices (`user.slice.js`, `products.slice.js`, etc.) need to replace `fetch` calls with direct Supabase client queries where possible, or keep using Next.js API routes for complex logic.

3. **Testing Priority:** Test chat/realtime functionality first (Phase 2), as it's the most complex migration path from Socket.IO → Supabase Realtime.

4. **Rollback Plan:** Keep Railway running at no cost (stop deployment but keep data) for 1 week post-migration.
