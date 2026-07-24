"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, FolderGit2, ShieldCheck, Atom } from "lucide-react";
import Button from "@/components/ui/Button";
import { ABOUT_INFO } from "@/lib/data/research-data";

// ponytail: extracted as the only client island on an otherwise server-rendered homepage.
// Keeps framer-motion JS off the critical path for 90% of the page.
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[var(--bg)] border-b border-[var(--line)]">
      {/* decorative gradient orbs */}
      <div className="orb orb-1 animate-float-1" />
      <div className="orb orb-2 animate-float-2" />
      <div className="orb orb-3 animate-float-3" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-mono"
          >
            <Atom className="w-4 h-4" />
            <span>بيت الحكمة الرقمي — JEMO LABS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ink-1)] leading-tight"
          >
            المعرفة المفتوحة <br />
            <span className="text-gradient">والأبحاث الرقمية السيادية</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--ink-2)] leading-relaxed max-w-3xl mx-auto"
          >
            {ABOUT_INFO.coreQuote}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link href="/research">
              <Button variant="primary" size="lg" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span>الأوراق البحثية</span>
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2">
                <FolderGit2 className="w-4 h-4" />
                <span>المشاريع المفتوحة</span>
              </Button>
            </Link>
            <Link href="/transparency">
              <Button variant="ghost" size="lg" className="gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>تقرير الشفافية</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
