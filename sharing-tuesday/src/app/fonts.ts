import localFont from "next/font/local";

/**
 * AZMX brand fonts, self-hosted (woff2) from /public/fonts.
 * Serif = personality (titles, stats, brand numerals).
 * Sans  = information (body, labels, UI). Azm X Variable supports EN + Arabic.
 */

export const thmanyah = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/thmanyahserifdisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/thmanyahserifdisplay-Black.woff2", weight: "900", style: "normal" },
  ],
});

export const azmx = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../../public/fonts/AzmX-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../public/fonts/AzmX-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../../public/fonts/AzmX-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/AzmX-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/AzmX-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/AzmX-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/AzmX-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/AzmX-Heavy.woff2", weight: "900", style: "normal" },
  ],
});
