"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Compass,
  CheckCircle2,
  Zap,
  ArrowLeft,
  UserCheck
} from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") || "/dashboard";
  const isFromPublish = redirectPath.startsWith("/publish");
  const { signUpWithEmail, loginAsDemo } = useAuth();

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [domain, setDomain] = useState("أبحاث النظم والأنوية");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signUpWithEmail(email, password, {
      name,
      handle,
      domain,
    });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push(redirectPath);
    }
  };

  const handleDemoLogin = (type: "karkhi" | "tamimi") => {
    loginAsDemo(type);
    router.push(redirectPath);
  };

  return (
    <div className="max-w-lg mx-auto w-full space-y-4">
          {/* Pathway Progress Bar */}
          <div className="p-3 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] text-[#55696a]">
              <span className="font-bold text-[#222f30] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#222f30] text-white flex items-center justify-center text-[10px] font-mono">1</span>
                <span>إنشاء الحساب</span>
              </span>
              <span className="text-[#a1a1aa]">──▶</span>
              <Link href="/publish" className="hover:text-[#222f30] flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#f0f2f0] text-[#55696a] flex items-center justify-center text-[10px] font-mono">2</span>
                <span>نشر البحث</span>
              </Link>
              <span className="text-[#a1a1aa]">──▶</span>
              <Link href="/dashboard" className="hover:text-[#222f30] flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#f0f2f0] text-[#55696a] flex items-center justify-center text-[10px] font-mono">3</span>
                <span>لوحة التحكم</span>
              </Link>
            </div>
          </div>

          {/* Publish Redirect Alert */}
          {isFromPublish && (
            <div className="p-4 rounded-2xl bg-[#f8fdf2] border border-[#cef79e] text-xs text-[#222f30] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مسار نشر وتوثيق البحث المستقل</span>
                </span>
                <Link
                  href="/publish"
                  className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  المتابعة كضيف دون تسجيل ➔
                </Link>
              </div>
              <p className="text-[11px] text-[#445e5f] leading-relaxed">
                أنشئ حساب باحث الآن لربط كائن بحثك تلقائياً باسمك وحفظ أسبقيتك في السجل المفتوح، أو تابع النشر مباشرة كضيف.
              </p>
            </div>
          )}

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-md space-y-6">
            
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-[#f7f7f5] font-mono text-xs uppercase tracking-widest text-[#445e5f]">
                <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
                <span>JOIN THE NETWORK · التسجيل كباحث</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222f30] font-kufi">
                أنشئ ملفك البحثي المستقل
              </h1>
              <p className="text-xs text-[#55696a]">
                انضم لشبكة الباحثين والمهندسين لتوثيق أبحاث عصر "التوليد الفردي الفائق" وحفظ سبقك الفكري.
              </p>
            </div>
            {/* Error */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#a7e26e]" />
                    <span>الاسم الكامل *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. مريم السامرائي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-[#a7e26e]" />
                    <span>المعرف (@handle) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="handle@"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e] dir-ltr text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#a7e26e]" />
                  <span>المجال والاهتمام البحثي الأساسي</span>
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e]"
                >
                  <option value="أبحاث النظم والأنوية">أبحاث النظم والأنوية (Systems & Kernels)</option>
                  <option value="الذكاء الاصطناعي والاستدلال">الذكاء الاصطناعي وتقييم النماذج (AI Reasoning)</option>
                  <option value="حل المعضلات البرمجية العميقة">حل المعضلات البرمجية العميقة (Deep Debugging)</option>
                  <option value="المترجمات ولغات البرمجة">المترجمات ولغات البرمجة (Compilers & Architecture)</option>
                  <option value="الخوارزميات والحوسبة الفائقة">الخوارزميات والحوسبة الفائقة (HPC & Algorithms)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#a7e26e]" />
                  <span>البريد الإلكتروني *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="researcher@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#a7e26e]" />
                  <span>كلمة المرور *</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#f7fdf4] border border-[#cef79e] text-[11px] text-[#3f5456] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#222f30]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ميثاق باحث JEMO:</span>
                </div>
                <p>
                  التسجيل يعني الالتزام بالتحقق البشري الصارم (Proof of Work) وتجنب نشر الهلوسات غير المدققة.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>جارٍ إنشاء الحساب...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>إنشاء حساب باحث والبدء</span>
                  </>
                )}
              </button>
            </form>

            {/* Fast pass divider */}
            <div className="relative border-t border-[#e4e3e3] my-4">
              <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-3 bg-white text-[10px] font-mono text-[#738284] uppercase">
                أو دخول تجريبي سريع
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("karkhi")}
                className="w-full p-2.5 rounded-xl border border-[#cef79e] bg-[#f8fdf2] hover:bg-[#cef79e]/40 transition-all text-right flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#222f30] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>دخول فوري كباحث: عمر الكرخي</span>
                  </div>
                  <p className="text-[10px] text-[#55696a]">باحث ذكاء اصطناعي • انتقال مباشر للمسار</p>
                </div>
                <ArrowLeft className="w-3.5 h-3.5 text-[#222f30] transition-transform group-hover:-translate-x-1" />
              </button>
            </div>

            <div className="pt-2 text-center text-xs text-[#55696a] border-t border-[#e4e3e3]">
              <span>لديك حساب بالفعل؟ </span>
              <Link
                href={redirectPath !== "/dashboard" ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
                className="text-[#222f30] font-bold underline underline-offset-4 hover:text-[#a7e26e]"
              >
                تسجيل الدخول
              </Link>
            </div>

          </div>
        </div>
  );
}

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 sm:py-24 bg-[#f7f7f5] flex items-center justify-center px-4" dir="rtl">
        <Suspense fallback={<div className="text-center font-mono text-xs text-[#738284]">جارٍ التحميل...</div>}>
          <SignupForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
