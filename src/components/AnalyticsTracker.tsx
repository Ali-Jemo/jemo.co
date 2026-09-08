"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ponytail: sendBeacon is non-blocking and off-main-thread; keeps navigation fast
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    if (typeof window !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", payload);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => null);
    }
  }, [pathname]);

  return null;
}
