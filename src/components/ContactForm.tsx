"use client";

import { useId, useState } from "react";
import { contactEmail } from "@/lib/site";

export default function ContactForm() {
  const inbox = contactEmail();
  const baseId = useId();
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

  const fieldClass =
    "w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-base text-[var(--ink-1)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <h2 className="text-xl font-bold text-[var(--ink-1)]">أرسل رسالة</h2>
      <p className="text-sm text-[var(--ink-2)] leading-relaxed">
        تصل الرسالة إلى{" "}
        <a href={`mailto:${inbox}`} className="font-bold text-[var(--ink-1)] underline underline-offset-4" dir="ltr">
          {inbox}
        </a>
        . إن تعذر الإرسال الآلي، راسل هذا العنوان مباشرة.
      </p>
      <div className="block space-y-1 text-sm">
        <label htmlFor={`${baseId}-name`} className="text-[var(--ink-2)]">الاسم</label>
        <input
          id={`${baseId}-name`}
          name="name"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={status === "error"}
          className={fieldClass}
        />
      </div>
      <div className="block space-y-1 text-sm">
        <label htmlFor={`${baseId}-email`} className="text-[var(--ink-2)]">بريدك</label>
        <input
          id={`${baseId}-email`}
          name="email"
          required
          type="email"
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === "error"}
          className={`${fieldClass} text-left`}
          dir="ltr"
        />
      </div>
      <div className="block space-y-1 text-sm">
        <label htmlFor={`${baseId}-message`} className="text-[var(--ink-2)]">الرسالة</label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={status === "error"}
          className={fieldClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="inline-flex min-h-11 items-center rounded-full bg-[#222f30] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60"
      >
        {status === "sending" ? "جارٍ الإرسال..." : "إرسال"}
      </button>
      {status === "sent" ? <p role="status" className="text-sm text-[#3f5456]">وصلت الرسالة.</p> : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-800">
          {error}{" "}
          <a href={`mailto:${inbox}`} className="font-bold underline underline-offset-4">
            راسل {inbox}
          </a>
        </p>
      ) : null}
    </form>
  );
}
