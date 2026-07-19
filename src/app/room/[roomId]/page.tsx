import { RoomClient } from "./RoomClient";

/**
 * /room/[roomId] — participant phone view. All data is client-side: the
 * identity + scoped room token live in sessionStorage (set by the join
 * flow), and live state arrives over Supabase Realtime. The server renders
 * only the shell.
 */
export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  return <RoomClient roomId={roomId} />;
}
