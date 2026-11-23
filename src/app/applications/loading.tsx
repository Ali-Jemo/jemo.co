import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ApplicationsLoading() {
  return (
    <>
      <Header />
      <main className="bg-[var(--bg)] min-h-screen px-6 pt-40 pb-24" aria-busy="true">
        <p className="text-sm font-mono text-[#3f5456]" role="status">
          جارٍ تحميل مؤشرات الطلبات…
        </p>
        <div className="mt-8 h-12 max-w-md rounded-xl bg-[var(--line)] animate-pulse" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-[var(--line)] animate-pulse" />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
