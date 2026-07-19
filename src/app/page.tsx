import Link from "next/link";
import Image from "next/image";
import cover from "../../public/sharing-tuesday-cover.jpg";
import {
  AzmxLogo,
  Button,
  Chevron,
  Hairline,
} from "@/components/brand";

/**
 * Landing — the official cover art IS the page (client direction).
 *
 * The full red cover bleeds edge to edge at every breakpoint; the baked-in
 * serif "Sharing Tuesday" title and AZMX mark are the hero and the brand
 * attribution, so no live headline or wordmark duplicates them on desktop.
 * Live type is reduced to what the page functionally needs — a one-line lead
 * and the two CTAs — placed in the calm dark-red wall band below the baked
 * title (measured 11:1+ against white). The desktop footer keeps to the
 * bottom-right table front, clear of the baked logo in the bottom-left.
 *
 * Contrast decisions (measured on the source pixels):
 * - White type on the calm zones: 11–14:1 (AA/AAA). No scrim behind the lead
 *   or desktop CTAs.
 * - Electric #001aff on this red is 1.4–2.2:1 — no boundary contrast, pure
 *   chroma vibration — so the ONE hot CTA is a white block with a Navy label
 *   (Electric survives as the chevron punctuation on white, 8:1).
 * - The bottom band's lit table edge dips to ~3.2:1, so a localized
 *   gradient-to-dark sits under the footer strip (and under the stacked CTAs
 *   on phone) only — never a full-page wash.
 *
 * Phone (portrait) crops the 16:9 art to the still life (object-position
 * 60%), which pushes the baked title out of frame — so a compact live serif
 * wordmark returns at the top on phone/tablet only (it doubles as the h1;
 * from lg up the h1 is visually replaced by the baked title and goes sr-only).
 * Landing stays fixed-dark (exempt from theming).
 */
export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col bg-navy text-white">
      {/* Full-bleed cover art. Portrait crops center on the still life;
          landscape crops bias to the inline-start so the baked title stays
          in frame. */}
      <div className="absolute inset-0">
        <Image
          src={cover}
          alt="Official Sharing Tuesday cover — the serif title and AZMX mark over a deep red still life of pinned notes, stacked blocks, and a monstera plant"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[60%_50%] select-none lg:object-[15%_50%]"
        />
        {/* Localized legibility gradient: a short bottom band only, red-black
            so the image darkens instead of graying out. It exists for the
            footer strip, whose lit table edge dips to ~3.1:1 bare — the hero
            block never relies on it. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[24svh] bg-[linear-gradient(to_top,rgba(20,2,6,0.66),rgba(20,2,6,0.24)_60%,transparent)]"
        />
      </div>

      {/* Compact live wordmark — phone/tablet only, where the portrait crop
          loses the baked title. From lg the baked title is the hero and this
          collapses to the page's sr-only h1. */}
      <header className="relative px-6 pt-8 sm:px-10 lg:p-0">
        <h1 className="font-display text-[2rem] leading-none tracking-[-0.01em] text-white lg:sr-only">
          Sharing Tuesday
        </h1>
      </header>

      {/* The functional core: one-line lead + the two CTAs. Below lg the
          portrait crop's only calm zone is the dark upper wall (15:1+
          measured; the mid band holds the white pinned notes), so the block
          anchors under the wordmark and leaves the still life unobstructed.
          From lg it drops to the calm wall band below the baked title;
          10svh bottom padding keeps it above the baked AZMX mark across
          viewport heights. */}
      <div className="relative flex flex-1 flex-col justify-start px-6 pt-8 sm:px-10 lg:justify-end lg:px-az-6 lg:pb-[10svh] lg:pt-0 xl:px-az-7">
        <div className="max-w-xl">
          <p className="az-lead text-white">
            Everyone shares. The order is fair.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* The one hot CTA — white block, Navy label. Electric-on-red
                measured 1.75:1 (vibration, no edge), so Electric appears only
                as the chevron punctuation on the white block. */}
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
      </div>

      {/* Footer strip. Phone: full hairline strip with the live AZMX mark
          (the baked one is out of the portrait crop). Desktop: quiet
          end-aligned row over the table front, clear of the baked mark in
          the bottom-left — no duplicate logo, no hairline across the art. */}
      <footer className="relative px-6 pb-8 sm:px-10 lg:px-az-6 lg:pb-az-4 xl:px-az-7">
        <Hairline surface="dark" className="lg:hidden" />
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-0 lg:justify-end">
          <AzmxLogo variant="white" height={22} className="lg:hidden" />
          <span className="az-caption uppercase text-white/75">
            Forward · Human always
          </span>
          {/* No ThemeToggle here: the landing is art-directed photography and
              looks identical in both themes, which read as "broken" to the
              client. Theme control lives on the themed in-flow pages. */}
        </div>
      </footer>
    </main>
  );
}
