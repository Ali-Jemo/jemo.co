"use client";

import { useState } from "react";
import {
  BookOpen,
  Book,
  BarChart2,
  FlaskConical,
  Video,
  Tv,
  Palette,
  PenTool,
  Terminal,
  Smartphone,
  FolderOpen,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GalleryItem {
  id: string;
  category: "books" | "research" | "youtube" | "design" | "code";
  title: string;
  meta: string;
  description: string;
  icon: React.ReactNode;
}

const ITEMS: GalleryItem[] = [
  {
    id: "book-1",
    category: "books",
    title: "أساسيات العمل الجماعي",
    meta: "منشور — 2026",
    description:
      "دليل إرشادي شامل يغطي مفاهيم توزيع المهام واستقلالية الفرق بروح واحدة داخل المنظومة الرقمية.",
    icon: <BookOpen className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "book-2",
    category: "books",
    title: "دليل المبتدئين في المحتوى",
    meta: "قيد الكتابة — 2026",
    description:
      "كتاب تعليمي موجه لصناع المحتوى في العراق يغطي آليات السرد وإنتاج الفيديو والتحليل.",
    icon: <Book className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "research-1",
    category: "research",
    title: "عوامل الاستعداد للتطور المهني لدى الشباب العراقي",
    meta: "بحث علمي — قيد التحليل",
    description:
      "ورقة بحثية ميدانية تهدف لتحليل العوامل الاستباقية في اكتساب المهارات التقنية الحديثة لدى الشباب.",
    icon: <BarChart2 className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "research-2",
    category: "research",
    title: "دراسة مقارنة: العمل الفردي مقابل الجماعي",
    meta: "مشروع مستقبلي",
    description:
      "تحليل إنتاجية الفرق المستقلة ذات التوجيه الموحد مقارنة بأساليب التوظيف التقليدية.",
    icon: <FlaskConical className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "yt-1",
    category: "youtube",
    title: "مراجعة ألعاب 2026",
    meta: "قناة يوتيوب — 12 مقطع",
    description:
      "سلسلة نقدية وترفيهية تستعرض أبرز الإنتاجات الرقمية وألعاب الفيديو بنظرة تحليلية عربية.",
    icon: <Video className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "yt-2",
    category: "youtube",
    title: "سلسلة وراء الكواليس",
    meta: "قيد الإنتاج",
    description:
      "وثائقيات قصيرة توثق كواليس الأبحاث والمشاريع والتطوير البرمجي داخل jemo labs.",
    icon: <Tv className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "design-1",
    category: "design",
    title: "هوية jemo البصرية",
    meta: "هوية كاملة — 2026",
    description:
      "النظام البصري الكامل للفرع البحثي بما يشمل الخطوط، الألوان، وأنماط الويب الدقيقة.",
    icon: <Palette className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "design-2",
    category: "design",
    title: "تصاميم وسائل التواصل",
    meta: "مجموعة تصاميم",
    description:
      "قوالب وتصاميم رقمية مخصصة لإعلان النتائج والأبحاث في منصات التليجرام والتواصل الاجتماعي.",
    icon: <PenTool className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "code-1",
    category: "code",
    title: "نظام إدارة الفرق والقبولات",
    meta: "مشروع داخلي — 2026",
    description:
      "منظومة إلكترونية متكاملة للتقديم والمراجعة التلقائية وتوليد عقود الانضمام وبوتات التليجرام.",
    icon: <Terminal className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
  {
    id: "code-2",
    category: "code",
    title: "تطبيق إشعارات الفريق",
    meta: "مستقبلي",
    description:
      "تطبيق للهواتف المحمولة يتيح متابعة التحديثات البحثية والمهام الموزعة فورياً.",
    icon: <Smartphone className="w-6 h-6" style={{ color: "var(--accent)" }} />,
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل", icon: <FolderOpen className="w-4 h-4" /> },
  { id: "books", label: "كتب ومنشورات", icon: <BookOpen className="w-4 h-4" /> },
  { id: "research", label: "أبحاث علمية", icon: <FlaskConical className="w-4 h-4" /> },
  { id: "youtube", label: "محتوى يوتيوب", icon: <Video className="w-4 h-4" /> },
  { id: "design", label: "تصميم وهوية", icon: <Palette className="w-4 h-4" /> },
  { id: "code", label: "مشاريع برمجية", icon: <Terminal className="w-4 h-4" /> },
];

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = ITEMS.filter((item) => {
    const matchesCat = selectedCat === "all" || item.category === selectedCat;
    const matchesSearch =
      item.title.includes(search) ||
      item.meta.includes(search) ||
      item.description.includes(search);
    return matchesCat && matchesSearch;
  });

  return (
    <div
      className="flex min-h-screen flex-col font-sans"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <Header />

      <main className="section flex-grow pt-32 pb-24 px-6">
        <div className="container">
          <div className="mb-10 text-center">
            <h1
              className="mb-4 font-extrabold"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
              }}
            >
              معرض الأعمال والمنشورات
            </h1>
            <p
              className="mx-auto max-w-[60ch] font-light"
              style={{ color: "var(--ink-2)" }}
            >
              نستعرض هنا نتاج أقسام jemo labs من دراسات، برمجيات، وتصاميم
            </p>
          </div>

          <div className="mx-auto mb-12 flex max-w-[900px] flex-col gap-6">
            <div className="mx-auto relative w-full max-w-md">
              <Search
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "var(--ink-2)" }}
              />
              <input
                type="text"
                placeholder="البحث في الأعمال والمنشورات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                dir="rtl"
                className="w-full rounded-full border pr-11 pl-4 py-2.5 text-sm transition-colors focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const active = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                      active ? "" : "cursor-pointer"
                    }`}
                    style={
                      active
                        ? {
                            background: "var(--accent)",
                            color: "var(--bg)",
                            borderColor: "transparent",
                          }
                        : {
                            background: "var(--bg)",
                            color: "var(--ink-2)",
                            borderColor: "var(--line)",
                          }
                    }
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="card--hover cursor-pointer rounded-2xl border p-6 transition-colors"
                  style={{ background: "var(--surface)", borderColor: "var(--line)" }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="rounded-xl border p-3" style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}>
                      <span style={{ color: "var(--accent)" }}>{item.icon}</span>
                    </div>
                    <span className="badge">{CATEGORIES.find((c) => c.id === item.category)?.label}</span>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-bold" style={{ color: "var(--ink)" }}>
                      {item.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed font-light" style={{ color: "var(--ink-2)" }}>
                      {item.description}
                    </p>
                    <div
                      className="flex items-center justify-between border-t pt-3 text-xs"
                      style={{ borderColor: "var(--line)", color: "var(--ink-2)" }}
                    >
                      <span>{item.meta}</span>
                      <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--accent)" }}>
                        تفاصيل
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed py-16 text-center" style={{ borderColor: "var(--line)" }}>
                <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                  لم يتم العثور على أي أعمال تطابق معايير البحث.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          dir="rtl"
        >
          <div
            onClick={() => setSelectedItem(null)}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: "rgba(5,8,7,0.72)" }}
          />

          <div
            className="relative z-10 w-full max-w-lg rounded-2xl border p-6 text-right"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border p-3" style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}>
                  <span style={{ color: "var(--accent)" }}>{selectedItem.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold block" style={{ color: "var(--accent)" }}>
                    {CATEGORIES.find((c) => c.id === selectedItem.category)?.label}
                  </span>
                  <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                    {selectedItem.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg border p-1.5 transition-colors"
                style={{ color: "var(--ink-2)", borderColor: "var(--line)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 space-y-4 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
              <div>
                <span className="mb-1 block text-xs font-semibold" style={{ color: "var(--ink)" }}>
                  الحالة والتاريخ:
                </span>
                <span
                  className="inline-block rounded-md border px-2.5 py-1 text-xs"
                  style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--accent)" }}
                >
                  {selectedItem.meta}
                </span>
              </div>

              <div>
                <span className="mb-1 block text-xs font-semibold" style={{ color: "var(--ink)" }}>
                  وصف العمل / البحث:
                </span>
                <p
                  className="rounded-xl border p-4 text-xs leading-relaxed"
                  style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink)" }}
                >
                  {selectedItem.description}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: "var(--line)" }}>
              <button
                onClick={() => setSelectedItem(null)}
                className="cursor-pointer rounded-xl border px-4 py-2 text-xs font-semibold transition-colors"
                style={{ color: "var(--ink-2)", borderColor: "var(--line)" }}
              >
                إغلاق
              </button>
              <span
                className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                <span>تقديم طلب لهذا القسم</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
