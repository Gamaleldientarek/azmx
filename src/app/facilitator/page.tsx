import Link from "next/link";
import {
  AzmxLogo,
  BrandNumeral,
  Chevron,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";
import { createServiceClient } from "@/lib/supabase/server";
import { CreateRoomForm } from "./CreateRoomForm";
import { RoomsList, type RoomListItem } from "./RoomsList";

export const dynamic = "force-dynamic";

/**
 * /facilitator — create a room (gated by the proxy; cookie-authed), plus the
 * room manager: every existing room with Open / Close / Delete so the
 * facilitator can clean up after themselves.
 */
export default async function FacilitatorCreatePage() {
  let rooms: RoomListItem[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("rooms")
      .select("id, code, name, status, created_at, participants(count)")
      .order("created_at", { ascending: false })
      .limit(30);
    rooms = (data ?? []).map((r) => ({
      id: r.id as string,
      code: r.code as string,
      name: r.name as string | null,
      status: r.status as RoomListItem["status"],
      created_at: r.created_at as string,
      participants:
        (r.participants as unknown as { count: number }[])?.[0]?.count ?? 0,
    }));
  } catch (err) {
    console.error("facilitator rooms list failed:", err);
  }

  return (
    <main className="surface-white flex min-h-svh flex-col px-6 py-10 sm:px-12 lg:px-20">
      <header className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center">
          <span className="inline-flex dark:hidden">
            <AzmxLogo variant="color" height={24} />
          </span>
          <span className="hidden dark:inline-flex">
            <AzmxLogo variant="white" height={24} />
          </span>
          <span className="sr-only">AZMX — home</span>
        </Link>
        <span className="h-4 w-px bg-hairline" aria-hidden />
        <span className="az-caption uppercase text-ink-meta">Facilitator</span>
      </header>

      <div className="mt-16 grid flex-1 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
        {/* Left: the action (5 cols). */}
        <div className="lg:col-span-6">
          <Eyebrow surface="light" tick>
            New session
          </Eyebrow>
          <h1 className="az-title mt-4 max-w-md text-balance text-ink">
            Create this week&rsquo;s room
          </h1>
          <p className="az-lead mt-6 max-w-md text-ink-body/80">
            You&rsquo;ll get a join link, a QR code, and a short code to put on
            the screen. Participants join on their phones.
          </p>

          <CreateRoomForm />
        </div>

        {/* Right: what you'll get (info panel on blue-50, hairline, no shadow). */}
        <aside className="lg:col-span-5 lg:col-start-8">
          <div className="surface-blue-50 p-8 sm:p-10">
            <span className="az-caption uppercase text-accent">You&rsquo;ll receive</span>
            <ul className="mt-6 space-y-5">
              {[
                ["A join link", "Unguessable room URL to share or QR-encode"],
                ["A short code", "Human-friendly, e.g. TUES-4821, shown on screen"],
                ["A projection view", "QR + live roster for the room display"],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <Chevron variant="filled" color="accent" size={12} className="mt-1.5 shrink-0" />
                  <div>
                    <p className="az-sublabel text-ink">{title}</p>
                    <p className="az-body mt-1 text-ink-body/70">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Room manager — every room, newest first: Open / Close / Delete. */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="az-h2 text-ink">Your rooms</h2>
          <BrandNumeral value={rooms.length} color="accent" scale="sm" />
        </div>
        <p className="az-caption mt-2 uppercase text-ink-meta">
          Close ends a session and purges real names · delete removes it
          entirely
        </p>
        <RoomsList rooms={rooms} />
      </section>

      <footer className="mt-16">
        <Hairline surface="light" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="az-caption uppercase text-ink-meta">
            Real names are purged when the room closes
          </p>
          <ThemeToggle />
        </div>
      </footer>
    </main>
  );
}
