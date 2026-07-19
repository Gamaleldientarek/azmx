"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/brand";
import { joinRoom } from "@/app/actions/join";
import { saveParticipantSession } from "@/lib/participantSession";
import type { JoinRoomResult } from "@/lib/types";

/**
 * The name form on /join/[code]. Posts to the `joinRoom` server action via
 * useActionState; on success stores {token, identity} in sessionStorage
 * (keyed by roomId, so refresh survives) and moves to /room/[roomId].
 *
 * The page already verified the room exists, so a `room_not_joinable` error
 * at submit time means one thing: the draw has started.
 */
export function JoinForm({ code }: { code: string }) {
  const router = useRouter();

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
        ? "The draw has started — joining is closed."
        : state.message
      : null;

  return (
    <form action={formAction} className="mt-12 block">
      <label htmlFor="realName" className="az-caption uppercase text-neutral-500">
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
        className="mt-3 w-full appearance-none border-0 border-b-2 border-neutral-500/70 bg-transparent
                   pb-3 font-display text-3xl text-navy outline-none
                   placeholder:text-neutral-500 focus:border-electric"
      />
      <p className="az-caption mt-3 text-neutral-500">
        Shown only to the facilitator. You&rsquo;ll get a fun name for the
        screen.
      </p>

      {errorMessage && (
        <p id="join-error" role="alert" className="az-caption mt-4 text-electric">
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
