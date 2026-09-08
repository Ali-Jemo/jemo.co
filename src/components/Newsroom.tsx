"use client";

import { useState } from "react";

const publications = [
  {
    id: 1,
    title: "Deep learning–enabled discovery of antibiotics effective against Neisseria gonorrhoeae",
    journal: "Science Translational Medicine",
    date: "August 6, 2026",
    excerpt:
      "In this landmark publication, we unveil our first-of-a-kind optogenetic screening platform, which unlocks a novel mode of drug discovery by enabling tunable, millisecond- and micron-level control over previously intractable biological systems.",
    url: "https://www.science.org/doi/abs/10.1126/scitranslmed.ads4699",
    badge: "Publication",
  },
  {
    id: 2,
    title: "Optimizing information transmission in optogenetic Wnt signaling",
    journal: "APS Research",
    date: "March 18, 2026",
    excerpt:
      "Research on optogenetic control of Wnt signaling pathways, demonstrating precise temporal and spatial regulation of biological processes.",
    url: "https://journals.aps.org/prresearch/abstract/10.1103/f7qj-f7qy",
    badge: "Publication",
  },
  {
    id: 3,
    title: "FATE-MAP predicts teratogenicity and human gastrulation failure modes",
    journal: "Nature",
    date: "February 20, 2026",
    excerpt:
      "Integrating deep learning and mechanistic modeling to predict teratogenicity and human gastrulation failure modes, advancing the understanding of early developmental biology.",
    url: "https://www.nature.com/articles/s41467-026-69596-6",
    badge: "Publication",
  },
];

export default function Newsroom() {
  const [view, setView] = useState("grid");

  return (
    <section className="py-24 md:py-32 bg-white/5 relative overflow-x-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-2" d="M12 2v7l5 5" />
            </svg>
            أحدث المنشورات
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((pub) => (
            <article
              key={pub.id}
              className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors group"
            >
              <div className="h-24 rounded-xl overflow-hidden mb-4">
                <svg
                  className="w-full h-full object-cover"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="stroke-2"
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.57l-5.06-3.21L2 14.1l6.95-1.02L12 2z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {pub.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                <span className="badge badge--small">{pub.badge}</span>
                <time dateTime={pub.date}>{pub.date}</time>
              </div>

              <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                {pub.excerpt}
              </p>

              <div className="mt-3">
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#bef264] font-medium hover:underline transition-colors"
                >
                  قراءة المقال
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View toggle */}
        <div className="mt-8 flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-2 rounded-full border ${
              view === "grid" ? "border-[#bef264] text-[#bef264]" : "text-white/60 border-transparent"
            } transition-colors`}
          >
            شبكة
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-full border ${
              view !== "grid" ? "border-[#bef264] text-[#bef264]" : "text-white/60 border-transparent"
            } transition-colors`}
          >
            قائمة
          </button>
        </div>
      </div>
    </section>
  );
}