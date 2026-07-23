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
      {/* Subtle Cylinder Seal Background Symbol */}
      <div className="absolute right-10 bottom-10 pointer-events-none opacity-10">
        <svg width="300" height="300" viewBox="0 0 200 200" fill="none" stroke="var(--gold)" strokeWidth="1">
          <circle cx="100" cy="100" r="90" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="60" />
          <polygon points="100,20 120,80 180,100 120,120 100,180 80,120 20,100 80,80" />
        </svg>
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

          <div className="space-y-2 text-xs md:text-sm text-white/70">
            <p>• الالتزام بالشغف، الشفافية، ونشر المعرفة المفتوحة المصدر.</p>
            <p>• الحرية الكاملة في اختيار القسم والمشاريع البحثية أو البرمجية.</p>
            <p>• الانضمام المباشر لبيئة عمل مستقلة تابعة لشبكة LXD Co.</p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Button href="/apply" variant="primary" glow icon={<Send size={16} />}>
              أختم الميثاق
            </Button>
            <Button href="/applications" variant="outline" icon={<ExternalLink size={16} />}>
              سجل القبولات العام
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
