import type { NextConfig } from "next";
import { cspHeader, securityHeaders } from "./src/lib/security-headers";

// CSP and all other security headers live in src/lib/security-headers.ts —
// the single copy shared with src/proxy.ts so the two can never drift.

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image).*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          ...Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/transparency",
        destination: "/newsletter",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/sign-in",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/sign-up",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
