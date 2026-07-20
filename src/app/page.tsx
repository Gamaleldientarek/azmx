import Link from "next/link";
import Image from "next/image";
import cover from "../../public/sharing-tuesday-cover-clean.jpg";
import {
  AzmxLogo,
  Button,
  Chevron,
  Hairline,
} from "@/components/brand";

/**
 * Landing — the clean cover art is the stage; the title and mark are LIVE
 * (client direction: "make it with code and make it working responsively").
 *
 * The client supplied a text-free version of the red still life with the
 * whole inline-start ~55% left as a calm wall, made for type. The editorial
 * lockup returns as real, responsive code, start-aligned on that wall:
 * AZMX mark (header, links home) → eyebrow → two-line serif "Sharing /
 * Tuesday" (az-hero, mirroring the original poster's line break) → lead →
 * the two CTAs. Footer strip carries the tagline + URL caption.
 *
 * Contrast decisions (measured on the clean art's pixels):
 * - Wall type column (x < 0.42): white averages 12:1, worst-case 7.9:1
 *   (AAA). NO scrim behind the lockup — the clean wall needs none.
 * - Electric #001aff on this red family: 1.2–1.8:1 (chroma vibration, no
 *   boundary) — still banned. The ONE hot CTA stays a white block with a
 *   Navy label; Electric survives only as the chevron punctuation on white
 *   (8:1). Light Blue measures 3.2–5.3:1 — passes as a ≥3:1 graphic (the
 *   eyebrow tick) but not as small text, so eyebrow text is white.
 * - The lit floor at the bottom dips to ~2.9:1, so the localized red-black
 *   gradient stays under the footer strip (and under the bottom-anchored
 *   CTAs on phone/tablet) only — never a full-page wash.
 *
 * Composition: the still life sits right-of-center (x 0.41–0.95). Portrait
 * crops bias toward it (object-position 70%) so the blocks/plant stay in
 * frame while the lockup owns the darker upper wall; from lg the crop
 * relaxes to 55% so both the wall and the whole still life share the frame,
 * and the type column is width-capped so nothing overlaps the still life.
 * Landing stays fixed-dark (exempt from theming).
 */
export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col bg-navy text-white">
      {/* Full-bleed clean cover. Portrait keeps the still life in frame
          (70%); landscape balances wall + still life (55%). */}
      <div className="absolute inset-0">
        <Image
          src={cover}
          alt="Sharing Tuesday cover art — a deep red still life of a pinboard with white notes, stacked blocks, and a monstera plant in a round vase"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="select-none object-cover object-[70%_50%] lg:object-[55%_50%]"
        />
        {/* Localized legibility gradient: bottom band only, red-black so the
            image darkens instead of graying out. It exists for the footer
            caption (lit floor ~2.9:1 bare) and the bottom-anchored CTAs on
            phone/tablet; the lockup on the wall never relies on it. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[38svh] bg-[linear-gradient(to_top,rgba(20,2,6,0.68),rgba(20,2,6,0.26)_55%,transparent)] lg:h-[22svh] lg:bg-[linear-gradient(to_top,rgba(20,2,6,0.6),rgba(20,2,6,0.2)_55%,transparent)]"
        />
      </div>

      {/* Header — the live AZMX mark, back on every breakpoint now that the
          baked one is gone. White on the wall: 9.9:1 avg / 7.6:1 worst. */}
      <header className="relative px-6 pt-8 sm:px-10 lg:px-az-6 lg:pt-az-4 xl:px-az-7">
        <Link
          href="/"
          className="inline-flex items-center rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <AzmxLogo variant="white" height={24} />
          <span className="sr-only">AZMX — home</span>
        </Link>
      </header>

      {/* The editorial lockup, start-aligned on the clean wall. Phone/tablet:
          top-anchored over the dark upper wall (10.9:1 worst), CTAs pushed to
          the bottom scrim band. From lg the whole group centers vertically
          and the column is capped (max-w-sm → max-w-md at xl) so the CTA row
          ends before the still life's inline edge (image x 0.41). */}
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-10 sm:px-10 lg:justify-center lg:px-az-6 lg:py-az-4 xl:px-az-7">
        <div className="max-w-md lg:max-w-sm xl:max-w-md">
          {/* Eyebrow — white text (Light Blue fails 4.5:1 as small text on
              this red); the tick keeps the two-blues accent as a ≥3:1
              graphic. Same taxonomy label as the join page header. */}
          <p className="eyebrow flex items-center gap-2 text-white/90">
            <Chevron variant="filled" color="light-blue" size={10} />
            <span>Games</span>
          </p>
          {/* The live title — the original poster's two-line serif lockup,
              now real text on the az-hero clamp scale. */}
          <h1 className="az-hero mt-4 text-white lg:mt-az-3">
            Sharing
            <br />
            Tuesday
          </h1>
          <p className="az-lead mt-5 max-w-[24rem] text-white lg:mt-az-3">
            Everyone shares. The order is fair.
          </p>
        </div>

        {/* CTAs: bottom-anchored full-width stack on phone (over the scrim
            band, clear of the white pinned notes mid-frame); inline row under
            the lead from lg, wrap-tolerant so a narrow lg viewport stacks
            instead of crossing onto the still life. */}
        <div className="mt-auto flex flex-col gap-4 pt-10 sm:flex-row sm:flex-wrap sm:items-center lg:mt-az-4 lg:pt-0">
          {/* The one hot CTA — white block, Navy label. Electric-on-red
              measured 1.2–1.8:1, so Electric appears only as the chevron
              punctuation on the white block. */}
          <Link
            href="/join"
            className="group inline-flex min-h-14 w-full select-none items-center justify-center gap-3 rounded-[2px] bg-white px-6 py-4 font-body text-base font-semibold tracking-[0.01em] text-navy transition-colors duration-150 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            <span>Join a room</span>
            <Chevron
              variant="filled"
              color="electric"
              size={12}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
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

      {/* Footer strip — tagline + URL caption over the scrim band. Hairline
          on phone only; on desktop a rule across the art would be noise. */}
      <footer className="relative px-6 pb-8 sm:px-10 lg:px-az-6 lg:pb-az-4 xl:px-az-7">
        <Hairline surface="dark" className="lg:hidden" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:mt-0">
          <span className="az-caption uppercase text-white/80">
            Forward · Human always
          </span>
          {/* white/75, not /60 — /60 measured 4.4:1 worst-case on the phone
              floor band, a hair under AA for caption-size text. */}
          <span className="az-caption uppercase text-white/75">azmx.sa</span>
          {/* No ThemeToggle here: the landing is art-directed photography and
              looks identical in both themes, which read as "broken" to the
              client. Theme control lives on the themed in-flow pages. */}
        </div>
      </footer>
    </main>
  );
}
