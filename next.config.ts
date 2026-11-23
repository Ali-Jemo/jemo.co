import type { NextConfig } from "next";
import { publicRedirects } from "./src/lib/public-redirects";

// Security headers are applied once, in src/proxy.ts. Setting them here as
// well duplicated every header on the response (and again if Cloudflare's
// dashboard adds the same names).

const nextConfig: NextConfig = {
  images: {
    // The Cloudflare Worker does not run Next's image optimizer: /_next/image
    // returned the original bytes. Serve pre-compressed files directly.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      ...publicRedirects,
      {
        source: "/opengraph-image",
        destination: "/opengraph-image.png",
        permanent: false,
      },
      {
        source: "/twitter-image",
        destination: "/twitter-image.png",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
