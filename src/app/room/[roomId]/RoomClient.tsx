"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BrandNumeral,
  Button,
  Chevron,
  Eyebrow,
  Hairline,
} from "@/components/brand";
import { useParticipantSession } from "@/lib/participantSession";
import { useRoomRealtime } from "@/lib/useRoomRealtime";

/**
 * /room/[roomId] — the participant's live phone view.
 *
 * Identity + the scoped room token come from sessionStorage (stored at join,
 * keyed by roomId, so refresh survives). Live state comes from the shared
 * realtime hook. Status-driven: lobby (identity hero + waiting), drawing
 * (brief suspense — the phone's simplified, non-wheel version), revealed
 * (the order with "you" highlighted and the starter marked), closed.
 */
export function RoomClient({ roomId }: { roomId: string }) {
  // undefined = SSR/hydration shell, null = no valid session on this phone.
  const session = useParticipantSession(roomId);

  const { status, roster, latestDraw, authError } = useRoomRealtime({
    roomId,
    roomToken: session?.roomToken ?? null,
  });

  // Suspense beat when a draw lands: hold ~1.8s before showing the order
  // (the phone's simplified, non-wheel reveal). Skipped for reduced motion.
  // Render-phase state adjustment (no setState-in-effect): when the draw id
  // changes, arm the hold; a timeout releases it.
  const drawId = latestDraw?.id ?? null;
  const [seenDrawId, setSeenDrawId] = useState<string | null>(null);
  const [suspenseHold, setSuspenseHold] = useState(false);
  if (drawId !== seenDrawId) {
    setSeenDrawId(drawId);
    if (
      drawId &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setSuspenseHold(true);
    }
  }
  useEffect(() => {
    if (!suspenseHold) return;
    const t = window.setTimeout(() => setSuspenseHold(false), 1800);
    return () => window.clearTimeout(t);
  }, [suspenseHold, drawId]);

  const rosterById = useMemo(() => {
    const map = new Map<string, { display_name: string; join_number: number }>();
    for (const p of roster) map.set(p.id, p);
    return map;
  }, [roster]);

  const order = useMemo(() => {
    if (!latestDraw) return [];
    return latestDraw.order
      .map((id) => {
        const p = rosterById.get(id);
        return p
          ? { id, displayName: p.display_name, joinNumber: p.join_number }
          : null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [latestDraw, rosterById]);

  // Storage still loading — quiet navy shell, no flash of the wrong state.
  if (session === undefined) {
    return <main className="surface-navy min-h-svh" aria-busy="true" />;
  }

  // No identity on this phone (or the token expired) — gentle rejoin prompt.
  if (session === null || authError) {
    const rejoinHref = session?.roomCode ? `/join/${session.roomCode}` : "/join";
    return (
      <main className="surface-navy relative flex min-h-svh flex-col overflow-hidden px-6 py-12 sm:px-10">
        <div className="relative z-10 flex flex-1 flex-col">
          <Eyebrow surface="dark" tick>
            Sharing Tuesday
          </Eyebrow>
          <h1 className="az-title mt-8 max-w-sm text-balance text-white">
            We couldn&rsquo;t find your seat on this phone
          </h1>
          <p className="az-body mt-6 max-w-sm text-blue-100/90">
            Your join session isn&rsquo;t here any more — it may have expired,
            or you joined on another device. Rejoin to get a name.
          </p>
          <div className="mt-12 max-w-sm">
            <Button variant="primary" surface="dark" chevron fullWidth href={rejoinHref}>
              Rejoin the room
            </Button>
          </div>
        </div>
        <footer className="relative z-10 mt-10">
          <Hairline surface="dark" />
          <p className="az-caption mt-4 uppercase text-blue-200/70">
            Joining locks when the selector runs
          </p>
        </footer>
      </main>
    );
  }

  const me = session.participant;
  const revealed =
    (status === "revealed" || status === "closed") &&
    latestDraw !== null &&
    order.length === latestDraw.order.length &&
    order.length > 0 &&
    !suspenseHold;
  const drawing =
    status === "drawing" || suspenseHold || (status === "revealed" && !revealed);
  const closed = status === "closed";

  const liveStatusText = closed
    ? "This room has closed"
    : drawing
      ? "The selector is running…"
      : revealed
        ? "The order is set"
        : "Waiting in the lobby · watch the screen";

  return (
    <main className="flex min-h-svh flex-col">
      {/* Identity hero — navy "premium dark" moment. */}
      <section className="surface-navy relative overflow-hidden px-6 py-12 sm:px-10">
        <div className="relative z-10">
          <Eyebrow surface="dark" tick>
            Welcome
          </Eyebrow>
          {me.real_name && (
            <p className="az-sublabel mt-3 text-blue-100">{me.real_name}</p>
          )}
          <p className="az-caption mt-8 uppercase text-blue-200">
            Your name for today
          </p>

          <div className="mt-3 flex items-start gap-5">
            {/* Serif fun name = the hero personality. */}
            <h1 className="font-display text-5xl leading-[0.98] text-white sm:text-6xl">
              {me.display_name}
            </h1>
          </div>

          {/* Join number as styled serif brand numeral. */}
          <div className="mt-8 flex items-center gap-4">
            <span className="az-caption uppercase text-blue-200">Number</span>
            <span className="h-5 w-px bg-hairline-dark" aria-hidden />
            <BrandNumeral
              value={me.join_number}
              pad={2}
              color="light-blue"
              scale="sm"
            />
          </div>

          <div className="mt-10">
            <Hairline surface="dark" />
            <div
              className="mt-5 flex items-center gap-3"
              data-slot="live-status"
              aria-live="polite"
            >
              {!closed && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-light-blue opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-light-blue" />
                </span>
              )}
              <span className="az-body text-blue-100/90">{liveStatusText}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Status-driven lower surface. */}
      <section className="surface-white flex-1 px-6 py-12 sm:px-10">
        {revealed ? (
          <>
            <Eyebrow surface="light" tick>
              Speaking order
            </Eyebrow>
            <h2 className="az-h2 mt-3 text-navy">Who goes when</h2>

            {/* Announce the participant's own slot once the order settles. */}
            <p className="sr-only" aria-live="polite">
              {`You are number ${
                order.findIndex((p) => p.id === me.id) + 1
              } of ${order.length}. ${order[0].displayName} speaks first.`}
            </p>
            <ol className="mt-8">
              {order.map((p, i) => {
                const mine = p.id === me.id;
                const marks = [
                  ...(i === 0 ? ["First"] : []),
                  ...(mine ? ["You"] : []),
                ];
                return (
                  <li
                    key={p.id}
                    className="az-rise"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div
                      className={`flex flex-wrap items-center gap-x-5 gap-y-1 py-4 ${
                        mine ? "ps-4 border-s-2 border-electric" : ""
                      }`}
                    >
                      <BrandNumeral
                        value={i + 1}
                        pad={2}
                        color={mine ? "electric" : "navy"}
                        scale="sm"
                        className="w-14 shrink-0"
                      />
                      <span
                        className={`font-display text-2xl ${
                          mine ? "text-electric" : "text-navy"
                        }`}
                      >
                        {p.displayName}
                      </span>
                      {marks.length > 0 && (
                        <span
                          className={`az-caption ms-auto uppercase ${
                            mine ? "text-electric" : "text-neutral-500"
                          }`}
                        >
                          {marks.join(" · ")}
                        </span>
                      )}
                    </div>
                    {i < order.length - 1 && <Hairline surface="light" />}
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 flex items-center gap-2">
              <Chevron variant="filled" color="electric" size={10} />
              <span className="az-caption uppercase text-neutral-500">
                Room {session.roomCode} · order is final
              </span>
            </div>
          </>
        ) : closed ? (
          <>
            <Eyebrow surface="light" tick>
              Session over
            </Eyebrow>
            <h2 className="az-h2 mt-3 text-navy">This room has closed</h2>
            <p className="az-body mt-4 max-w-sm text-neutral-900/70">
              See you next Tuesday — a new room opens each week.
            </p>
            <p className="az-caption mt-8 uppercase text-neutral-500">
              Real names are purged when the room closes
            </p>
          </>
        ) : drawing ? (
          <>
            <Eyebrow surface="light" tick>
              Any moment now
            </Eyebrow>
            <h2 className="az-h2 mt-3 text-navy">Drawing the order</h2>
            <p className="az-body mt-4 max-w-sm text-neutral-900/70">
              The selector is spinning on the big screen. Your place is about
              to land here.
            </p>
          </>
        ) : (
          <>
            <Eyebrow surface="light" tick>
              The room
            </Eyebrow>
            <div className="mt-6 flex items-baseline gap-4">
              <BrandNumeral value={roster.length} color="electric" scale="md" />
              <span className="az-body text-neutral-900/70">
                {roster.length === 1 ? "person" : "people"} in the room so far
              </span>
            </div>
            <p className="az-caption mt-8 uppercase text-neutral-500">
              Room {session.roomCode} · joining locks when the selector runs
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default RoomClient;
