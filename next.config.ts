import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public URL contract: games.gamaleldien.com/random-selector
  // The Cloudflare Worker redirects the bare domain into this basePath.
  basePath: "/random-selector",
  experimental: {
    serverActions: {
      // The app is served through the Cloudflare Worker proxy: browsers POST
      // with Origin=games.gamaleldien.com while Vercel sees its own host.
      // Without this, Next's CSRF check aborts every server action ("Invalid
      // Server Actions request").
      allowedOrigins: ["games.gamaleldien.com"],
    },
  },
};

export default nextConfig;
