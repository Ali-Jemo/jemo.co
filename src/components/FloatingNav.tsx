"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  label: string;
}

export default function FloatingNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
      const scrollY = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActive(i);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
        >
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-3 justify-end"
            >
              <span className="text-xs font-mono text-[var(--ink-2)] opacity-0 group-hover:opacity-100 transition-opacity">
                {s.label}
              </span>
              <span className="relative flex items-center justify-center w-3 h-3">
                {i === active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute inset-0 rounded-full bg-[var(--brand)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`w-1.5 h-1.5 rounded-full ${i === active ? "bg-[var(--brand)]" : "bg-[var(--ink-2)]/30 group-hover:bg-[var(--ink-2)]/60"} transition-colors`} />
              </span>
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
