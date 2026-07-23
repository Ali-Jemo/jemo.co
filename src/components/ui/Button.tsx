import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "invert";
  size?: "sm" | "md";
  block?: boolean;
  glow?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  glow = false,
  href,
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = [
    "btn",
    `btn--${variant}`,
    glow && "btn--glow",
    size === "sm" && "btn--sm",
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon}
      {typeof children === "string" ? <span>{children}</span> : children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {content}
    </button>
  );
}
