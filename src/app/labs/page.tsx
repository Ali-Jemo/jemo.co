import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioButton from "@/components/BioButton";
import LabsExplorer from "@/components/labs/LabsExplorer";
import PhysicalLabGoal from "@/components/labs/PhysicalLabGoal";
import { getLiveLabs } from "@/lib/live-content";
import {
  Crown,
  Award,
  GraduationCap,
  Compass,
  Server,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowUpLeft,
  ArrowDown,
  Mail,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "المختبرات البحثية واستقطاب العلماء | JEMO LABS",
  description:
    "شبكة مختبرات JEMO LABS للبحوث المتقدمة في الذكاء الاصطناعي، أنظمة التشغيل، الحوسبة الكمية، التكنولوجيا الحيوية، الطاقة، والعلوم المعرفية. استقطاب العلماء والباحثين وزمالات الأبحاث السيادية.",
};

const RECRUITMENT_TRACKS = [
  {
    id: "pi",
    title: "باحث رئيسي (Principal Investigator)",
    badge: "قيادة بحثية",
    desc: "قيادة خطوط بحثية متقدمة، تأسيس مشاريع سيادية، وتشكيل وإدارة فرق الباحثين مع توفير الدعم الحوسبي والمادي الكامل.",
    icon: Crown,
    actionText: "التقديم كباحث رئيسي",
    href: "/apply",
  },
  {
    id: "postdoc",
    title: "زميل بحثي متقدم (Postdoc / Senior Fellow)",
    badge: "أبحاث ونشر محكم",
    desc: "إجراء دراسات معمقة ونشر أوراق علمية محكمة في كبرى المؤتمرات والمجلات المصنفة عالمياً (Q1/Q2) بإسناد من عناقيد المعالجة.",
    icon: Award,
    actionText: "التقديم للزمالة البحثية",
    href: "/apply",
  },
  {
    id: "grad",
    title: "باحث دراسات عليا (PhD / Graduate Affiliate)",
    badge: "أطروحات ودراسات",
    desc: "ربط أطروحتك الأكاديمية بمشاريع تطبيقية حية مع توفير الإشراف المزدوج ودعم البنية وتوثيق إثبات العمل الأكاديمي.",
    icon: GraduationCap,
    actionText: "انضمام الباحثين الشباب",
    href: "/apply",
  },
  {
    id: "new-lab",
    title: "اقتراح وتأسيس مختبر جديد (Propose a New Lab)",
    badge: "مبادرة تأسيس",
    desc: "إذا كان تخصصك العلمي الرائد غير مشمول بعد، نفتح لك الباب لتقديم ميثاق تأسيس مختبر بحثي وسنوفر متطلبات إطلاقه.",
    icon: Compass,
    actionText: "تقديم ميثاق مختبر جديد",
    href: "/apply",
  },
];

const RESEARCH_BENEFITS = [
  {
    title: "عناقيد الحوسبة الفائقة (HPC)",
    desc: "وصول غير مقيد لمعالجات GPU المتقدمة، مسرعات تدريب النماذج، وبيئات المحاكاة الكمومية والحركية المعقدة.",
    icon: Server,
  },
  {
    title: "السيادة العلمية وإثبات العمل",
    desc: "استقلالية أكاديمية كاملة مع توثيق الأسبقية الفكرية كمعرفة مفتوحة غير قابلة للاحتكار أو التعتيم المؤسسي.",
    icon: ShieldCheck,
  },
  {
    title: "تمويل المنح ورسوم النشر (Q1/Q2)",
    desc: "تغطية تكاليف النشر في المجلات العالمية المفتوحة (Open Access) وتوفير منح للمشاريع التطبيقية ذات الأثر السيادي.",
    icon: Zap,
  },
  {
    title: "التكامل العابر للتخصصات",
    desc: "تجسير بين مهندسي النوى والباحثين لإنتاج نتائج موثقة.",
    icon: Sparkles,
  },
];

export default async function LabsIndexPage() {
  const labs = await getLiveLabs();

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#f7f7f5]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 space-y-16 sm:space-y-20">
          
          {/* ================= 1. HERO RECRUITMENT SECTION ================= */}
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e] animate-pulse" />
              <span>المختبرات الأكاديمية والاستقطاب العلمي · RESEARCH LABS &amp; FELLOWSHIPS</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-6 tracking-tight leading-[1.18] font-kufi">
              المختبرات البحثية المتخصصة: صروح المعرفة واستقطاب العلماء.
            </h1>
            
            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-3xl mb-8">
              منظومة من {labs.length} مختبرات بحثية تغطي أبحاث الذكاء الاصطناعي، أنظمة التشغيل، الرؤية الحاسوبية، والمعلوماتية الحيوية. شغالين حالياً أونلاين 100% بحماس ومصادر مفتوحة، ونطمح نشتري عتاد ومقر فيزيائي حقيقي يجمعنا في بغداد قبل ما تنزل GTA 6 🌝. الباب مفتوح لكل باحث وداعم!
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 font-mono">
              <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-[#222f30] font-sans">{labs.length}</div>
                <div className="text-xs text-[#445e5f] mt-0.5">مختبرات تخصصية</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-[#222f30] font-sans">12</div>
                <div className="text-xs text-[#445e5f] mt-0.5">كائن بحثي منشور</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-[#222f30] font-sans">100%</div>
                <div className="text-xs text-[#445e5f] mt-0.5">علم مفتوح وسيادي</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-[#222f30] font-sans">مفتوح</div>
                <div className="text-xs text-[#445e5f] mt-0.5">نشر مفتوح بلا رسوم</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <BioButton
                href="/support"
                label="BUY US A COFFEE ☕"
                secondaryLabel="ادعم الشباب وقهوتهم"
                variant="primary"
                dir="ltr"
              />
              <BioButton
                href="/apply"
                label="APPLY FOR FELLOWSHIP"
                secondaryLabel="انضم كباحث أو زميل"
                variant="secondary"
                dir="ltr"
              />
              <a
                href="#labs-directory"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#e4e3e3] bg-white text-xs font-bold text-[#222f30] hover:bg-[#ecece9] hover:border-[#222f30] transition-colors shadow-xs"
              >
                <span>استعراض جميع المختبرات</span>
                <ArrowDown className="w-4 h-4 text-[#445e5f]" />
              </a>
            </div>
          </div>

          {/* ================= 2. PHYSICAL LAB EXPANSION & DONATION GOAL ================= */}
          <PhysicalLabGoal />

          {/* ================= 3. RECRUITMENT & FELLOWSHIP TRACKS ================= */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e4e3e3] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cef79e]/40 text-[#222f30] font-mono text-xs font-semibold mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>مسارات الانضمام والاستقطاب</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#222f30] font-kufi">
                  كيف تنضم وتُبدع في مختبرات JEMO LABS؟
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#445e5f] max-w-md">
                مسارات مرنة تستوعب العلماء المتمرسين، أساتذة الجامعات، الزملاء ما بعد الدكتوراه، والباحثين المستقلين من جميع أنحاء العالم.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RECRUITMENT_TRACKS.map((track) => {
                const Icon = track.icon;
                return (
                  <div
                    key={track.id}
                    className="p-7 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-500 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-[#222f30] flex items-center justify-center group-hover:bg-[#cef79e] transition-colors">
                          <Icon className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#f7f7f5] border border-[#e4e3e3] text-[#445e5f]">
                          {track.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#222f30] mb-2 font-kufi leading-snug">
                        {track.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed mb-6">
                        {track.desc}
                      </p>
                    </div>

                    <Link
                      href={track.href}
                      className="inline-flex items-center justify-between w-full pt-4 border-t border-[#e4e3e3] text-xs font-bold text-[#222f30] group-hover:text-[var(--brand)] transition-colors"
                    >
                      <span>{track.actionText}</span>
                      <ArrowUpLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= 4. RESEARCH BENEFITS & ADVANTAGES ================= */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#222f30] text-white shadow-xl space-y-10">
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-mono text-[#bef264] uppercase tracking-widest mb-3">
                RESEARCH ADVANTAGES &amp; INFRASTRUCTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-kufi mb-4">
                ماذا نقدّم للعلماء والباحثين في منظومتنا؟
              </h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                بيئة بحثية مصممة لإزالة البيروقراطية الأكاديمية التقليدية وتمكين الباحث من التركيز على التجربة، النمذجة، النشر، والأثر المعرفي الفعلي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RESEARCH_BENEFITS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#bef264]/60 transition-all hover:bg-white/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#bef264]/20 text-[#bef264] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 font-kufi">{item.title}</h3>
                    <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= 5. INTERACTIVE LABS EXPLORER ================= */}
          <div id="labs-directory" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e4e3e3] text-[#445e5f] font-mono text-xs font-semibold mb-2">
                  <span>دليل التخصصات العلمية</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#222f30] font-kufi">
                  استكشف المختبرات حسب التخصص الأكاديمي
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#445e5f] max-w-md">
                اختر مجالك العلمي للاطلاع على المشاريع الجارية، الهيئة البحثية، والأوراق الصادرة عن كل مختبر.
              </p>
            </div>

            {/* Interactive Search & Filter Client Component */}
            <LabsExplorer labs={labs} />
          </div>

          {/* ================= 6. CALL TO PROPOSE A LAB / DIRECT CONTACT ================= */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cef79e]/40 text-[#222f30] text-xs font-mono font-bold">
                <Mail className="w-3.5 h-3.5" />
                <span>المجلس الأكاديمي واللجنة العلمية</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#222f30] font-kufi">
                هل لديك استفسار أكاديمي أو مقترح شراكة بحثية؟
              </h3>
              <p className="text-sm text-[#445e5f] leading-relaxed">
                فريقنا الأكاديمي جاهز لمناقشة مقترحات الزمالات، المنح الحوسبية، وتأسيس برامج أبحاث مشتركة مع الجامعات والمراكز البحثية العالمية.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <BioButton
                href="/apply"
                label="SUBMIT RESEARCH PROPOSAL"
                secondaryLabel="تقديم مقترح بحثي"
                variant="primary"
                dir="ltr"
              />
              <a
                href="mailto:contact@jemo.co?subject=Scientific%20Research%20Proposal%20-%20JEMO%20LABS"
                className="px-5 py-3 rounded-full border border-[#e4e3e3] bg-[#f7f7f5] text-xs sm:text-sm font-semibold text-[#222f30] hover:bg-[#e4e3e3] transition-colors"
              >
                مراسلة المجلس العلمي مباشرة
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
