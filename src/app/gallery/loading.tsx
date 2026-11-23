import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GalleryLoading() {
  return (
    <>
      <Header />
      <main className="bg-[var(--bg)] min-h-screen px-6 pt-40 pb-24" aria-busy="true">
        <p className="text-sm font-mono text-[#3f5456]" role="status">جارٍ تحميل المعرض…</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-white border border-[var(--line)] animate-pulse" />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
