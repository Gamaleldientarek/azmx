"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandNumeral, Hairline } from "@/components/brand";
import { closeRoom, deleteRoom } from "@/app/actions/rooms";

/**
 * Facilitator room manager — every room in the system, newest first, with
 * Open / Close / Delete. Close ends the session and purges real names but
 * keeps the row; Delete removes the room entirely (cascade). Both use an
 * inline text confirm, AZMX style: rows + hairlines, no cards.
 */

export interface RoomListItem {
  id: string;
  code: string;
  name: string | null;
  status: "lobby" | "locked" | "drawing" | "revealed" | "closed";
  created_at: string;
  participants: number;
}

const STATUS_LABEL: Record<RoomListItem["status"], string> = {
  lobby: "Open · joining",
  locked: "Joining closed",
  drawing: "Locked · drawing",
  revealed: "Order revealed",
  closed: "Closed",
};

export function RoomsList({ rooms }: { rooms: RoomListItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<{
    id: string;
    action: "close" | "delete";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (rooms.length === 0) {
    return (
      <p className="az-body mt-8 max-w-sm text-ink-body/70">
        No rooms yet. The rooms you create appear here, so you can reopen,
        close, or delete them.
      </p>
    );
  }

  const run = (id: string, action: "close" | "delete") => {
    setConfirming(null);
    setError(null);
    startTransition(async () => {
      const result =
        action === "close" ? await closeRoom(id) : await deleteRoom(id);
      if (!result.ok) setError(result.message);
      router.refresh();
    });
  };

  return (
    <div className="mt-8">
      {error && (
        <p role="alert" className="az-caption mb-4 text-accent">
          {error}
        </p>
      )}
      <ul>
        {rooms.map((room, i) => {
          const isConfirming = confirming?.id === room.id;
          const date = new Date(room.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
          return (
            <li key={room.id}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
                <span className="min-w-0">
                  <span className="block az-sublabel text-ink">
                    {room.name?.trim() || "Random Selector"}
                  </span>
                  <span className="az-caption mt-0.5 block uppercase text-ink-meta">
                    {room.code} · {STATUS_LABEL[room.status]} · {date}
                  </span>
                </span>
                <span className="ms-auto flex items-center gap-5">
                  <span className="flex items-baseline gap-2">
                    <BrandNumeral
                      value={room.participants}
                      color="accent"
                      scale="sm"
                    />
                    <span className="az-caption uppercase text-ink-meta">
                      joined
                    </span>
                  </span>
                  {isConfirming ? (
                    <span className="flex items-center gap-4">
                      <span className="az-caption uppercase text-ink-meta">
                        {confirming.action === "delete"
                          ? "Delete forever?"
                          : "Close & purge names?"}
                      </span>
                      <button
                        type="button"
                        autoFocus
                        disabled={pending}
                        onClick={() => run(room.id, confirming.action)}
                        className="az-caption cursor-pointer uppercase text-accent underline-offset-4 hover:underline"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirming(null)}
                        className="az-caption cursor-pointer uppercase text-ink-meta underline-offset-4 hover:underline"
                      >
                        Keep
                      </button>
                    </span>
                  ) : (
                    <span className="flex items-center gap-4">
                      <Link
                        href={`/facilitator/${room.id}`}
                        className="az-caption uppercase text-accent underline-offset-4 hover:underline"
                      >
                        Open
                      </Link>
                      {room.status !== "closed" && (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() =>
                            setConfirming({ id: room.id, action: "close" })
                          }
                          className="az-caption cursor-pointer uppercase text-ink-meta underline-offset-4 hover:underline"
                        >
                          Close
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          setConfirming({ id: room.id, action: "delete" })
                        }
                        className="az-caption cursor-pointer uppercase text-ink-meta underline-offset-4 hover:underline"
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </span>
              </div>
              {i < rooms.length - 1 && <Hairline surface="light" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
