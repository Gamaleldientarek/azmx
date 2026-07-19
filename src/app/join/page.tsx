"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Chevron,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";

/**
 * /join — manual code entry for participants without the QR/link (the landing
 * CTA points here). Pure navigation: pushes to /join/[code], where the room
 * is validated and the name form lives. Mirrors the join page composition.
 */
export default function JoinCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/join/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="surface-white flex min-h-svh flex-col px-6 py-9 sm:px-10">
      <header>
        <Eyebrow surface="light" tick>
          Join a room
        </Eyebrow>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl text-ink">
            Sharing Tuesday
          </span>
        </div>
      </header>

      <div className="mt-16 flex-1">
        <h1 className="az-title max-w-sm text-balance text-ink">
          Enter the room code
        </h1>

        <form onSubmit={submit} className="mt-12 block">
          <label htmlFor="roomCode" className="az-caption uppercase text-ink-meta">
            Room code
          </label>
          <input
            id="roomCode"
            name="roomCode"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            required
            placeholder="TUES-4821"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-3 w-full appearance-none border-0 border-b-2 border-hairline bg-transparent
                       pb-3 font-display text-3xl uppercase text-ink outline-none
                       placeholder:text-ink-meta/40 focus:border-accent"
          />
          <p className="az-caption mt-3 text-ink-meta">
            It&rsquo;s on the screen — or scan the QR instead.
          </p>

          <div className="mt-12">
            <Button variant="primary" surface="light" chevron fullWidth type="submit">
              Continue
            </Button>
          </div>
        </form>
      </div>

      <footer className="mt-10">
        <Hairline surface="light" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <Chevron variant="filled" color="accent" size={10} />
            <span className="az-caption uppercase text-ink-meta">
              Joining locks when the selector runs
            </span>
          </div>
          <ThemeToggle surface="light" />
        </div>
      </footer>
    </main>
  );
}
