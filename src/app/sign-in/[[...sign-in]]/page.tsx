import type { Metadata } from "next";
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCardSkeleton from "@/components/AuthCardSkeleton";
import AuthUnavailable from "@/components/AuthUnavailable";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { isClerkConfigured } from "@/lib/clerk-config";

export const metadata: Metadata = {
  title: "تسجيل الدخول | JEMO LABS",
  description: "تسجيل الدخول إلى منصة JEMO LABS للأبحاث والأنظمة السيادية.",
};

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex min-h-[calc(100vh-160px)] items-center justify-center py-12 sm:py-16 px-4 bg-[var(--bg)]">
        <div className="w-full max-w-[420px] min-h-[510px] flex items-center justify-center relative">
          {isClerkConfigured() ? (
          <>
          <ClerkLoading>
            <AuthCardSkeleton type="sign-in" />
          </ClerkLoading>
          <ClerkLoaded>
            <div className="w-full animate-clerk-fade-in">
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            </div>
          </ClerkLoaded>
          </>
          ) : (
            <AuthUnavailable
              title="تسجيل الدخول غير مفعّل"
              body="مفتاح Clerk غير مضبوط في بناء الإنتاج. لن تظهر بطاقة فارغة. بعد ضبط NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY و CLERK_SECRET_KEY أعد بناء الموقع."
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
