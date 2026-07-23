interface BadgeProps {
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ dot = true, className = "", children }: BadgeProps) {
  return (
    <span className={`badge ${className}`}>
      {dot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
