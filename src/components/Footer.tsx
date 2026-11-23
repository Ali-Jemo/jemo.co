"use client";

import { useState } from "react";
import Link from "next/link";
import { contactEmail, socialLinks, type SocialLink } from "@/lib/site";
import { GithubIcon, TelegramIcon, XIcon } from "@/components/Icons";

const LINKS = [
  { label: "السجلات", href: "/research" },
  { label: "انشر", href: "/publish" },
  { label: "المشاريع", href: "/projects" },
  { label: "عن JEMO", href: "/about" },
  { label: "تواصل", href: "/contact" },
  { label: "الشروط", href: "/terms" },
  { label: "الخصوصية", href: "/privacy" },
];

const ICONS: Record<string, typeof GithubIcon> = {
  telegram: TelegramIcon,
  github: GithubIcon,
  x: XIcon,
};

function iconFor(link: SocialLink) {
  return ICONS[link.id] ?? GithubIcon;
}

export default function Footer() {
  const inbox = contactEmail();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = email.trim();
    if (!clean) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, topics: ["سجلات جديدة"] }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "تعذر الحفظ الآن");
      setStatus("done");
      setMessage("تم تسجيل بريدك. تصلك السجلات الجديدة بلا إعلانات.");
    } catch (err: unknown) {
      setStatus("error");
      const reason = err instanceof Error ? err.message : "تعذر الحفظ الآن";
      setMessage(`${reason}. راسلنا على ${inbox}`);
    }
  }

  return (
    <footer id="newsletter" dir="rtl" className="mt-auto border-t border-[#e4e3e3] bg-[#f7f7f5] px-4 py-10 pb-24 text-[#1c2829] sm:px-8 md:pb-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-sm leading-7">JEMO — سجلّ عربي لتوثيق الأبحاث المنجزة بمساعدة الذكاء الاصطناعي.</p>
        <nav aria-label="روابط التذييل" className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="underline decoration-[#1c2829]/25 underline-offset-4 hover:decoration-[#1c2829]">
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSubmit} className="space-y-2">
          <label htmlFor="footer-email" className="block text-sm leading-7">
            تصلك السجلات الجديدة بالبريد — بلا إعلانات.
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="footer-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              dir="ltr"
              className="min-h-11 w-full rounded-xl border border-[#c9cdc6] bg-white px-3 text-sm text-[#1c2829] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2829]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-11 rounded-xl bg-[#1c2829] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {status === "loading" ? "جارٍ الإرسال" : "اشترك"}
            </button>
          </div>
          {message ? <p className="text-sm leading-7">{message}</p> : null}
        </form>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href={`mailto:${inbox}`} className="font-bold underline underline-offset-4">
            {inbox}
          </a>
          {socialLinks().map((link) => {
            const Icon = iconFor(link);
            return (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="inline-flex min-h-11 min-w-11 items-center justify-center">
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
        <p className="text-sm text-[#334244]">© 2026 JEMO</p>
      </div>
    </footer>
  );
}
