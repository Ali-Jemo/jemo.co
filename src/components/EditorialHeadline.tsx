import React from "react";

// Mistral-style editorial headline: optional 3-icon cluster (icon-editorial) + eyebrow + big display title + kicker.
// Server component.
export default function EditorialHeadline({
  eyebrow,
  children,
  kicker,
  align = "center",
  icons,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  kicker?: string;
  align?: "center" | "start";
  icons?: React.ElementType[];
}) {
  return (
    <div className={align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      {icons && icons.length > 0 && (
        <div className={`flex gap-3 mb-6 ${align === "center" ? "justify-center" : "justify-start"}`}>
          {icons.map((Icon, idx) => (
            <div
              key={idx}
              className="w-11 h-11 rounded-md border border-[var(--j-line)] bg-white/80 grid place-items-center text-[var(--brand)] shadow-sm hover:scale-105 transition-transform"
            >
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>
      )}
      {eyebrow && <p className="j-eyebrow mb-4">{eyebrow}</p>}
      <h2 className="j-headline">{children}</h2>
      {kicker && <p className="text-[var(--ink-2)] mt-5 text-base md:text-lg leading-relaxed">{kicker}</p>}
    </div>
  );
}
