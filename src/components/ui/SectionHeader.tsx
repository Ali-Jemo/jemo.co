interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
  gradientTitle?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
  className = "",
  gradientTitle = false,
}: SectionHeaderProps) {
  return (
    <div className={`section-head mb-10 ${center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <div className={`flex items-center gap-2 mb-3 ${center ? "justify-center" : ""}`}>
          <span className="h-1 w-8 rounded-full bg-[var(--brand)]" />
          <p className="text-xs font-mono font-bold text-[var(--brand)] tracking-wider uppercase">
            {eyebrow}
          </p>
        </div>
      )}
      <h2 className={`text-3xl md:text-4xl font-extrabold text-[var(--ink-1)] mb-4 leading-tight ${gradientTitle ? "text-gradient" : ""}`}>
        {title}
      </h2>
      {description && (
        <p className="text-[var(--ink-2)] text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
