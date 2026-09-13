import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCardSkeleton from "@/components/AuthCardSkeleton";

export default function SignInLoading() {
  return (
    <>
      <Header />
      <main className="flex-1 flex min-h-[calc(100vh-160px)] items-center justify-center py-12 sm:py-16 px-4 bg-[var(--bg)]">
        <div className="w-full max-w-[420px] min-h-[510px] flex items-center justify-center">
          <AuthCardSkeleton type="sign-in" />
        </div>
      </main>
      <Footer />
    </>
  );
}
