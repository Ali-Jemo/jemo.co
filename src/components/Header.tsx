"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/#innovations", label: "دليل المخرجات" },
  { href: "/about", label: "من نحن" },
  { href: "/gallery", label: "الأعمال" },
  { href: "/applications", label: "القبولات" },
  { href: "/#faq", label: "الأسئلة" },
];

const APPLY_LINK = { href: "/apply", label: "Join" };
const HEADER_OFFSET = 96;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getSectionId(href: string) {
  if (!href.startsWith("/#")) return null;
  return href.slice(2) || null;
}

export default function Header() {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "/";

  const headerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  const lastY = useRef(0);
  const ticking = useRef(false);
  const desktopQuery = useRef<MediaQueryList | null>(null);
  const reducedMotionQuery = useRef<MediaQueryList | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const reactId = useId();
  const menuId = `mobile-menu-${reactId.replace(/:/g, "")}`;

  const isDesktop = useCallback(() => desktopQuery.current?.matches ?? true, []);
  const prefersReducedMotion = useCallback(
    () => reducedMotionQuery.current?.matches ?? false,
    []
  );

  const closeMenu = useCallback((focusToggle = false) => {
    setMenuOpen(false);
    if (focusToggle) toggleRef.current?.focus();
  }, []);

  const scrollToId = useCallback(
    (id: string, pushHash = true) => {
      const element = document.getElementById(id);
      if (!element) return false;

      element.style.scrollMarginTop = `${HEADER_OFFSET}px`;
      element.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });

      if (pushHash && window.location.hash !== `#${id}`) {
        window.history.pushState(null, "", `#${id}`);
      }

      return true;
    },
    [prefersReducedMotion]
  );

  const handleNavClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const shouldDelayScroll = menuOpen && !prefersReducedMotion();
      closeMenu();

      if (href === "/" && pathname === "/") {
        event.preventDefault();

        window.setTimeout(
          () => {
            window.scrollTo({
              top: 0,
              behavior: prefersReducedMotion() ? "auto" : "smooth",
            });
          },
          shouldDelayScroll ? 180 : 0
        );

        setActiveHash(null);

        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }

        return;
      }

      const id = getSectionId(href);
      if (!id || pathname !== "/") return;

      event.preventDefault();

      window.setTimeout(
        () => {
          if (scrollToId(id)) setActiveHash(id);
        },
        shouldDelayScroll ? 180 : 0
      );
    },
    [menuOpen, pathname, closeMenu, scrollToId, prefersReducedMotion]
  );

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    desktopQuery.current = desktop;
    reducedMotionQuery.current = reduced;
    setReducedMotion(reduced.matches);

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
      setVisible(true);
      lastY.current = window.scrollY;
    };

    const handleReducedChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) setVisible(true);
    };

    desktop.addEventListener("change", handleDesktopChange);
    reduced.addEventListener("change", handleReducedChange);

    return () => {
      desktop.removeEventListener("change", handleDesktopChange);
      reduced.removeEventListener("change", handleReducedChange);
    };
  }, [closeMenu]);

  useEffect(() => {
    closeMenu();
    if (!window.location.hash) setActiveHash(null);
  }, [pathname, closeMenu]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    let cancelled = false;
    let attempts = 0;

    const timer = window.setInterval(() => {
      if (cancelled) return;

      const element = document.getElementById(hash);
      if (element) {
        scrollToId(hash, false);
        setActiveHash(hash);
        window.clearInterval(timer);
        return;
      }

      attempts += 1;
      if (attempts > 15) window.clearInterval(timer);
    }, 80);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [pathname, scrollToId]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) {
        setActiveHash(null);
        return;
      }

      if (scrollToId(hash, false)) setActiveHash(hash);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [scrollToId]);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      const focusInsideHeader =
        headerRef.current?.contains(document.activeElement) ?? false;

      if (!isDesktop() || prefersReducedMotion() || menuOpen || focusInsideHeader) {
        setVisible(true);
      } else if (y < 24) {
        setVisible(true);
      } else if (delta > 14 && y > 90) {
        setVisible(false);
      } else if (delta < -10) {
        setVisible(true);
      }

      if (y < 24 && pathname === "/") {
        setActiveHash((prev) => (prev ? null : prev));
      }

      lastY.current = y;
      setScrolled(y > 12);
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen, pathname, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = NAV_ITEMS.map((item) => getSectionId(item.href)).filter(
      Boolean
    ) as string[];

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) setActiveHash(current.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingInlineEnd;

    document.body.style.overflow = "hidden";

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingInlineEnd = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab" || !headerRef.current) return;

      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(
          'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const focusTimer = window.setTimeout(() => {
      mobileNavRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 60);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingInlineEnd = originalPadding;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.clearTimeout(focusTimer);
    };
  }, [menuOpen, closeMenu]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/" && !activeHash;

      const id = getSectionId(href);
      if (id) return pathname === "/" && activeHash === id;

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname, activeHash]
  );

  const solidBar = scrolled || menuOpen;

  return (
    <>
      <a
        href="#main"
        onClick={(event) => {
          const main = document.getElementById("main");
          if (!main) return;

          event.preventDefault();

          if (!main.hasAttribute("tabindex")) {
            main.setAttribute("tabindex", "-1");
          }

          main.style.scrollMarginTop = `${HEADER_OFFSET}px`;
          main.focus({ preventScroll: true });
          main.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
      >
        تخطي إلى المحتوى
      </a>

      <header
        ref={headerRef}
        onFocusCapture={() => setVisible(true)}
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 will-change-transform"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: reducedMotion ? "none" : undefined,
        }}
      >
        <div
          className={cx(
            "mx-auto flex items-center justify-between gap-4 px-5 py-3 sm:px-6",
            scrolled && "shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
          )}
          style={{
            maxWidth: "var(--maxw)",
            background: solidBar ? "rgba(10, 10, 10, 0.92)" : "transparent",
            backdropFilter: solidBar ? "blur(10px)" : "none",
            WebkitBackdropFilter: solidBar ? "blur(10px)" : "none",
            borderBottom: solidBar
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid transparent",
            transition: reducedMotion
              ? "none"
              : "background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          }}
        >
          <Link
            href="/"
            onClick={(event) => handleNavClick(event, "/")}
            aria-label="jemo labs — الرئيسية"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/90"
          >
            <div className="flex items-center gap-2 text-xl font-bold font-kufi">
              <span className="text-gradient">jemo</span>
              <span className="font-mono text-white/80">labs</span>
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "var(--brand)" }}
              />
            </div>
          </Link>

          <nav aria-label="التنقل الرئيسي" className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-6 space-x-0">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild active={active}>
                        <Link
                          href={item.href}
                          onClick={(event) => handleNavClick(event, item.href)}
                          aria-current={active ? "page" : undefined}
                          data-active={active || undefined}
                          className={cx(
                            "relative rounded-sm pb-1 text-sm transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/90",
                            "after:absolute after:-bottom-0.5 after:right-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:rounded-full after:bg-[var(--brand)] after:content-[''] after:transition-transform after:duration-300",
                            "hover:after:scale-x-100 data-[active]:after:scale-x-100"
                          )}
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: active ? "var(--brand)" : "var(--ink-2)",
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={APPLY_LINK.href}
              className="btn btn--outline btn--sm hidden md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/90"
            >
              <span className="mono text-xs">{APPLY_LINK.label}</span>
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-md border border-white/25 bg-black/70 p-2 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/90 md:hidden"
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          id={menuId}
          ref={mobileNavRef}
          className="overflow-hidden md:hidden"
          style={{
            maxHeight: menuOpen ? "min(75vh, 560px)" : 0,
            opacity: menuOpen ? 1 : 0,
            visibility: menuOpen ? "visible" : "hidden",
            transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
            overflowY: menuOpen ? "auto" : "hidden",
            background: "rgba(10, 10, 10, 0.82)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
            transition: reducedMotion
              ? "none"
              : menuOpen
                ? "max-height 0.32s ease, opacity 0.24s ease, transform 0.24s ease, visibility 0s linear 0s"
                : "max-height 0.32s ease, opacity 0.24s ease, transform 0.24s ease, visibility 0s linear 0.32s",
          }}
        >
          <nav aria-label="قائمة الجوال" className="px-5 py-4 sm:px-6">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item.href)}
                      aria-current={active ? "page" : undefined}
                      tabIndex={menuOpen ? 0 : -1}
                      className={cx(
                        "block rounded-lg border border-transparent px-3 py-3 text-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
                        active
                          ? "border-white/10 bg-white/5"
                          : "hover:bg-white/5"
                      )}
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: active ? "var(--brand)" : "var(--ink-2)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href={APPLY_LINK.href}
              onClick={() => closeMenu()}
              tabIndex={menuOpen ? 0 : -1}
              className="btn btn--outline btn--sm mt-4 w-full justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <span className="mono text-xs">{APPLY_LINK.label}</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
