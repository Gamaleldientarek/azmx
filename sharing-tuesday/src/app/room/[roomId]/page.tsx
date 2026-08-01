import { createServiceClient } from "@/lib/supabase/server";
import { RoomClient } from "./RoomClient";

export const dynamic = "force-dynamic";

/**
 * /room/[roomId] — participant phone view. Identity + the scoped room token
 * live in sessionStorage (set by the join flow) or are recovered from the
 * signed seat cookie; live state arrives over Supabase Realtime.
 *
 * The server resolves the human room code up front so the rejoin/retry
 * states can link back to the right room even when there is no session at
 * all — without it the rejoin link degrades to a bare /join and the user
 * has to retype a code they may never have seen.
 */
export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  let roomCode: string | null = null;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("rooms")
      .select("code")
      .eq("id", roomId)
      .maybeSingle<{ code: string }>();
    roomCode = data?.code ?? null;
  } catch (err) {
    console.error("room page code lookup failed:", err);
  }

  return <RoomClient roomId={roomId} roomCode={roomCode} />;
}
