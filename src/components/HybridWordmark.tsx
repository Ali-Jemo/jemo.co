// ponytail: CSS hybrid wordmark: visible = jemo labs, copied = iraq
export default function HybridWordmark({ visible = "jemo labs", hidden = "iraq", className = "" }: { visible?: string; hidden?: string; className?: string }) {
  return (
    <span
      className={`relative inline-block ${className}`}
      aria-label={visible}
      style={{ color: "transparent" }}
    >
      {hidden}
      <span
        className="absolute inset-0 select-none"
        aria-hidden="true"
        style={{ filter: "blur(2.8px)", opacity: 0.85, color: "#000" }}
      >
        {hidden}
      </span>
      <span
        className="relative"
        aria-hidden="true"
        style={{
          background: "linear-gradient(135deg, #6B7B3A, #4A5628)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {visible}
      </span>
    </span>
  );
}
