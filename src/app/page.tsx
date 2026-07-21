"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Microscope, Laptop, Palette, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0;
    interface Dot { x: number; y: number; r: number; vx: number; vy: number; a: number; }
    const dots: Dot[] = [];
    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      dots.length = 0;
      for (let i = 0; i < 40; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          a: 0.15 + Math.random() * 0.25,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107, 123, 58, ${d.a})`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

function BentoCard({ children, className = "", delay = 0, href }: { children: React.ReactNode; className?: string; delay?: number; href?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const cardContent = (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      ref={cardRef} 
      onMouseMove={handleMouseMove}
      className={`bg-black relative overflow-hidden bento-spotlight flex flex-col justify-between p-8 group z-10 ${href ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.article>
  );

  if (href) {
    return <Link href={href} className="contents">{cardContent}</Link>;
  }

  return cardContent;
}


export default function Home() {

  return (
    <>
      <Header />

      <main className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <Particles />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 flex flex-col items-center">
          <span className="text-xs font-semibold px-4 py-1.5 bg-olive-g text-olive rounded-full mb-4 font-space uppercase tracking-wide">فرع بحثي لشركة lxd</span>
          <h1 className="text-[clamp(5rem,17vw,14rem)] font-extrabold font-space leading-none tracking-tight bg-gradient-to-br from-olive to-olive-d bg-clip-text text-transparent drop-shadow-2xl select-none">jemo</h1>
          <p className="text-lg md:text-xl text-grey font-light mt-4">أبحاث. استقطاب. ابتكار.</p>
        </motion.div>
      </main>

      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} className="h-px bg-gradient-to-r from-transparent via-olive to-transparent w-full opacity-50"></motion.div>

      <section id="about" className="max-w-[800px] mx-auto py-24 px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold text-olive mb-6">أبحاث متقدمة، استقطاب نوعي</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-grey leading-relaxed text-lg">
          نحن فرع بحثي متخصص تابع للشركة الأصلية <strong className="text-off font-outfit font-bold tracking-widest">lxd</strong>. تتركز أهدافنا حول الأبحاث المتقدمة واستقطاب أفضل الكفاءات لبناء حلول رقمية، ضمن بيئة تجمع فِرقاً مستقلة تعمل بروح الفريق الواحد.
        </motion.p>
      </section>

      <section id="divisions" className="max-w-[1000px] mx-auto px-6 py-12 text-right">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-olive">أقسامنا</h2>
          <Link href="/gallery" className="text-sm text-grey hover:text-olive flex items-center gap-1.5 transition-colors group">
            <span>استكشف المعرض</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-olive" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(220px,auto)] gap-[1px] bg-white/10 border border-white/10 p-[1px]">
          
          {/* Row 1 */}
          <div className="bg-black hidden md:block relative group">
            <div className="absolute w-10 h-10 bg-black border border-white/10 rotate-45 -right-5 -bottom-5 z-20 transition-all duration-500 group-hover:rotate-[135deg] group-hover:scale-110 group-hover:border-olive/50"></div>
          </div>
          <BentoCard delay={0.1} href="/gallery" className="md:col-span-2">
            <div className="flex justify-between items-start mb-6 z-10">
              <Gamepad2 className="w-8 h-8 text-off group-hover:text-olive transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="text-[11px] font-semibold px-3 py-1 bg-white/5 border border-white/10 text-grey rounded-full group-hover:border-olive/30 group-hover:text-olive transition-colors">محتوى وترفيه</span>
            </div>
            <div className="z-10">
              <h3 className="text-lg font-semibold text-off mb-2 group-hover:text-olive transition-colors">المحتوى والألعاب</h3>
              <p className="text-sm text-grey font-light leading-relaxed mb-4">إنتاج محتوى يوتيوب في مجال الألعاب والترفيه الرقمي.</p>
              <div className="text-xs text-olive opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                <span>تصفح أعمال القسم</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </BentoCard>
          <div className="bg-black hidden md:block relative">
            <div className="absolute w-1.5 h-1.5 bg-olive rounded-full -right-[3px] -top-[3px] z-20 animate-pulse-dot shadow-[0_0_8px_rgba(107,123,58,0.8)]"></div>
          </div>

          {/* Row 2 */}
          <div className="bg-black hidden md:block relative">
            <div className="absolute w-1.5 h-1.5 bg-olive rounded-full -left-[3px] -bottom-[3px] z-20 animate-pulse-dot shadow-[0_0_8px_rgba(107,123,58,0.8)]" style={{ animationDelay: "1s" }}></div>
          </div>
          <BentoCard delay={0.2} href="/gallery">
            <div className="flex justify-between items-start mb-6 z-10">
              <Microscope className="w-8 h-8 text-off group-hover:text-olive transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="text-[11px] font-semibold px-3 py-1 bg-white/5 border border-white/10 text-grey rounded-full group-hover:border-olive/30 group-hover:text-olive transition-colors">أبحاث وتطوير</span>
            </div>
            <div className="z-10">
              <h3 className="text-lg font-semibold text-off mb-2 group-hover:text-olive transition-colors">الأبحاث العلمية</h3>
              <p className="text-sm text-grey font-light leading-relaxed mb-4">فريق مختص بالبحث العلمي والتطوير المعرفي.</p>
              <div className="text-xs text-olive opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                <span>تصفح الأبحاث</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </BentoCard>
          <BentoCard delay={0.3} href="/gallery">
            <div className="flex justify-between items-start mb-6 z-10">
              <Laptop className="w-8 h-8 text-off group-hover:text-olive transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="text-[11px] font-semibold px-3 py-1 bg-white/5 border border-white/10 text-grey rounded-full group-hover:border-olive/30 group-hover:text-olive transition-colors">ابتكار برمجي</span>
            </div>
            <div className="z-10">
              <h3 className="text-lg font-semibold text-off mb-2 group-hover:text-olive transition-colors">التقنية والبرمجة</h3>
              <p className="text-sm text-grey font-light leading-relaxed mb-4">بناء أدوات ومنصات رقمية تخدم أقسام المجموعة.</p>
              <div className="text-xs text-olive opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                <span>عرض الحلول</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </BentoCard>
          <BentoCard delay={0.4} href="/gallery" className="md:row-span-2">
            <div className="flex justify-between items-start mb-6 z-10">
              <Palette className="w-8 h-8 text-off group-hover:text-olive transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="text-[11px] font-semibold px-3 py-1 bg-white/5 border border-white/10 text-grey rounded-full group-hover:border-olive/30 group-hover:text-olive transition-colors">هوية بصرية</span>
            </div>
            <div className="z-10 mt-auto">
              <h3 className="text-lg font-semibold text-off mb-2 group-hover:text-olive transition-colors">التصميم والهوية</h3>
              <p className="text-sm text-grey font-light leading-relaxed mb-4">بناء الهوية البصرية والتصاميم لكل مشاريع المجموعة.</p>
              <div className="text-xs text-olive opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                <span>معرض التصاميم</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </BentoCard>

          {/* Row 3 */}
          <div className="bg-black hidden md:block"></div>
          <div className="bg-off hidden md:block"></div>
          <div className="bg-black hidden md:block md:col-span-1 relative group">
             <div className="absolute w-10 h-10 bg-black border border-white/10 rotate-45 -left-5 -top-5 z-20 transition-all duration-500 group-hover:rotate-[135deg] group-hover:scale-110 group-hover:border-olive/50"></div>
          </div>
          
        </div>
      </section>

      <section id="contact" className="py-24 px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-4">هل تمتلك الشغف والمهارة؟</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-grey mb-8">نهتم في فرعنا البحثي باستقطاب العقول المبتكرة — انضم لفريقنا لنبني المستقبل معاً.</motion.p>
        
        <motion.a 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.95 }}
          href="/applications"
          className="relative inline-flex items-center justify-center px-8 py-3 bg-olive text-black font-semibold rounded-full hover:bg-olive-d transition-colors group"
        >
          <div className="relative flex items-center overflow-hidden">
            {/* Text has a 28px left margin to make room for the left arrow initially. 
                On hover, it slides 28px left, consuming the margin and making room on its right. */}
            <span className="inline-block ml-7 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-[28px] font-outfit">
              تواصل معنا
            </span>
            
            {/* Old Arrow: Starts visible on the left, flies out to the left */}
            <ArrowLeft className="absolute left-0 w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-8 group-hover:opacity-0" />
            
            {/* New Arrow: Starts hidden on the right, flies into the newly opened space on its right */}
            <ArrowLeft className="absolute right-0 w-5 h-5 translate-x-8 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0 group-hover:opacity-100" />
          </div>
        </motion.a>
      </section>

      <Footer />
    </>
  );
}