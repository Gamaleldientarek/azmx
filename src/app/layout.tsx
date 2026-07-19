import type { Metadata } from "next";
import { thmanyah, azmx } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sharing Tuesday",
  description: "Join the session, get your name, and let the wheel decide who shares first.",
};

/**
 * Theme bootstrap — runs before first paint (parser-blocking, first in body)
 * so there is no flash of the wrong theme. Resolves auto/light/dark:
 * `st-theme` in localStorage ("light" | "dark") overrides the device;
 * absent = auto = follow `prefers-color-scheme`.
 *
 * - data-theme       = resolved theme ("light" | "dark") — all CSS keys off this
 * - data-theme-mode  = the user's preference ("auto" | "light" | "dark")
 */
const themeInitScript = `(function(){try{var m="auto",s=localStorage.getItem("st-theme");if(s==="light"||s==="dark")m=s;var d=m==="auto"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):m;var r=document.documentElement;r.setAttribute("data-theme",d);r.setAttribute("data-theme-mode",m);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${thmanyah.variable} ${azmx.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
