"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CheckCircle2
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

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
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-16 sm:py-24 bg-[#f7f7f5] flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-lg mx-auto w-full">
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

            <div className="pt-2 text-center text-xs text-[#55696a] border-t border-[#e4e3e3]">
              <span>لديك حساب بالفعل؟ </span>
              <Link href="/login" className="text-[#222f30] font-bold underline underline-offset-4 hover:text-[#a7e26e]">
                تسجيل الدخول
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
