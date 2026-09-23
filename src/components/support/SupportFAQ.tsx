"use client";

import Accordion from "@/components/ui/Accordion";
import { HelpCircle } from "lucide-react";

export default function SupportFAQ() {
  const faqItems = [
    {
      id: "faq-1",
      title: "هل تذهب التبرعات لأغراض تجارية أو أرباح خاصة للمؤسسين؟",
      children: (
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          لا على الإطلاق. تعمل JEMO LABS وفق نموذج المؤسسات البحثية غير الربحية المستقلة. كل دولار أو عملة نتلقاها موجهة بنسبة 100% للأبحاث الصافية، دعم الباحثين والطلبة العراقيين، وشراء وتجهيز خوادم الحوسبة ومختبرات معالجات RISC-V، وتغطية رسوم النشر المفتوح.
        </p>
      ),
    },
    {
      id: "faq-2",
      title: "كيف تضمنون استقلالية الأبحاث في حال تلقي دعم من مؤسسة تجارية أو مانحة؟",
      children: (
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          نطبق جدار حماية صارم (Firewall) يفصل فصلاً تاماً بين الجهات الداعمة والعملية البحثية. أي منحة أو رعاية تشترط توجيه النتائج، أو حجب الثغرات، أو احتكار الملكية الفكرية، ترفضها المؤسسة فوراً. كافة الشيفرات والبيانات والنماذج تتاح بموجب رخص المصادر المفتوحة فور اكتمالها.
        </p>
      ),
    },
    {
      id: "faq-3",
      title: "هل يمكنني تخصيص دعمي لمشروع أو مختبر بحثي محدد؟",
      children: (
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          نعم بالتأكيد. يمكنك عند تقديم الدعم عبر الحوالة أو منصات الدعم أو النموذج الإشارة إلى أنك ترغب في توجيه مساهمتك إلى مجال بحثي محدد.
        </p>
      ),
    },
    {
      id: "faq-4",
      title: "ما هي أسهل وأسرع وسيلة لدعمكم من خارج العراق؟",
      children: (
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          تعد منصة GitHub Sponsors ونموذج التواصل للمنح المؤسسية الوسائل المعتمدة للدعم من خارج العراق.
        </p>
      ),
    },
    {
      id: "faq-5",
      title: "هل يمكنني التبرع بساعات حوسبة GPU أو عتاد معملي بدلاً من المال؟",
      children: (
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          نرحب جداً بالتبرعات العينية والتقنية! إذا كان لديك أرصدة سحابية على AWS، Lambda Labs، RunPod، أو خوادم خاصة يمكنك مشاركتها، أو بوردات تطويرية (RISC-V / FPGA)، يرجى ملء نموذج التواصل لنقوم بالتنسيق الفني المباشر معك.
        </p>
      ),
    },
    {
      id: "faq-6",
      title: "هل أحصل على إشعار رسمي أو عقد رعاية لمؤسستي أو جامعتي؟",
      children: (
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          نعم. نوفر للمؤسسات الأكاديمية والشركات الراعية مذكرات تفاهم (MOU)، اتفاقيات رعاية بحثية، وإيصالات استلام موثقة.
        </p>
      ),
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-[#728825]" />
          <span>الأسئلة المتكررة حول الدعم والرعاية</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink-1)] font-kufi">
          كل ما تحتاج معرفته عن تمويل JEMO LABS
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-2)]">
          إجابات واضحة وشفافة حول آليات الدعم، إدارة الميزانية، والضمانات الأخلاقية والأكاديمية.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}
