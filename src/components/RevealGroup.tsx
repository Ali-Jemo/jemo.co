"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Cohere-style staggered scroll reveal, adapted for RTL.
 *
 * Wrap a group of cards; each descendant marked with `data-cohere-item`
 * fades in (fadeInUp 0.5s ease-in-out) with a staggered delay set
 * per item via the `cohereItemDelay` helper, triggered once when the
 * group scrolls into view. Pure CSS animation — this component only
 * flips a data attribute via IntersectionObserver (same approach as
 * cohere.com). Pair cards with the `cohere-arrow` class for the hover
 * arrow-wiggle.
 */
export default function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-revealed", "true");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        }
      },
      // threshold 0 + bottom rootMargin: fires as soon as any part of the
      // group crosses ~88% of the viewport height. (A coverage threshold
      // like 0.15 silently never fires for tall mobile grids.)
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-cohere-reveal="" className={className}>
      {children}
    </div>
  );
}

/**
 * Inline style for a revealed item: `style={cohereDelay(2)}` → 200ms.
 * Takes milliseconds so callers can do Cohere's per-element cascade
 * (e.g. card at i*100ms, its inner elements at +50/100/150ms).
 */
export function cohereDelay(ms: number): CSSProperties {
  return { "--cohere-delay": `${ms}ms` } as CSSProperties;
}

/** Card-level stagger: `cohereItemDelay(2)` → 200ms (100ms per card). */
export function cohereItemDelay(index: number): CSSProperties {
  return cohereDelay(index * 100);
}
