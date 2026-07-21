"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Layers,
  ChevronDown,
  Sparkles,
  Info
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Application {
  id: string;
  name: string;
  date: string;
  section: string;
  status: "accepted" | "pending" | "rejected";
}

const INITIAL_APPS: Application[] = [
  {
    id: "app-1",
    name: "أحمد محمد",
    date: "15 يوليو 2026",
    section: "المحتوى والألعاب",
    status: "accepted"
  },
  {
    id: "app-2",
    name: "علي حسن",
    date: "18 يوليو 2026",
    section: "التقنية والبرمجة",
    status: "pending"
  },
  {
    id: "app-3",
    name: "سارة خالد",
    date: "19 يوليو 2026",
    section: "التصميم والهوية",
    status: "pending"
  },
  {
    id: "app-4",
    name: "محمد عبدالله",
    date: "10 يوليو 2026",
    section: "الأبحاث العلمية",
    status: "accepted"
  },
  {
    id: "app-5",
    name: "زين العابدين",
    date: "12 يوليو 2026",
    section: "المحتوى والألعاب",
    status: "rejected"
  },
  {
    id: "app-6",
    name: "ليلى أحمد",
    date: "20 يوليو 2026",
    section: "التقنية والبرمجة",
    status: "pending"
  }
];

const SECTIONS = [
  "المحتوى والألعاب",
  "التقنية والبرمجة",
  "التصميم والهوية",
  "الأبحاث العلمية"
];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Form State
  const [formName, setFormName] = useState("");
  const [formSection, setFormSection] = useState(SECTIONS[0]);
  const [submitting, setSubmitting] = useState(false);


  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSubmitting(true);
    
    setTimeout(() => {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        name: formName.trim(),
        date: "اليوم",
        section: formSection,
        status: "pending"
      };
      
      setApps(prev => [newApp, ...prev]);
      setFormName("");
      setSubmitting(false);
      setShowApplyModal(false);

      // Simulate a review update after 8 seconds
      setTimeout(() => {
        setApps(currentApps => 
          currentApps.map(app => 
            app.id === newApp.id 
              ? { ...app, status: Math.random() > 0.3 ? "accepted" : "rejected" }
              : app
          )
        );
      }, 8000);

    }, 1000);
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.section.includes(search);
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black text-off flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-24 px-6 max-w-[1000px] mx-auto w-full">
        {/* Title & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-olive mb-4 font-decoy tracking-wide">
              لوحة القبولات
            </h1>
            <p className="text-grey flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-olive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-olive"></span>
              </span>
              تحديث مباشر — يتم مراجعة وتحديث الطلبات فوراً
            </p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-olive text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-olive-d hover:text-off transition-all cursor-pointer shadow-[0_0_15px_rgba(107,123,58,0.2)] hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>تقديم طلب انضمام</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-grey w-5 h-5" />
            <input
              type="text"
              placeholder="البحث بالاسم أو القسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-olive/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 bg-white/5 border border-white/10 p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {(["all", "pending", "accepted", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedStatus === status
                    ? "bg-olive text-black font-bold"
                    : "text-grey hover:text-off"
                }`}
              >
                {status === "all" && "الكل"}
                {status === "pending" && "قيد المراجعة"}
                {status === "accepted" && "مقبول"}
                {status === "rejected" && "مرفوض"}
              </button>
            ))}
          </div>
        </div>

        {/* Live status info notice */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex gap-3 text-sm text-grey">
          <Info className="w-5 h-5 text-olive shrink-0 mt-0.5" />
          <p>
            يمكنك محاكاة النظام بتقديم طلب جديد. سيظهر الطلب مباشرة بحالة <strong>قيد المراجعة</strong>، وبعد ثوانٍ معدودة سيقوم النظام الآلي بتحديث حالته تلقائياً إما بالقبول أو الرفض.
          </p>
        </div>

        {/* List of Applications */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key={app.id}
                  className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-olive">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-off text-lg">{app.name}</h3>
                      <p className="text-xs text-grey mt-1">قُدِّم في {app.date}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-semibold px-3 py-1.5 bg-white/5 border border-white/10 text-grey rounded-full flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {app.section}
                    </span>

                    {app.status === "accepted" && (
                      <span className="text-xs font-bold px-3 py-1.5 bg-olive/10 border border-olive/30 text-olive rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                        مقبول
                      </span>
                    )}

                    {app.status === "pending" && (
                      <span className="text-xs font-bold px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                        قيد المراجعة
                      </span>
                    )}

                    {app.status === "rejected" && (
                      <span className="text-xs font-bold px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        مرفوض
                      </span>
                    )}
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 border border-dashed border-white/10 rounded-xl"
              >
                <p className="text-grey">لم يتم العثور على أي طلبات تطابق معايير البحث.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md relative z-10 text-right"
            >
              <h2 className="text-2xl font-bold text-olive mb-4 flex items-center gap-2 justify-end">
                <span>تقديم طلب انضمام</span>
                <Sparkles className="w-6 h-6 text-olive" />
              </h2>
              <p className="text-sm text-grey mb-6">أدخل البيانات التالية لمحاكاة عملية تقديم ودراسة طلبات الانضمام.</p>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-grey mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-olive/50 text-off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-grey mb-2">القسم المطلوب</label>
                  <div className="relative">
                    <select
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-olive/50 text-off appearance-none cursor-pointer"
                    >
                      {SECTIONS.map((sec) => (
                        <option key={sec} value={sec} className="bg-black text-off">
                          {sec}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-3 justify-start pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-grey hover:text-off text-sm font-medium transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-olive text-black font-semibold text-sm hover:bg-olive-d hover:text-off transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
}
