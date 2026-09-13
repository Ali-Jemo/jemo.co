"use client";

import { useState } from "react";
import { Paper } from "@/lib/data/research-data";
import { Download, FileText, Check, X } from "lucide-react";

interface ExportCitationModalProps {
  paper: Paper;
}

export default function ExportCitationModal({ paper }: ExportCitationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportBibtex = () => {
    downloadFile(paper.citation.bibtex, `${paper.slug}.bib`, "application/x-bibtex");
    setDownloadedFormat("BibTeX (.bib)");
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  const handleExportRis = () => {
    const risContent = `TY  - JOUR
TI  - ${paper.titleEn}
${(paper.authors ?? []).map((a: unknown) => `AU  - ${typeof a === "string" ? a : (a as { name?: string })?.name || ""}`).join("\n")}
JO  - JEMO LABS Research Papers
PY  - ${paper.publishDate.slice(0, 4)}
DO  - ${paper.doi ?? ""}
ER  -`;
    downloadFile(risContent, `${paper.slug}.ris`, "application/x-research-info-systems");
    setDownloadedFormat("RIS (.ris)");
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors font-bold"
      >
        <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
        <span>تصدير ملف الاقتباس (.bib / .ris)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--brand)]" />
                <h3 className="font-bold text-base text-[var(--ink-1)]">تصدير ملف الاقتباس الأكاديمي</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--surface)] text-[var(--ink-2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              اختر صيغة الملف المناسبة لبرنامج إدارة المراجع الأكاديمية الخاص بك (Zotero, EndNote, Mendeley):
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExportBibtex}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all font-mono text-xs text-right"
              >
                <div>
                  <div className="font-bold text-[var(--ink-1)]">صيغة BibTeX (.bib)</div>
                  <div className="text-[10px] text-[var(--ink-2)]">مناسبة لـ LaTeX و Zotero</div>
                </div>
                <Download className="w-4 h-4 text-[var(--brand)]" />
              </button>

              <button
                onClick={handleExportRis}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all font-mono text-xs text-right"
              >
                <div>
                  <div className="font-bold text-[var(--ink-1)]">صيغة EndNote / RIS (.ris)</div>
                  <div className="text-[10px] text-[var(--ink-2)]">مناسبة لـ EndNote و Mendeley</div>
                </div>
                <Download className="w-4 h-4 text-[var(--brand)]" />
              </button>
            </div>

            {downloadedFormat && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>تم تنزيل ملف {downloadedFormat} بنجاح!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
