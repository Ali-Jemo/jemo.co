// ponytail: SVG wave divider — pure CSS/SVG, zero JS
interface Props {
  flip?: boolean;
  className?: string;
  color?: string;
}

export default function SectionDivider({ flip, className = "", color = "var(--bg)" }: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative block w-full h-[40px] md:h-[60px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
