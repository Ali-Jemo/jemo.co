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
        <div className={`flex items-center gap-2.5 mb-3 ${center ? "justify-center" : ""}`}>
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[var(--brand)]" />
          <p className="eyebrow-bar !py-0 !px-0 !bg-transparent !border-0">
            {eyebrow}
          </p>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[var(--brand)]" />
        </div>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold text-[var(--ink-1)] mb-4 leading-tight ${gradientTitle ? "text-gradient" : ""}`}>
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
