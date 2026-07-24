import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import { OPEN_SOURCE_REPOS } from "@/lib/data/research-data";
import { GithubIcon } from "@/components/Icons";
import { FolderGit2, Star, GitFork, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "المصادر المفتوحة | JEMO LABS",
  description: "مستودعات JEMO LABS مفتوحة المصدر، الرخص، والمساهمين.",
};

export default function OpenSourcePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>المعرفة للجميع</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">المصادر المفتوحة (Open Source)</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              كافة المنظومات، النوى التشغيلية، ومجموعات البيانات التي نطورها مرخصة برخص مفتوحة ومتاحة للجميع.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {OPEN_SOURCE_REPOS.map((repo) => (
              <Card key={repo.name} hover className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-bold text-[var(--ink-1)] flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-[var(--brand)]" />
                      {repo.name}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)]">
                      {repo.language}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-6 font-mono dir-ltr text-left">
                    {repo.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[var(--ink-2)] mb-6">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-[var(--brand)]" />
                      {repo.forks}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      {repo.license}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-xs font-bold shadow-sm hover:opacity-90 transition-all"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>عرض المستودع على GitHub</span>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 text-center max-w-2xl mx-auto space-y-4">
            <Heart className="w-8 h-8 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold text-[var(--ink-1)]">كيف تساهم معنا؟</h2>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed">
              نرحب بمساهمات جميع المطورين والباحثين! يمكنك فتح Issue، التقديم بـ Pull Request، أو تحسين التوثيق العلمي.
            </p>
            <a
              href="https://github.com/Ali-Jemo/ziqa-kernal"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2.5 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all"
            >
              اقرأ دليل المساهمة (CONTRIBUTING.md)
            </a>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
