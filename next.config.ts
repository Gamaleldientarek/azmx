import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public URL contract: games.gamaleldien.com/random-selector
  // The Cloudflare Worker redirects the bare domain into this basePath.
  basePath: "/random-selector",
};

export default nextConfig;
