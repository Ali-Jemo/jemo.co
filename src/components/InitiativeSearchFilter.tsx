"use client";

import { useState, useMemo } from "react";
import { Initiative } from "@/lib/data/research-data";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Search, Filter, Sparkles, ArrowUpLeft, Users, Target } from "lucide-react";

const STATUSES = ["Research", "Active", "Scaling", "Completed"];

interface InitiativeSearchFilterProps {
  initiatives: Initiative[];
}

export default function InitiativeSearchFilter({ initiatives }: InitiativeSearchFilterProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return initiatives.filter((init) => {
      const matchesQuery =
        query.trim() === "" ||
        init.title.toLowerCase().includes(query.toLowerCase()) ||
        init.description.toLowerCase().includes(query.toLowerCase()) ||
        init.vision.toLowerCase().includes(query.toLowerCase()) ||
        init.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = statusFilter === "all" || init.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [initiatives, query, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <Card className="p-6 space-y-4 border-2 border-[var(--brand)]/20">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-2)]" />
            <input
              type="text"
              placeholder="ابحث في المبادرات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-1)] text-sm font-mono placeholder:text-[var(--ink-2)] focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[var(--ink-2)]" />
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  statusFilter === s
                    ? "bg-[var(--brand)] text-white"
                    : "bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--brand)]"
                }`}
              >
                {s}
              </button>
            ))}
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="px-3 py-1.5 rounded-full text-xs font-mono text-[var(--brand)] hover:underline"
              >
                الكل
              </button>
            )}
          </div>
        </div>
        <div className="text-xs font-mono text-[var(--ink-2)]">
          <span className="text-[var(--brand)] font-bold">{filtered.length}</span>{" "}
          مبادرة{filtered.length !== 1 ? "ات" : ""}
        </div>
      </Card>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((init, i) => (
            <motion.div
              key={init.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card hover className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                      {init.status}
                    </span>
                    <span className="text-xs font-mono text-[var(--ink-2)]">
                      نسبة الإنجاز: {init.progress}%
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                    <Link href={`/initiatives/${init.slug}`}>{init.title}</Link>
                  </h2>

                  <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4">
                    {init.description}
                  </p>

                  <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden border border-[var(--line)] mb-6">
                    <div
                      className="bg-[var(--brand)] h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${init.progress}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <div className="text-xs font-mono text-[var(--ink-2)] flex items-center gap-1">
                      <Target className="w-3 h-3" /> المخرجات:
                    </div>
                    {init.deliverables.slice(0, 2).map((d) => (
                      <div key={d} className="text-xs text-[var(--ink-1)] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                        {d}
                      </div>
                    ))}
                    {init.deliverables.length > 2 && (
                      <div className="text-xs text-[var(--ink-2)]">+{init.deliverables.length - 2} أخرى</div>
                    )}
                  </div>

                  {init.tags && init.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {init.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--ink-2)] font-mono">
                    <Users className="w-3 h-3" />
                    <span>مسؤول: </span>
                    <span className="font-bold text-[var(--ink-1)]">{init.lead}</span>
                  </div>
                  <Link
                    href={`/initiatives/${init.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                  >
                    <span>التفاصيل</span>
                    <ArrowUpLeft className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--ink-2)]">
          <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="font-mono">لا توجد مبادرات تطابق بحثك</p>
        </div>
      )}
    </div>
  );
}
