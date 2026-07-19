import Link from "next/link";
import { AzmxLogo, Chevron, Eyebrow, Hairline } from "@/components/brand";
import { CreateRoomForm } from "./CreateRoomForm";

/**
 * /facilitator — create a room (gated by the proxy; cookie-authed). A new
 * room is created each week; the facilitator gets a join link + QR + short
 * human code and lands on the control panel.
 */
export default function FacilitatorCreatePage() {
  return (
    <main className="surface-white flex min-h-svh flex-col px-6 py-10 sm:px-12 lg:px-20">
      <header className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center">
          <AzmxLogo variant="color" height={24} />
          <span className="sr-only">AZMX — home</span>
        </Link>
        <span className="h-4 w-px bg-hairline-light" aria-hidden />
        <span className="az-caption uppercase text-neutral-500">Facilitator</span>
      </header>

      <div className="mt-16 grid flex-1 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
        {/* Left: the action (5 cols). */}
        <div className="lg:col-span-6">
          <Eyebrow surface="light" tick>
            New session
          </Eyebrow>
          <h1 className="az-title mt-4 max-w-md text-balance text-navy">
            Create this week&rsquo;s room
          </h1>
          <p className="az-lead mt-6 max-w-md text-neutral-900/80">
            You&rsquo;ll get a join link, a QR code, and a short code to put on
            the screen. Participants join on their phones.
          </p>

          <CreateRoomForm />
        </div>

        {/* Right: what you'll get (info panel on blue-50, hairline, no shadow). */}
        <aside className="lg:col-span-5 lg:col-start-8">
          <div className="surface-blue-50 p-8 sm:p-10">
            <span className="az-caption uppercase text-electric">You&rsquo;ll receive</span>
            <ul className="mt-6 space-y-5">
              {[
                ["A join link", "Unguessable room URL to share or QR-encode"],
                ["A short code", "Human-friendly, e.g. TUES-4821, shown on screen"],
                ["A projection view", "QR + live roster for the room display"],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <Chevron variant="filled" color="electric" size={12} className="mt-1.5 shrink-0" />
                  <div>
                    <p className="az-sublabel text-navy">{title}</p>
                    <p className="az-body mt-1 text-neutral-900/70">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="mt-16">
        <Hairline surface="light" />
        <p className="az-caption mt-4 uppercase text-neutral-500">
          Real names are purged when the room closes
        </p>
      </footer>
    </main>
  );
}
