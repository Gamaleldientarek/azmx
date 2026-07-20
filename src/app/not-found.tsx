import Link from "next/link";
import { AzmxLogo, Button, Eyebrow, Hairline } from "@/components/brand";

/**
 * Custom 404 — navy "premium dark" edge state, matching the login/room
 * aesthetic. Serif carries the moment; two ways out (home, join). Fixed-dark
 * like the other navy shells, so no ThemeToggle.
 */
export default function NotFound() {
  return (
    <main className="surface-navy relative flex min-h-svh flex-col overflow-hidden px-6 py-10 sm:px-12">
      <header className="relative z-10 flex items-center gap-3">
        <Link href="/" className="inline-flex items-center">
          <AzmxLogo variant="white" height={24} />
          <span className="sr-only">AZMX — home</span>
        </Link>
        <span className="h-4 w-px bg-hairline-dark" aria-hidden />
        <span className="az-caption uppercase text-blue-200">Games</span>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-16">
        <Eyebrow surface="dark" tick>
          Error 404
        </Eyebrow>
        <h1 className="az-display mt-6 max-w-2xl text-balance text-white">
          This page isn&rsquo;t in the room
        </h1>
        <p className="az-body mt-6 max-w-md text-blue-100/90">
          The link may be old, mistyped, or the room it pointed to has closed.
          If someone sent you a join code, enter it fresh.
        </p>
        <div className="mt-12 flex max-w-md flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/join" surface="dark" variant="primary" chevron>
            Join a room
          </Button>
          <Button href="/" surface="dark" variant="secondary">
            Go to the start
          </Button>
        </div>
      </div>

      <footer className="relative z-10">
        <Hairline surface="dark" />
        <p className="az-caption mt-4 uppercase text-blue-200/70">
          Random Selector · games.gamaleldien.com
        </p>
      </footer>
    </main>
  );
}
