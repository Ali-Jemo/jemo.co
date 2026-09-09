"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  UserCheck, 
  Lock, 
  Mail,
  Zap
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") || "/dashboard";

  const { loginWithEmail, loginAsDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginWithEmail(email, password);
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
    <div className="max-w-md mx-auto w-full">
      {/* Main Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-md space-y-6">
        
        {/* Top Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-[#f7f7f5] font-mono text-xs uppercase tracking-widest text-[#445e5f]">
            <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
            <span>RESEARCHER PORTAL · بوابة الباحث</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222f30] font-kufi">
            تسجيل الدخول للمنصة
          </h1>
          <p className="text-xs text-[#55696a]">
            أدر أبحاثك، وثّق إعادات التجارب (Replications)، واحفظ سبَقك الفكري.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#a7e26e]" />
              <span>البريد الإلكتروني</span>
            </label>
            <input
              type="email"
              required
              placeholder="researcher@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#a7e26e]" />
              <span>كلمة المرور</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>جارٍ التحقق...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>دخول لحساب الباحث</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative border-t border-[#e4e3e3] my-6">
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-3 bg-white text-[10px] font-mono text-[#738284] uppercase">
            أو اختر تجربة فورية
          </span>
        </div>

        {/* Demo Researcher Fast-Pass */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("karkhi")}
            className="w-full p-3 rounded-xl border border-[#cef79e] bg-[#f8fdf2] hover:bg-[#cef79e]/40 transition-all text-right flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#222f30] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>دخول تجريبي كباحث: عمر الكرخي</span>
              </div>
              <p className="text-[10px] text-[#55696a]">باحث ذكاء اصطناعي • 14 إعادة تجربة محققة</p>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-[#222f30] transition-transform group-hover:-translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("tamimi")}
            className="w-full p-3 rounded-xl border border-[#e4e3e3] bg-[#f9faf9] hover:bg-zinc-100 transition-all text-right flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#222f30] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>دخول تجريبي كمهندس: م. زيد التميمي</span>
              </div>
              <p className="text-[10px] text-[#55696a]">مهندس نظم • 8 حلول برمجية موثقة</p>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-[#222f30] transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        {/* Footer Link to Signup */}
        <div className="pt-2 text-center text-xs text-[#55696a] border-t border-[#e4e3e3]">
          <span>ليس لديك حساب باحث؟ </span>
          <Link href="/signup" className="text-[#222f30] font-bold underline underline-offset-4 hover:text-[#a7e26e]">
            سجّل الآن كباحث مستقل
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 sm:py-24 bg-[#f7f7f5] flex items-center justify-center px-4" dir="rtl">
        <Suspense fallback={<div className="text-center font-mono text-xs text-[#738284]">جارٍ التحميل...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
