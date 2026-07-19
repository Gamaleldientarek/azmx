import type { Metadata } from "next";
import { thmanyah, azmx } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sharing Tuesday",
  description: "Join the session, get your name, and let the wheel decide who shares first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${thmanyah.variable} ${azmx.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
