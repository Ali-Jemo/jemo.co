"use client";

import React, { useState } from "react";
import BioButton from "@/components/BioButton";
import {
  Coffee,
  Gamepad2,
  Wrench,
  Building2,
  Package,
  Heart,
  Mail,
} from "lucide-react";

export default function PhysicalLabGoal() {
  const [showWishlist, setShowWishlist] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#222f30] text-white border border-[#3b5153] shadow-xl p-6 sm:p-10 lg:p-12">
      {/* Subtle Glow Accents */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#cef79e]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#cef79e]/5 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 space-y-8 sm:space-y-10">
        {/* Playful Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 text-xs font-mono tracking-wider text-[#bef264]">
            <Coffee className="w-3.5 h-3.5 text-[#bef264]" />
            <span>حلم المقر الواقعي · BUY US A COFFEE &amp; AN RTX 6000 🌝</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-kufi tracking-tight leading-[1.25]">
            حالياً شغالين أونلاين من غرفنا.. وطموحنا نبني مقر حقيقي وكرت RTX 6000 قبل ما تنزل GTA 6 🌝
          </h2>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            بكل بساطة وبدون فلسفة: إحنا فريق شباب باحثين ومطورين شغالين أونلاين 100% بمكالمات وسيرفرات كلاود. بنسوي أبحاث مفتوحة المصدر ونطوّر نوى أنظمة وذكاء اصطناعي، وما نطلب من أحد أي شيء غصب أبداً. بس ودنا نطلع من شاشات الديسكورد، ونشتري كروت شاشة حقيقية ما تشتكي من حرارة التدريب، وراسم إشارة، ومقر يجمعنا على نفس الطاولة في بغداد نسولف ونبرمج سوا. لو حاب تدعم قهوتنا أو عتادنا، فالباب مفتوح وبكل حب!
          </p>
        </div>

        {/* 4 Casual Cards: What we actually need */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#bef264]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#bef264]/15 text-[#bef264] flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#bef264]">طاقة سهر ☕</span>
              <h3 className="text-base font-bold text-white font-kufi">عزمنا على فنجان قهوة</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              أبسط دعم يروّق الشباب لسهرات البرمجة وتصحيح الكود والأوراق العلمية الساعة 3 الفجر. كم فنجان قهوة يشحن طاقتنا أسابيع!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#bef264]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#bef264]/15 text-[#bef264] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#bef264]">تدريب وـ AI 🚀</span>
              <h3 className="text-base font-bold text-white font-kufi">كرت RTX محترم قبل GTA 6</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              لأن تدريب النماذج اللغوية على اللابتوبات خلا مراوحنا تقلع للمريخ. نحتاج كروت شاشة حقيقية تستحمل الشغل الثقيل بدون ما تطفي.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#bef264]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#bef264]/15 text-[#bef264] flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#bef264]">عتاد ومختبر ⚡</span>
              <h3 className="text-base font-bold text-white font-kufi">كاوية لحام وراسم إشارة</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              تطوير النوى ومحاكيات RISC-V حلو بالشاشات، بس ودنا نلمس الرقاقات ونبرمج الهاردوير بالواقع ونشم ريحة اللحام بالمختبر.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#bef264]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#bef264]/15 text-[#bef264] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#bef264]">لمة أصحاب 🏢</span>
              <h3 className="text-base font-bold text-white font-kufi">مقر صغير يجمعنا ببغداد</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              بدل ما كل نقاشاتنا بمكالمات أونلاين متقطعة، حلمنا مساحة حقيقية نقعد بيها على نفس الطاولة ونكتب كود ونناقش الأبحاث وجهاً لوجه.
            </p>
          </div>
        </div>

        {/* Wishlist Box (Have spare gear?) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-black/25 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#bef264]">
                <Package className="w-4 h-4" />
                <span>عندك عتاد قديم أو زايد بالدرج؟ (In-Kind Hardware)</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80">
                لو عندك كرت شاشة مستعمل، سيرفر قديم بالشركة، راسبيري باي، أو شاشة زايدة.. تراك تعطيها حياة جديدة تخدم أبحاث مفتوحة المصدر!
              </p>
            </div>

            <button
              onClick={() => setShowWishlist(!showWishlist)}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 hover:bg-[#bef264]/20 text-xs font-semibold text-[#bef264] transition-colors shrink-0 cursor-pointer self-start sm:self-center"
            >
              <span>{showWishlist ? "إخفاء القائمة" : "وش نقبل كعتاد؟ 👀"}</span>
            </button>
          </div>

          {showWishlist && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-[#bef264] block">GPU</span>
                <span className="text-white font-semibold">أي كرت شاشة 8GB+</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-[#bef264] block">Servers</span>
                <span className="text-white font-semibold">خوادم أو كيسات PC قديمة</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-[#bef264] block">Embedded</span>
                <span className="text-white font-semibold">Raspberry Pi / ESP32</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-[#bef264] block">Maker Tools</span>
                <span className="text-white font-semibold">طابعات 3D، أسلاك وكواية</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA & Humble Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/70 text-center sm:text-right">
            <Heart className="w-4 h-4 text-[#bef264] shrink-0" />
            <span>
              ما تقدر تتبرع؟ ولا يهمك أبداً! مجرد متابعتك ودعوة حلوة ومشاركة لمشاريعنا تسوى عندنا الدنيا والله ❤️
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <BioButton
              href="/support"
              label="BUY US A COFFEE ☕"
              secondaryLabel="ادعم الشباب وقهوتهم"
              variant="primary"
              dir="ltr"
            />
            <a
              href="mailto:contact@jemo.co?subject=Hey%20JEMO%20-%20Hardware%20/%20Coffee%20Support"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#bef264]" />
              <span>عندك عتاد أو فكرة؟ سولف معانا</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
