"use client";

export default function BioMarquee() {
  const phrase = "هندسة المستقبل والسيادة الرقمية – العلم بين يديك – بيت الحكمة الرقمي – ";

  return (
    <section 
      dir="rtl"
      className="w-full bg-[#f7f7f5] py-14 sm:py-20 overflow-hidden border-b border-[#e4e3e3] select-none"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
        <div className="flex shrink-0 items-center whitespace-nowrap">
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal font-kufi text-[#222f30] tracking-tight pe-8">
            {phrase}
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal font-kufi text-[#222f30] tracking-tight pe-8">
            {phrase}
          </span>
        </div>
        <div className="flex shrink-0 items-center whitespace-nowrap" aria-hidden>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal font-kufi text-[#222f30] tracking-tight pe-8">
            {phrase}
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal font-kufi text-[#222f30] tracking-tight pe-8">
            {phrase}
          </span>
        </div>
      </div>
    </section>
  );
}
