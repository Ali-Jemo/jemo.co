"use client";

import { useState } from "react";
import { contactEmail } from "@/lib/site";

export default function ContactForm() {
  const inbox = contactEmail();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "تعذر إرسال الرسالة");
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("تعذر الاتصال بالخادم");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <h2 className="text-xl font-bold text-[var(--ink-1)]">أرسل رسالة</h2>
      <p className="text-sm text-[var(--ink-2)] leading-relaxed">
        تصل الرسالة إلى {inbox}. إن تعذر الإرسال الآلي، راسل هذا العنوان مباشرة.
      </p>
      <label className="block space-y-1 text-sm">
        <span className="text-[var(--ink-2)]">الاسم</span>
        <input
          required
          minLength={2}
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-[var(--ink-2)]">بريدك</span>
        <input
          required
          type="email"
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm"
          dir="ltr"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-[var(--ink-2)]">الرسالة</span>
        <textarea
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-[#222f30] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60"
      >
        {status === "sending" ? "جارٍ الإرسال..." : "إرسال"}
      </button>
      {status === "sent" ? <p className="text-sm text-[#728825]">وصلت الرسالة.</p> : null}
      {status === "error" ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
