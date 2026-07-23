import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
};

import {
  Sparkles, ShieldCheck, Heart, Users, Compass, CheckCircle2,
  Calendar, Send, ArrowLeft, Building2, Code2, Microscope, Palette,
  Gamepad2, Lock, Target,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

const VALUES = [
  { icon: <Sparkles size={20} />, title: "الابتكار", desc: "نبحث عن حلول إبداعية تتجاوز النمط المألوف في كل مشروع نتخذه." },
  { icon: <ShieldCheck size={20} />, title: "النزاهة", desc: "شفافية كاملة في القرارات والقبولات والنتائج المنشورة." },
  { icon: <Heart size={20} />, title: "الشغف", desc: "نعمل بحماس حقيقي لأننا نختار من يشاركنا الشغف ذاته." },
  { icon: <Users size={20} />, title: "التعاون", desc: "العمل الجماعي يحقق نتائج لا يمكن لأحد الوصول إليها وحده." },
  { icon: <Compass size={20} />, title: "الاستكشاف", desc: "نسعى دوماً لتطوير مهاراتنا واكتشاف آفاق جديدة." },
  { icon: <Target size={20} />, title: "الجودة", desc: "نلتزم بأعلى معايير الجودة في كل منتج أو بحث نقدمه." },
];

const MILESTONES = [
  { date: "Q1 2026", title: "التأسيس", desc: "إطلاق jemo labs كفرع بحثي تابع لشركة LXD Co." },
  { date: "Q2 2026", title: "التوسع", desc: "افتتاح الأقسام الأربعة واستقبال أول دفعة من المتقدمين." },
  { date: "Q3 2026", title: "الإنتاج", desc: "إطلاق أولى المنشورات والأبحاث والمشاريع البرمجية." },
  { date: "Q4 2026", title: "المؤتمر", desc: "عقد مؤتمر jemo labs الأول لعرض إنجازات السنة." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="section" style={{ paddingTop: "140px" }}>
          <div className="container" style={{ textAlign: "center", maxWidth: "720px", marginInline: "auto" }}>
            <Badge dot>من نحن</Badge>
            <h1 className="fs-48" style={{ marginTop: "var(--s-5)" }}>جهاز jemo البحثي</h1>
            <p className="fs-18" style={{ marginTop: "var(--s-4)", color: "var(--ink-2)" }}>
              فرع أبحاثي وتقني غير ربحي تابع لشركة LXD Co. نجمع العقول المبدعة ونبني الأبحاث والمنصات المفتوحة.
            </p>
          </div>
        </section>

        {/* MISSION */}
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="رسالتنا"
              title="نبني منظومة رقمية متكاملة"
              description="نجمع الباحثين والمبدعين في بيئة عمل واحدة لتحويل الأفكار إلى مشاريع منشورة ومنصات رقمية حقيقية."
            />
            <div className="grid-4">
              {[
                { icon: <Microscope size={20} />, title: "أبحاث علمية", desc: "دراسات ميدانية وتحليل بيانات ومنشورات أكاديمية." },
                { icon: <Code2 size={20} />, title: "ابتكار برمجي", desc: "منصات ويب وأدوات أتمتة مفتوحة المصدر." },
                { icon: <Palette size={20} />, title: "تصميم وهوية", desc: "واجهات مستخدم وهوية بصرية متكاملة." },
                { icon: <Gamepad2 size={20} />, title: "محتوى وألعاب", desc: "إنتاج محتوى تحليلي وأعمال رقمية تعليمية." },
              ].map((item, i) => (
                <Card key={i} hover>
                  <div className="chip" style={{ marginBottom: "var(--s-4)" }}>{item.icon}</div>
                  <h3 className="fs-18" style={{ marginBottom: "var(--s-2)" }}>{item.title}</h3>
                  <p className="fs-14" style={{ color: "var(--ink-2)" }}>{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* RELATIONSHIP WITH LXD */}
        <section className="section">
          <div className="container">
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-4)", marginBottom: "var(--s-4)" }}>
                <div className="chip"><Building2 size={20} /></div>
                <div>
                  <h3 className="fs-20" style={{ margin: 0 }}>العلاقة مع LXD Co.</h3>
                </div>
              </div>
              <p className="fs-16" style={{ color: "var(--ink-2)" }}>
                jemo labs هو الفرع البحثي غير الربحي تابع لشركة LXD Co. نعمل باستقلالية تامة في الأبحاث والمشاريع بينما نستفيد من بنية الشركة التحتية والدعم التقني. كل مشروع ينتجه jemo labs هو ملكية مشتركة بين الفريق والمنظمة.
              </p>
            </Card>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="قيمنا"
              title="القيم الأساسية"
              description="المبادئ التي نعمل بها ونختار أعضاءنا وفقاً لها."
              center
            />
            <div className="grid-4">
              {VALUES.map((v, i) => (
                <Card key={i} hover>
                  <div className="chip" style={{ marginBottom: "var(--s-4)" }}>{v.icon}</div>
                  <h3 className="fs-18" style={{ marginBottom: "var(--s-2)" }}>{v.title}</h3>
                  <p className="fs-14" style={{ color: "var(--ink-2)" }}>{v.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="خارطة الطريق"
              title="المراحل القادمة"
              description="خط زمني واضح لإطلاق وتوسيع منظومة jemo labs."
              center
            />
            <div className="timeline">
              {MILESTONES.map((m, i) => (
                <div key={i} className="step">
                  <div className="node">{String(i + 1).padStart(2, "0")}</div>
                  <span className="idx">{m.date}</span>
                  <h3>{m.title}</h3>
                  <p className="fs-14">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container">
            <div className="cta-band">
              <h2 className="fs-36">انضم إلينا</h2>
              <p className="fs-16" style={{ marginTop: "var(--s-3)", marginInline: "auto" }}>
                نبحث عن أشخاص متحمسين يريدون ترك أثر حقيقي. قدّم طلبك الآن.
              </p>
              <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", marginTop: "var(--s-6)" }}>
                <Link href="/apply" className="btn btn--invert">
                  <span>قدّم طلب الانضمام</span>
                  <Send size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
