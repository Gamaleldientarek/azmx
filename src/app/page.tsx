import { Button, Chevron, Eyebrow, Hairline } from "@/components/brand";

/**
 * Landing — a simple branded entry that points into the flow.
 * Gradient is permitted here (event surface: the hero moment). Left-aligned,
 * top-weighted, asymmetric; one big ghost-chevron gesture bleeding off the end.
 */
export default function Home() {
  return (
    <main className="surface-event relative flex min-h-svh flex-col overflow-hidden">
      {/* The one big gesture — a ghost chevron bleeding off the inline-end edge. */}
      <Chevron
        variant="ghost"
        color="white"
        size={880}
        className="pointer-events-none absolute -end-40 top-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-6 py-10 sm:px-12 lg:px-20 lg:py-16">
        {/* Top: wordmark */}
        <header className="flex items-center gap-3">
          <span className="font-display text-xl text-white">AZMX</span>
          <span className="h-4 w-px bg-hairline-dark" aria-hidden />
          <span className="az-caption uppercase text-blue-200">Games</span>
        </header>

        {/* Middle: the hero, kept to ~7 columns, top-weighted. */}
        <div className="max-w-[52rem] py-16">
          <Eyebrow surface="dark" tick>
            Sharing Tuesday
          </Eyebrow>
          <h1 className="az-hero mt-6 text-balance text-white">
            Everyone shares. The order is fair.
          </h1>
          <p className="az-lead mt-8 max-w-xl text-blue-100/90">
            Join on your phone, get a name and a number, and let the selector
            decide who speaks first. A new room every week.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/join" surface="dark" variant="primary" chevron>
              Join a room
            </Button>
            <Button href="/facilitator/login" surface="dark" variant="secondary">
              I&rsquo;m the facilitator
            </Button>
          </div>
        </div>

        {/* Bottom: hairline footer + a quiet meta row. */}
        <footer className="max-w-[52rem]">
          <Hairline surface="dark" />
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="az-caption uppercase text-blue-200">
              Forward · Human always
            </span>
            <span className="az-caption text-blue-200/70">
              games.gamaleldien.com / random-selector
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
