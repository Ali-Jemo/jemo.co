"use client";

import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";

/**
 * Per-page canonical. Rendered during SSR for each route (usePathname is the
 * page being generated) and hoisted into <head> by React 19. This stays static:
 * reading headers() in the root layout would opt every page into the Worker.
 */
export default function CanonicalLink() {
  const pathname = usePathname() || "/";
  const path = pathname === "/" ? "" : pathname;
  const href = `${SITE_URL}${path}`;
  return (
    <>
      <link rel="canonical" href={href} />
      <meta property="og:url" content={href} />
    </>
  );
}
