import Link from "next/link";
import Image from "next/image";
import cover from "../../public/sharing-tuesday-cover-hero.jpg";
import {
  AzmxLogo,
  Button,
  Eyebrow,
  Hairline,
  ThemeToggle,
} from "@/components/brand";

/**
 * Landing — split composition around the official cover art.
 *
 * The photo is the event now: it bleeds full-height on the inline-end and
 * carries the color; all type lives on a solid Navy panel (type never sits on
 * the image). The panel column is capped so the art always owns the majority
 * of a wide viewport — no stranded columns, no empty gradient. One Electric
 * moment: the Join CTA. The hero asset is a crop of the client's cover with
 * the baked-in title/logo zone removed, so the live wordmark and headline
 * never duplicate the art. Landing stays fixed-dark (exempt from theming).
 */
export default function Home() {
  return (
    <main className="surface-navy grid min-h-svh grid-cols-1 grid-rows-[auto_auto_1fr_auto] lg:grid-cols-[minmax(30rem,40%)_1fr] lg:grid-rows-[auto_1fr_auto]">
      {/* Panel top: wordmark */}
      <header className="flex items-center gap-3 px-6 pb-6 pt-8 sm:px-10 lg:col-start-1 lg:row-start-1 lg:px-12 lg:pb-0 lg:pt-12 xl:px-16">
        <Link href="/" className="inline-flex items-center">
          <AzmxLogo variant="white" height={26} />
          <span className="sr-only">AZMX — home</span>
        </Link>
        <span className="h-4 w-px bg-hairline-dark" aria-hidden />
        <span className="az-caption uppercase text-blue-200">Games</span>
      </header>

      {/* The cover art — full-bleed band on phone, full-height bleed on the
          inline-end from lg up. Crop favors the still life (lower two thirds
          on the vertical phone crop; centered on the desktop crop). */}
      <div className="relative h-[38svh] min-h-64 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:h-auto lg:min-h-0">
        <Image
          src={cover}
          alt="Official Sharing Tuesday cover art — a deep red still life with pinned notes, stacked blocks, and a monstera plant"
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[50%_68%] lg:object-center"
        />
      </div>

      {/* Panel middle: the hero. Start-aligned, measured column. */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:col-start-1 lg:row-start-2 lg:px-12 lg:py-16 xl:px-16">
        <div className="max-w-xl">
          <Eyebrow surface="dark" tick>
            Sharing Tuesday
          </Eyebrow>
          {/* Two-line lockup: one sentence per line, sized by
              .az-display-split so neither sentence ever breaks mid-thought. */}
          <h1 className="az-display-split mt-6 text-white">
            <span className="block">Everyone shares.</span>
            <span className="block">The order is fair.</span>
          </h1>
          <p className="az-lead mt-6 max-w-lg text-blue-100/90">
            Join on your phone, get a name and a number, and let the selector
            decide who speaks first. A new room every week.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              href="/join"
              surface="dark"
              variant="primary"
              chevron
              className="w-full sm:w-auto"
            >
              Join a room
            </Button>
            <Button
              href="/facilitator/login"
              surface="dark"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              I&rsquo;m the facilitator
            </Button>
          </div>
        </div>
      </div>

      {/* Panel bottom: hairline footer + quiet meta row. */}
      <footer className="px-6 pb-8 sm:px-10 lg:col-start-1 lg:row-start-3 lg:px-12 lg:pb-12 xl:px-16">
        <Hairline surface="dark" />
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <AzmxLogo variant="white" height={22} />
          <span className="az-caption uppercase text-blue-200">
            Forward · Human always
          </span>
          {/* The landing stays fixed-dark in both themes; the toggle here sets
              the theme for the light in-flow pages. */}
          <ThemeToggle surface="dark" className="ms-auto" />
        </div>
      </footer>
    </main>
  );
}
