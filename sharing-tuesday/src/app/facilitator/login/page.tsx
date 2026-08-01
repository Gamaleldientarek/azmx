import Link from "next/link";
import { AzmxLogo, Eyebrow, Hairline } from "@/components/brand";
import { LoginForm } from "./LoginForm";

/**
 * /facilitator/login — the password gate. The shared password is verified
 * server-side (env var, constant-time) and never shipped to the client.
 * Focused navy "premium dark" surface (intended contrast with the light
 * facilitator work area).
 */
export default function FacilitatorLoginPage() {
  return (
    <main className="surface-navy surface-navy-ambient relative flex min-h-svh flex-col overflow-hidden px-6 py-10 sm:px-12">

      <header className="relative z-10 flex items-center gap-3">
        <Link href="/" className="inline-flex items-center">
          <AzmxLogo variant="white" height={24} />
          <span className="sr-only">AZMX — home</span>
        </Link>
        <span className="h-4 w-px bg-hairline-dark" aria-hidden />
        <span className="az-caption uppercase text-blue-200">Facilitator</span>
      </header>

      <div className="relative z-10 flex flex-1 items-center">
        <div className="w-full max-w-md">
          <Eyebrow surface="dark" tick>
            Restricted
          </Eyebrow>
          <h1 className="az-title mt-4 text-white">Sign in to run a room</h1>

          <LoginForm />
        </div>
      </div>

      <footer className="relative z-10">
        <Hairline surface="dark" />
        <p className="az-caption mt-4 uppercase text-blue-200/70">
          Random Selector · one room per session
        </p>
      </footer>
    </main>
  );
}
