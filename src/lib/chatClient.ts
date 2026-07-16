/**
 * Supabase Realtime chat client.
 *
 * Drop-in replacement for `socket.io-client` so existing components don't
 * have to change their call sites. Uses Supabase channels (postgres_changes)
 * under the hood, with the `chat_messages` and `chat_sessions` tables
 * created by `prisma/migrations/5_chat_supabase_realtime.sql`.
 *
 * Events emulated (compatible with the old Socket.IO client):
 *   client emits:
 *     onLogin({ _id, name, isAdmin, email })         — upsert chat_sessions
 *     onUserSelected({ _id })                        — no-op (client-side filter)
 *     onMessage({ body, name, isAdmin, _id })        — INSERT chat_messages
 *     escalateToHuman(userData)                      — INSERT special message
 *   server emits (now broadcast to all subscribers):
 *     message           — every chat_messages INSERT
 *     updateUser        — chat_sessions UPDATE
 *     listUsers         — initial chat_sessions snapshot
 *     selectUser        — no-op
 *     chatbotEscalation — chat_messages INSERT with [HUMAN_REQUEST] prefix
 *
 * Usage (identical to socket.io-client):
 *   const socket = createChatClient({ user: userInfo });
 *   socket.emit("onLogin", userInfo);
 *   socket.on("message", (msg) => { ... });
 *   socket.disconnect();
 */

import { createClient, RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
function getClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("chatClient: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  _client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}

export interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  isAdmin: boolean;
}

export interface ChatMessage {
  _id?: string;
  id?: string;
  body: string;
  name: string;
  isAdmin: boolean;
  sender_id?: string;
  sender_name?: string;
  recipient_id?: string;
  created_at?: string;
}

export type ChatEvent =
  | "onLogin"
  | "onMessage"
  | "onUserSelected"
  | "escalateToHuman"
  | "message"
  | "updateUser"
  | "listUsers"
  | "selectUser"
  | "chatbotEscalation"
  | "disconnect";

type Handler = (payload: any) => void;

export interface ChatClient {
  emit(event: ChatEvent, payload?: any): void;
  on(event: ChatEvent, handler: Handler): void;
  off(event: ChatEvent, handler?: Handler): void;
  disconnect(): void;
  connected: boolean;
  id: string;
}

export function createChatClient(opts: { user: ChatUser }): ChatClient {
  const supabase = getClient();
  const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const handlers: Map<ChatEvent, Set<Handler>> = new Map();
  let channel: RealtimeChannel | null = null;
  let user: ChatUser = opts.user;
  let connected = false;

  function emit(event: ChatEvent, payload?: any) {
    // Synthetic client-side events
    if (event === "onLogin") {
      user = { ...user, ...payload };
      login().catch((e) => console.error("[chat] login failed:", e));
      return;
    }
    if (event === "onUserSelected") {
      // No-op: admin filters messages client-side
      return;
    }
    if (event === "onMessage") {
      sendMessage(payload).catch((e) => console.error("[chat] send failed:", e));
      return;
    }
    if (event === "escalateToHuman") {
      escalateToHuman(payload).catch((e) => console.error("[chat] escalate failed:", e));
      return;
    }
  }

  function on(event: ChatEvent, handler: Handler) {
    if (!handlers.has(event)) handlers.set(event, new Set());
    handlers.get(event)!.add(handler);
  }

  function off(event: ChatEvent, handler?: Handler) {
    if (!handler) {
      handlers.delete(event);
    } else {
      handlers.get(event)?.delete(handler);
    }
  }

  function fire(event: ChatEvent, payload: any) {
    const set = handlers.get(event);
    if (set) for (const h of set) h(payload);
  }

  // ── Supabase writes ────────────────────────────────────────
  async function login() {
    if (!user._id || !user.name) {
      console.warn("[chat] onLogin called without _id/name");
      return;
    }
    const { error } = await supabase
      .from("chat_sessions")
      .upsert(
        {
          user_id: user._id,
          user_name: user.name,
          user_email: user.email || "",
          is_admin: !!user.isAdmin,
          online: true,
          last_seen: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    if (error) console.error("[chat] login upsert error:", error);
  }

  async function sendMessage(msg: ChatMessage) {
    if (!msg || !msg.body) return;
    const row = {
      sender_id: user._id,
      sender_name: msg.name || user.name,
      is_admin: !!msg.isAdmin,
      recipient_id: msg._id && msg.isAdmin ? msg._id : null,
      body: msg.body,
    };
    const { error } = await supabase.from("chat_messages").insert(row);
    if (error) console.error("[chat] message insert error:", error);
  }

  async function escalateToHuman(userData: any) {
    // Insert a marker message so any admin can see the escalation request
    const { error } = await supabase.from("chat_messages").insert({
      sender_id: user._id,
      sender_name: userData?.name || user.name,
      is_admin: false,
      recipient_id: null,
      body: `[HUMAN_REQUEST] ${userData?.message || "User requested human assistance"}`,
    });
    if (error) console.error("[chat] escalate error:", error);
  }

  async function markOffline() {
    if (!user._id) return;
    await supabase
      .from("chat_sessions")
      .update({ online: false, last_seen: new Date().toISOString() })
      .eq("user_id", user._id);
  }

  // ── Supabase realtime subscriptions ─────────────────────────
  function subscribe() {
    if (channel) return;
    channel = supabase
      .channel(`chat-room-${id}`)
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload: any) => {
          const row = payload.new;
          const chatMsg: ChatMessage = {
            _id: row.sender_id,
            id: row.id,
            body: row.body,
            name: row.sender_name,
            isAdmin: row.is_admin,
            sender_id: row.sender_id,
            sender_name: row.sender_name,
            recipient_id: row.recipient_id,
            created_at: row.created_at,
          };
          // Fire 'message' for all messages
          fire("message", chatMsg);
          // Fire 'chatbotEscalation' for admins when a human request comes in
          if (row.body?.startsWith?.("[HUMAN_REQUEST]") && user.isAdmin) {
            fire("chatbotEscalation", {
              user: { _id: row.sender_id, name: row.sender_name },
              message: row.body.replace("[HUMAN_REQUEST] ", ""),
              timestamp: row.created_at,
            });
          }
        }
      )
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "chat_sessions" },
        (payload: any) => {
          // INSERT or UPDATE → fire updateUser (used by admin to refresh)
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            fire("updateUser", {
              _id: payload.new.user_id,
              name: payload.new.user_name,
              email: payload.new.user_email,
              isAdmin: payload.new.is_admin,
              online: payload.new.online,
            });
          }
        }
      );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        connected = true;
        // Fire listUsers with the current sessions snapshot for admins
        if (user.isAdmin) {
          supabase
            .from("chat_sessions")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data) {
                const list = data.map((r) => ({
                  _id: r.user_id,
                  name: r.user_name,
                  email: r.user_email,
                  isAdmin: r.is_admin,
                  online: r.online,
                }));
                fire("listUsers", list);
              }
            });
        }
      }
    });
  }

  function disconnect() {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
    markOffline();
    connected = false;
    fire("disconnect", { reason: "client called disconnect()" });
  }

  // Kick off
  subscribe();

  return { emit, on, off, disconnect, connected: false, id };
}
