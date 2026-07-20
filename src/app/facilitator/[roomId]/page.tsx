import { notFound } from "next/navigation";
import { resolveBaseUrl } from "@/lib/baseUrl";
import { joinQrDataUrl } from "@/lib/qr";
import { mintRoomToken } from "@/lib/roomToken";
import { createServiceClient } from "@/lib/supabase/server";
import type { Draw, RoomStatus } from "@/lib/types";
import type { RosterParticipant } from "@/lib/useRoomRealtime";
import { ControlPanel } from "./ControlPanel";

export const dynamic = "force-dynamic";

/**
 * /facilitator/[roomId] — control panel (cookie-gated by the proxy).
 *
 * Server component: fetches the room + sanitized roster (fun names only —
 * the facilitator sees the same view as everyone), the latest draw, the
 * real join QR, and mints the scoped room token for client Realtime.
 */
export default async function FacilitatorRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const supabase = createServiceClient();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, code, name, status")
    .eq("id", roomId)
    .maybeSingle<{
      id: string;
      code: string;
      name: string | null;
      status: RoomStatus;
    }>();
  if (roomError || !room) notFound();

  const [rosterRes, drawRes] = await Promise.all([
    supabase
      .from("participants")
      .select("id, room_id, display_name, join_number, real_name")
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
    <ControlPanel
      roomId={room.id}
      roomToken={roomToken}
      code={room.code}
      roomName={room.name?.trim() || "Random Selector"}
      joinUrl={joinUrl}
      qrDataUrl={qrDataUrl}
      initialStatus={room.status}
      initialRoster={rosterRes.data ?? []}
      initialDraw={drawRes.data?.[0] ?? null}
    />
  );
}
