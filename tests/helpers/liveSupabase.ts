/**
 * Service-role Supabase client + room lifecycle helpers for the live suites.
 *
 * Mirrors src/lib/supabase/server.ts (which we deliberately do not import —
 * it is `server-only` + Next-coupled) so the tests exercise the database
 * exactly the way the app's server actions do.
 *
 * Test rooms are marked with the AUTOTEST_MARKER in `rooms.name` so cleanup
 * and the final "no leftovers" audit can find every room the suites created,
 * even after a mid-run crash.
 */

import { randomInt } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertNotProduction, loadLiveEnv } from "./liveEnv";

export const AUTOTEST_MARKER = "[AUTOTEST]";

export function createServiceClient(): SupabaseClient {
  loadLiveEnv();
  // Last line of defence: this is the ONLY factory for a write-capable client
  // in the live suites, so guarding here covers `npx vitest run tests/live`
  // invoked directly, bypassing the runner script. Throws on production.
  assertNotProduction();
  const url = process.env.TEST_SUPABASE_URL;
  const key = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Live env missing (TEST_SUPABASE_URL / TEST_SUPABASE_SERVICE_ROLE_KEY). " +
        "See .env.test.example — live tests never read .env.local."
    );
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** App-shaped room code (ROOM-####), collision-checked like src/lib/code.ts. */
export async function generateTestRoomCode(
  supabase: SupabaseClient
): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = `ROOM-${randomInt(1000, 10000)}`;
    const { count, error } = await supabase
      .from("rooms")
      .select("id", { count: "exact", head: true })
      .eq("code", code);
    if (error) throw new Error(`code collision check failed: ${error.message}`);
    if ((count ?? 0) === 0) return code;
  }
  throw new Error("could not find a free ROOM-#### code in 20 attempts");
}

/** Create a marked test room in lobby status; returns { id, code }. */
export async function createTestRoom(
  supabase: SupabaseClient,
  label: string
): Promise<{ id: string; code: string }> {
  const code = await generateTestRoomCode(supabase);
  const { data, error } = await supabase
    .from("rooms")
    .insert({ code, name: `${AUTOTEST_MARKER} ${label}`, status: "lobby" })
    .select("id, code")
    .single<{ id: string; code: string }>();
  if (error || !data) {
    throw new Error(`test room insert failed: ${error?.message}`);
  }
  return data;
}

/** Delete a room by id (FK cascade removes participants + draws). */
export async function deleteRoom(
  supabase: SupabaseClient,
  roomId: string
): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw new Error(`room cleanup delete failed: ${error.message}`);
}

/**
 * Safety net: delete every room whose name carries the AUTOTEST_MARKER and
 * return what was found — lets afterAll sweep leftovers from crashed runs
 * and lets the final audit assert the live DB holds zero test rooms.
 */
export async function sweepAutotestRooms(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name")
    .like("name", `${AUTOTEST_MARKER}%`);
  if (error) throw new Error(`autotest sweep select failed: ${error.message}`);
  const ids = (data ?? []).map((r: { id: string }) => r.id);
  if (ids.length > 0) {
    const { error: delError } = await supabase
      .from("rooms")
      .delete()
      .in("id", ids);
    if (delError) {
      throw new Error(`autotest sweep delete failed: ${delError.message}`);
    }
  }
  return ids;
}

/** Count rooms still carrying the AUTOTEST marker (must be 0 after cleanup). */
export async function countAutotestRooms(
  supabase: SupabaseClient
): Promise<number> {
  const { count, error } = await supabase
    .from("rooms")
    .select("id", { count: "exact", head: true })
    .like("name", `${AUTOTEST_MARKER}%`);
  if (error) throw new Error(`autotest count failed: ${error.message}`);
  return count ?? 0;
}
