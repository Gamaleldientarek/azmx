"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client scoped to a single room.
 *
 * `roomToken` is the short-lived HS256 JWT minted server-side after a join
 * (claims: role="anon", room_id=<uuid>). Under RLS Option A every read policy
 * checks `auth.jwt() ->> 'room_id'`, so this client can only see its own room.
 *
 * Realtime: subscribe to the BASE tables `public.participants` (column grants
 * strip `real_name` from payloads), `public.draws`, and `public.rooms`.
 * Reads of the roster should use the sanitized `participants_public` view or
 * the granted safe columns of `participants`.
 */
export function createRoomClient(roomToken: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "See .env.example."
    );
  }

  const client = createClient(url, anonKey, {
    global: {
      // PostgREST reads authenticate with the scoped room JWT.
      headers: { Authorization: `Bearer ${roomToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  });

  // The Realtime websocket needs the scoped token too, so RLS applies to
  // change events exactly as it does to reads.
  client.realtime.setAuth(roomToken);

  return client;
}
