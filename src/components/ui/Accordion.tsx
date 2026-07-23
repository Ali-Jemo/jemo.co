"use client";

import React, { useState, useCallback } from "react";

export interface FAQItem {
  question?: string;
  answer?: React.ReactNode;
  q?: string;
  a?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

interface AccordionProps {
  items: FAQItem[];
  searchTerm?: string;
}

export default function Accordion({ items, searchTerm }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setOpen((prev) => (prev === i ? null : i));
  }, []);

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;
    const q = String(item.question || item.q || item.title || "");
    const a = typeof item.answer === "string" ? item.answer : typeof item.a === "string" ? item.a : typeof item.children === "string" ? item.children : "";
    return q.includes(searchTerm) || a.includes(searchTerm);
  });

  if (filteredItems.length === 0) {
    return <div className="text-center text-white/60 py-6">لا توجد نتائج طابقت بحثك</div>;
  }

  return (
    <div className="accordion" role="list">
      {filteredItems.map((item, i) => {
        const questionText = item.question || item.q || item.title;
        const answerContent = item.answer || item.a || item.children;

        return (
          <div
            key={i}
            className="acc-item"
            data-open={open === i ? "true" : "false"}
            role="listitem"
          >
            <button
              type="button"
              className="acc-trigger"
              onClick={() => toggle(i)}
              aria-expanded={open === i}
            >
              <span>{questionText}</span>
              <svg
                className="acc-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div className="acc-panel" role="region">
              <div>
                {typeof answerContent === "string" ? (
                  <p>{answerContent}</p>
                ) : (
                  answerContent
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
