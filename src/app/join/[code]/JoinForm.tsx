"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/brand";
import { joinRoom } from "@/app/actions/join";
import {
  loadParticipantSession,
  saveParticipantSession,
} from "@/lib/participantSession";
import type { JoinRoomResult } from "@/lib/types";

/**
 * The name form on /join/[code]. Posts to the `joinRoom` server action via
 * useActionState; on success stores {token, identity} in sessionStorage
 * (keyed by roomId, so refresh survives) and moves to /room/[roomId].
 *
 * The page already verified the room exists, so a `room_not_joinable` error
 * at submit time means one thing: the draw has started.
 */
export function JoinForm({ code, roomId }: { code: string; roomId: string }) {
  const router = useRouter();

  // Already joined on this phone? Skip the form — back to your seat.
  useEffect(() => {
    if (roomId && loadParticipantSession(roomId)) {
      router.replace(`/room/${roomId}`);
    }
  }, [roomId, router]);

  const [state, formAction, pending] = useActionState(
    async (
      _prev: JoinRoomResult | undefined,
      formData: FormData
    ): Promise<JoinRoomResult> =>
      joinRoom(code, String(formData.get("realName") ?? "")),
    undefined
  );

  useEffect(() => {
    if (state?.ok) {
      saveParticipantSession({
        roomId: state.roomId,
        roomCode: code,
        roomToken: state.roomToken,
        participant: state.participant,
      });
      router.push(`/room/${state.roomId}`);
    }
  }, [state, code, router]);

  const errorMessage =
    state && !state.ok
      ? state.error === "room_not_joinable"
        ? "The draw has started. Joining is closed."
        : state.message
      : null;

  return (
    <form action={formAction} className="mt-12 block">
      <label htmlFor="realName" className="az-caption uppercase text-ink-meta">
        Your real name
      </label>
      <input
        id="realName"
        name="realName"
        type="text"
        autoComplete="name"
        maxLength={60}
        required
        placeholder="e.g. Sara"
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? "join-error" : undefined}
        className="mt-3 w-full appearance-none border-0 border-b-2 border-ink-meta/70 bg-transparent
                   pb-3 font-display text-3xl text-ink outline-none
                   placeholder:text-ink-meta focus:border-accent"
      />
      {/* The retention window here must match public.real_name_retention()
          in supabase/migrations/0006_retention_purge.sql. */}
      <p className="az-caption mt-3 text-ink-meta">
        Shown only to the facilitator. You&rsquo;ll get a fun name for the
        screen, and your real name is deleted within 24 hours.
      </p>

      {errorMessage && (
        <p id="join-error" role="alert" className="az-caption mt-4 text-accent">
          {errorMessage}
        </p>
      )}

      <div className="mt-12">
        <Button
          variant="primary"
          surface="light"
          chevron
          fullWidth
          type="submit"
          disabled={pending || Boolean(state?.ok)}
        >
          {pending || state?.ok ? "Getting your name…" : "Get my name"}
        </Button>
      </div>
    </form>
  );
}

export default JoinForm;
