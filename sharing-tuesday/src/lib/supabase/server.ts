import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env";

/**
 * Service-role Supabase client. SERVER ONLY.
 *
 * This client bypasses RLS and is the only thing allowed to call the
 * SECURITY DEFINER RPCs (`join_room`, `lock_room_for_draw`, `record_draw`,
 * `close_room`) — EXECUTE on those is granted to `service_role` exclusively.
 *
 * Env is read lazily inside the factory so the project builds with no `.env`.
 * A fresh client per call keeps server actions stateless; supabase-js clients
 * are lightweight (no connection pool of their own).
 */
export function createServiceClient(): SupabaseClient {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
