import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/footer-bg-astronomy.png"
          alt="Footer Background"
          fill
          className="object-cover opacity-100 filter brightness-150 contrast-125"
        />
        {/* Vignette Overlays for readability - highly reduced for maximum visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-30" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-right">
          <div className="sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <div dir="ltr" className="text-2xl font-bold font-kufi flex justify-end gap-1.5">
                <span className="text-gradient">jemo</span>
                <span className="font-mono text-white/80">labs</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed font-light text-white/70">
              مؤسسة بحثية وتقنية غير ربحية تابعة لـ LXD Co. نجمع العقول المبدعة ونبني الأبحاث والمنصات المفتوحة.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold mb-3 tracking-wide text-white font-heading">الأقسام التخصصية</div>
            <ul className="space-y-2 text-xs text-white/65">
              <li><Link href="/apply" className="hover:text-[var(--accent)] transition-colors">الأبحاث العلمية</Link></li>
              <li><Link href="/apply" className="hover:text-[var(--accent)] transition-colors">التقنية والبرمجة</Link></li>
              <li><Link href="/apply" className="hover:text-[var(--accent)] transition-colors">التصميم والهوية</Link></li>
              <li><Link href="/apply" className="hover:text-[var(--accent)] transition-colors">المحتوى والألعاب</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold mb-3 tracking-wide text-white font-heading">المنظومة</div>
            <ul className="space-y-2 text-xs text-white/65">
              <li><Link href="/gallery" className="hover:text-[var(--accent)] transition-colors">معرض الأعمال</Link></li>
              <li><Link href="/applications" className="hover:text-[var(--accent)] transition-colors">سجل القبولات الشفاف</Link></li>
              <li><Link href="/apply" className="hover:text-[var(--accent)] transition-colors">تقديم طلب جديد</Link></li>
              <li><a href="/#faq" className="hover:text-[var(--accent)] transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold mb-3 tracking-wide text-white font-heading">التواصل والقنوات</div>
            <ul className="space-y-2 text-xs text-white/65">
              <li><Link href="https://t.me/jemo_channel" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">قناة التليجرام الرسمية</Link></li>
              <li><Link href="#" className="hover:text-[var(--accent)] transition-colors">قناة يوتيوب</Link></li>
              <li><Link href="https://lxds.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">LXD Co. الرئيسي</Link></li>
            </ul>
          </div>
        </div>

         <div className="py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p>© 2026 <span dir="ltr" className="inline-block">jemo labs</span> · جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 text-[11px]">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">الشروط والأحكام</Link>
            <span aria-hidden="true">•</span>
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">الخصوصية والشفافية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
