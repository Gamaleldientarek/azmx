import { Button, Chevron, Eyebrow, Hairline } from "@/components/brand";
import { createServiceClient } from "@/lib/supabase/server";
import type { RoomStatus } from "@/lib/types";
import { JoinForm } from "./JoinForm";

export const dynamic = "force-dynamic";

/**
 * /join/[code] — participant enters their REAL name. Phone-first, one-handed.
 * Server component: looks the room up by code (service role, safe fields
 * only) so unknown / locked / closed rooms get a friendly state instead of a
 * dead form. The form itself posts to the `joinRoom` server action.
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const roomCode = decodeURIComponent(code ?? "").trim().toUpperCase();

  let room: { id: string; name: string | null; status: RoomStatus } | null =
    null;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("rooms")
      .select("id, name, status")
      .eq("code", roomCode)
      .maybeSingle<{ id: string; name: string | null; status: RoomStatus }>();
    room = data;
  } catch (err) {
    console.error("join page room lookup failed:", err);
  }

  const roomName = room?.name?.trim() || "Sharing Tuesday";

  let blockedTitle: string | null = null;
  let blockedBody: string | null = null;
  if (!room) {
    blockedTitle = "We can’t find that room";
    blockedBody =
      "Check the code on the screen and try again — it looks like TUES-1234.";
  } else if (room.status === "closed") {
    blockedTitle = "This room has ended";
    blockedBody = "The session is over. A new room opens next Tuesday.";
  } else if (room.status !== "lobby") {
    blockedTitle = "The draw has started";
    blockedBody =
      "Joining is closed for this round — watch the screen for the order.";
  }

  return (
    <main className="surface-white flex min-h-svh flex-col px-6 py-9 sm:px-10">
      {/* Header: which room you're joining. Top-weighted. */}
      <header>
        <Eyebrow surface="light" tick>
          You&rsquo;re joining
        </Eyebrow>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl text-navy">{roomName}</span>
        </div>
        <p className="az-caption mt-2 uppercase text-neutral-500">
          Room {roomCode || "—"}
        </p>
      </header>

      <div className="mt-16 flex-1">
        {blockedTitle ? (
          <>
            <h1 className="az-title max-w-sm text-balance text-navy">
              {blockedTitle}
            </h1>
            <p className="az-body mt-6 max-w-sm text-neutral-900/70">
              {blockedBody}
            </p>
            <div className="mt-12 max-w-sm">
              <Button variant="secondary" surface="light" fullWidth href="/join">
                Try another code
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* The ask — serif for personality. */}
            <h1 className="az-title max-w-sm text-balance text-navy">
              What&rsquo;s your name?
            </h1>
            <JoinForm code={roomCode} />
          </>
        )}
      </div>

      {/* Footer flow-tick. */}
      <footer className="mt-10">
        <Hairline surface="light" />
        <div className="mt-4 flex items-center gap-2">
          <Chevron variant="filled" color="electric" size={10} />
          <span className="az-caption uppercase text-neutral-500">
            Joining locks when the selector runs
          </span>
        </div>
      </footer>
    </main>
  );
}
