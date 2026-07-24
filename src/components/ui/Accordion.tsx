"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`acc-container flex flex-col gap-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="acc-item border border-[var(--line)] bg-[var(--surface)] rounded-xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-5 text-right font-semibold text-lg hover:bg-[var(--surface-hover)] transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-[var(--ink-1)]">{item.title}</span>
              <ChevronDown
                className={`w-5 h-5 text-[var(--ink-2)] transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[var(--brand)]" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="p-5 pt-0 text-[var(--ink-2)] leading-relaxed border-t border-[var(--line)]/50">
                    {item.children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
