"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/brand";
import { createRoom } from "@/app/actions/rooms";
import type { CreateRoomResult } from "@/lib/types";

/**
 * Create-room form. Wired to the `createRoom` server action; on success the
 * facilitator lands on the control panel for the fresh room.
 */
export function CreateRoomForm() {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (
      _prev: CreateRoomResult | undefined,
      formData: FormData
    ): Promise<CreateRoomResult> => {
      const label = formData.get("label");
      return createRoom(typeof label === "string" ? label : undefined);
    },
    undefined
  );

  useEffect(() => {
    if (state?.ok) router.push(`/facilitator/${state.room.id}`);
  }, [state, router]);

  const errorMessage = state && !state.ok ? state.message : null;

  return (
    <form action={formAction} className="mt-12 block max-w-md">
      <label htmlFor="label" className="az-caption uppercase text-ink-meta">
        Room label (optional)
      </label>
      <input
        id="label"
        name="label"
        type="text"
        maxLength={120}
        placeholder="Team retro · 22 Jul"
        className="mt-3 w-full appearance-none border-0 border-b-2 border-hairline bg-transparent
                   pb-3 font-display text-2xl text-ink outline-none
                   placeholder:text-ink-meta/40 focus:border-accent"
      />

      {errorMessage && (
        <p role="alert" className="az-caption mt-4 text-accent">
          {errorMessage}
        </p>
      )}

      <div className="mt-12">
        <Button
          variant="primary"
          surface="light"
          chevron
          type="submit"
          disabled={pending || Boolean(state?.ok)}
        >
          {pending || state?.ok ? "Creating…" : "Create room"}
        </Button>
      </div>
    </form>
  );
}

export default CreateRoomForm;
