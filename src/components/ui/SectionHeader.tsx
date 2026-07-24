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
    <div className={`mb-10 ${center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-mono font-bold text-[var(--brand)] mb-3 tracking-wider uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl font-extrabold text-[var(--ink-1)] mb-4 ${gradientTitle ? "text-gradient" : ""}`}>
        {title}
      </h2>
      {description && <p className="text-[var(--ink-2)] text-base md:text-lg leading-relaxed">{description}</p>}
    </div>
  );
}

