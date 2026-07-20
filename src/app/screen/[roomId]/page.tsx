import { notFound } from "next/navigation";
import { resolveBaseUrl } from "@/lib/baseUrl";
import { joinQrDataUrl } from "@/lib/qr";
import { mintRoomToken } from "@/lib/roomToken";
import { createServiceClient } from "@/lib/supabase/server";
import type { Draw, RoomStatus } from "@/lib/types";
import type { RosterParticipant } from "@/lib/useRoomRealtime";
import { ScreenLive } from "./ScreenLive";

export const dynamic = "force-dynamic";

/**
 * /screen/[roomId] — PROJECTION view (16:9, legible at 3-5m).
 *
 * No login friction on the room display: the unguessable roomId uuid is the
 * capability. The server fetches the initial room + sanitized roster (safe
 * columns only — never real_name), mints the scoped room JWT, and renders
 * the real join QR; the client component takes over with Realtime.
 */
export default async function ScreenPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const supabase = createServiceClient();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, name, status, created_at, closed_at")
    .eq("id", roomId)
    .maybeSingle<{
        id: string;
        code: string;
        name: string | null;
        status: RoomStatus;
        created_at: string;
        closed_at: string | null;
      }>();
  // Bad uuid or unknown room — both are a 404 (the id is the capability).
  if (roomError || !room) notFound();

  const [rosterRes, drawRes] = await Promise.all([
    supabase
      .from("participants")
      .select("id, room_id, display_name, join_number")
      .eq("room_id", roomId)
      .order("join_number")
      .returns<RosterParticipant[]>(),
    supabase
      .from("draws")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(1)
      .returns<Draw[]>(),
  ]);

  const roomToken = await mintRoomToken(roomId);
  const base = await resolveBaseUrl();
  const joinUrl = `${base}/join/${room.code}`;
  const qrDataUrl = await joinQrDataUrl(joinUrl);

  return (
    <ScreenLive
      roomId={room.id}
      createdAt={room.created_at}
      closedAt={room.closed_at}
      serverNow={new Date().toISOString()}
      roomToken={roomToken}
      roomName={room.name?.trim() || "Random Selector"}
      code={room.code}
      joinUrl={joinUrl}
      qrDataUrl={qrDataUrl}
      initialStatus={room.status}
      initialRoster={rosterRes.data ?? []}
      initialDraw={drawRes.data?.[0] ?? null}
    />
  );
}
