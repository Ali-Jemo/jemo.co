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
    <div className={`section-head ${center ? "center" : ""} ${className}`}>
      {eyebrow && <p className="eyebrow fs-12" style={{ textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600, color: "var(--accent)" }}>{eyebrow}</p>}
      <h2 className={gradientTitle ? "text-gradient" : ""}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

