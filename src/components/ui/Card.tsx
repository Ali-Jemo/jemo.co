import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  hover = false,
  active = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const cls = [
    "card",
    hover && "card--hover",
    active && "card--active",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cls} {...rest}>{children}</div>;
}
