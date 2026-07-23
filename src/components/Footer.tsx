import Link from "next/link";
import AnimatedUnderline from "@/components/AnimatedUnderline";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] pt-12 pb-8 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-mono font-bold text-lg mb-4">
              <span className="text-[var(--brand)]">jemo</span>
              <span>labs</span>
            </Link>
            <p className="text-sm max-w-sm">
              منظومة بحثية وتقنية غير ربحية تابعة لـ LXD Co. نجمع العقول المبدعة ونبني الأبحاث والمنصات المفتوحة.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">روابط</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/about"><AnimatedUnderline className="hover:text-[var(--brand)]">من نحن</AnimatedUnderline></Link></li>
              <li><Link href="/gallery"><AnimatedUnderline className="hover:text-[var(--brand)]">المعرض</AnimatedUnderline></Link></li>
              <li><Link href="/applications"><AnimatedUnderline className="hover:text-[var(--brand)]">الطلبات</AnimatedUnderline></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">قانوني</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/terms"><AnimatedUnderline className="hover:text-[var(--brand)]">الشروط والأحكام</AnimatedUnderline></Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--line)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-2)]">
          <p>© {new Date().getFullYear()} Jemo Labs. جميع الحقوق محفوظة.</p>
          <div className="font-mono text-[var(--brand)]">Mesopotamia • Iraq</div>
        </div>
      </div>
    </footer>
  );
}