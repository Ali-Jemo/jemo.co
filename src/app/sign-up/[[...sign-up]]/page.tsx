import type { Metadata } from "next";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCardSkeleton from "@/components/AuthCardSkeleton";
import AuthUnavailable from "@/components/AuthUnavailable";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { isClerkConfigured } from "@/lib/clerk-config";

export const metadata: Metadata = {
  title: "إنشاء حساب باحث | JEMO LABS",
  description: "إنشاء حساب جديد في منصة JEMO LABS للأبحاث والأنظمة السيادية.",
};

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex min-h-[calc(100vh-160px)] items-center justify-center py-12 sm:py-16 px-4 bg-[var(--bg)]">
        <div className="w-full max-w-[420px] min-h-[550px] flex items-center justify-center relative">
          {isClerkConfigured() ? (
            <>
              <ClerkLoading>
                <AuthCardSkeleton type="sign-up" />
              </ClerkLoading>
              <ClerkLoaded>
                <div className="w-full animate-clerk-fade-in">
                  <SignUp
                    path="/sign-up"
                    routing="path"
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/dashboard"
                    appearance={clerkAppearance}
                  />
                </div>
              </ClerkLoaded>
            </>
          ) : (
            <AuthUnavailable
              title="إنشاء الحساب غير مفعّل"
              body="مفتاح Clerk غير مضبوط في بناء الإنتاج. لن تظهر بطاقة فارغة. بعد ضبط المفاتيح أعد بناء الموقع."
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
