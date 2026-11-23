"use client";

import { FormEvent, useId, useState } from "react";

const ADDRESS = "contact@jemo.dev";

interface Fields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

function mailtoHref(fields: Fields) {
  const subject = `[JEMO Labs] ${fields.subject.trim()} — ${fields.name.trim()}`;
  const body = [
    `الاسم: ${fields.name.trim()}`,
    `البريد: ${fields.email.trim()}`,
    "",
    fields.message.trim(),
  ].join("\n");
  return `mailto:${ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactForm() {
  const baseId = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [opened, setOpened] = useState(false);

  const set = (key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setOpened(false);
  };

  const validate = (next: Fields) => {
    const found: Partial<Record<keyof Fields, string>> = {};
    if (next.name.trim().length < 2) found.name = "اكتب اسمك.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email.trim())) found.email = "اكتب بريداً صالحاً.";
    if (next.subject.trim().length < 3) found.subject = "اكتب موضوع الرسالة.";
    if (next.message.trim().length < 10) found.message = "اكتب رسالة أوضح (عشر خانات على الأقل).";
    return found;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const first = (Object.keys(found) as Array<keyof Fields>)[0];
    if (first) {
      document.getElementById(`${baseId}-${first}`)?.focus();
      return;
    }
    window.location.href = mailtoHref(fields);
    setOpened(true);
  };

  const fieldClass = (invalid: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-base text-[#222f30] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30] ${
      invalid ? "border-red-700" : "border-[#d5d8d4]"
    }`;

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8 shadow-xs space-y-5" noValidate>
      <div>
        <h2 className="text-2xl font-bold text-[#222f30]">راسلنا</h2>
        <p className="mt-2 text-sm text-[#3f5456] leading-relaxed">
          النموذج يفتح بريدك برسالة جاهزة إلى{" "}
          <a href={`mailto:${ADDRESS}`} className="font-mono font-bold text-[#222f30] underline underline-offset-4" dir="ltr">
            {ADDRESS}
          </a>
          . لا يُحفظ شيء على الخادم.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          راجع الحقول المظللة قبل الإرسال.
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor={`${baseId}-name`} className="text-sm font-bold text-[#222f30]">الاسم</label>
        <input
          id={`${baseId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={fields.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
          onChange={(event) => set("name", event.target.value)}
          className={fieldClass(Boolean(errors.name))}
        />
        {errors.name && <p id={`${baseId}-name-error`} className="text-sm text-red-800">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${baseId}-email`} className="text-sm font-bold text-[#222f30]">بريدك</label>
        <input
          id={`${baseId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          dir="ltr"
          value={fields.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${baseId}-email-error` : undefined}
          onChange={(event) => set("email", event.target.value)}
          className={`${fieldClass(Boolean(errors.email))} text-left`}
        />
        {errors.email && <p id={`${baseId}-email-error`} className="text-sm text-red-800">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${baseId}-subject`} className="text-sm font-bold text-[#222f30]">الموضوع</label>
        <input
          id={`${baseId}-subject`}
          name="subject"
          type="text"
          required
          value={fields.subject}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? `${baseId}-subject-error` : undefined}
          onChange={(event) => set("subject", event.target.value)}
          className={fieldClass(Boolean(errors.subject))}
        />
        {errors.subject && <p id={`${baseId}-subject-error`} className="text-sm text-red-800">{errors.subject}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${baseId}-message`} className="text-sm font-bold text-[#222f30]">الرسالة</label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          required
          rows={6}
          value={fields.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${baseId}-message-error` : undefined}
          onChange={(event) => set("message", event.target.value)}
          className={fieldClass(Boolean(errors.message))}
        />
        {errors.message && <p id={`${baseId}-message-error`} className="text-sm text-red-800">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#222f30] px-6 py-3 text-sm font-bold text-white hover:bg-[#162021]"
      >
        فتح الرسالة في البريد
      </button>

      {opened && (
        <p role="status" className="text-sm text-[#3f5456] leading-relaxed">
          إن لم يفتح تطبيق البريد، أرسل رسالتك يدوياً إلى {ADDRESS}.
        </p>
      )}
    </form>
  );
}
