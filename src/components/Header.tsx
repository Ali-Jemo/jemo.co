"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import HybridWordmark from "@/components/HybridWordmark";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setHidden(y > lastY.current && y > 80 && !mobileMenuOpen);
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/gallery", label: "الأعمال" },
    { href: "/applications", label: "القبولات" },
    { href: "/#divisions", label: "الأقسام" },
    { href: "/#about", label: "من نحن" },
    { href: "/#contact", label: "تواصل" },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className={`mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between transition-colors duration-300 ${scrolled || mobileMenuOpen ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
        <Link href="/" className="text-2xl font-bold font-outfit font-decoy hover:text-olive transition-colors duration-300">
          <HybridWordmark className="text-2xl font-bold hover:text-olive transition-colors duration-300" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all ${isActive ? "text-olive font-semibold" : "hover:text-olive hover:drop-shadow-[0_0_8px_rgba(107,123,58,0.6)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-off hover:text-olive p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="القائمة"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-3 text-base font-medium shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors border-b border-white/5 ${isActive ? "text-olive font-semibold" : "text-off hover:text-olive"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
