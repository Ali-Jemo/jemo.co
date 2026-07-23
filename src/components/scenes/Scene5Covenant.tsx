import Image from "next/image";
import { Send, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
export default function Scene5Covenant() {
  return (
    <div
      id="covenant"
      className="w-full min-h-screen relative flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <Image
          src="/covenant-bg.png"
          alt="Covenant Background"
          fill
          priority
          className="object-cover opacity-100 filter brightness-125 contrast-110"
        />
        {/* Vignette Overlay to blend with #050505 background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-30" />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center gap-8">
        {/* Header / Seal Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--gold-dim)] bg-black/60 text-[var(--gold)] text-xs font-mono">
          <span>الميثاق · System Contract #762</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold font-kufi text-white tracking-tight">
          جاهز تبدأ السطر التالي؟
        </h2>

        {/* Text */}
        <p className="text-base md:text-xl text-[var(--light-warm)] max-w-2xl leading-relaxed">
          قدّم طلبك الآن — يستغرق أقل من 3 دقائق. لا شهادة مطلوبة، لا رسوم، فقط شغف ومهارة حقيقية.
        </p>

        {/* System Contract Box */}
        <Card className="w-full p-8 rounded-2xl border border-[var(--gold)] bg-black/80 backdrop-blur text-right flex flex-col gap-4 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono text-white/50">
            <span>STATUS: OPEN</span>
            <span>MEMBERSHIP: FREE & OPEN</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a href="/apply" className="animated-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
              </svg>
              <span className="text">أختم الميثاق</span>
              <span className="circle" />
              <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
              </svg>
            </a>
            <Button href="/applications" variant="outline" icon={<ExternalLink size={16} />}>
              سجل القبولات العام
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
