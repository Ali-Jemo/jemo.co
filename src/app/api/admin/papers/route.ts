import { NextRequest, NextResponse } from "next/server";
import { getCustomPapers, saveCustomPaper, deleteCustomPaper } from "@/lib/dynamic-papers";
import { RESEARCH_PAPERS, Paper } from "@/lib/data/research-data";

export async function GET() {
  try {
    const custom = await getCustomPapers();
    // Return custom papers first, followed by static papers
    return NextResponse.json({
      custom,
      all: [...custom, ...RESEARCH_PAPERS],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.abstract || !body.field) {
      return NextResponse.json(
        { error: "العنوان، الملخص، والمجال حقول مطلوبة" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.titleEn
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `paper-${Date.now()}`;

    const id = body.id || `paper-${Date.now()}`;

    const newPaper: Paper = {
      id,
      slug,
      title: body.title,
      titleEn: body.titleEn || body.title,
      abstract: body.abstract,
      authors: Array.isArray(body.authors) && body.authors.length > 0
        ? body.authors
        : [{ name: body.authorName || "Jemo Research Team", slug: "jemo-team", role: "الباحث الرئيسي" }],
      publishDate: body.publishDate || new Date().toISOString().slice(0, 10),
      doi: body.doi || undefined,
      pdfUrl: body.pdfUrl || "#",
      datasetUrl: body.datasetUrl || undefined,
      codeUrl: body.codeUrl || undefined,
      field: body.field,
      labSlug: body.labSlug || "ai-lab",
      keywords: Array.isArray(body.keywords)
        ? body.keywords
        : typeof body.keywords === "string"
        ? body.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : ["Research", body.field],
      citation: {
        bibtex:
          body.citation?.bibtex ||
          `@article{${slug}${new Date().getFullYear()},\n  title={${body.titleEn || body.title}},\n  author={${body.authorName || "Jemo"}},\n  year={${new Date().getFullYear()}}\n}`,
        apa:
          body.citation?.apa ||
          `${body.authorName || "Jemo Team"} (${new Date().getFullYear()}). ${body.titleEn || body.title}. JEMO LABS Research.`,
      },
      featured: Boolean(body.featured),
    };
    const updated = await saveCustomPaper(newPaper);
    return NextResponse.json({ ok: true, paper: newPaper, totalCustom: updated.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف الورقة مطلوب" }, { status: 400 });
    }
    const updated = await deleteCustomPaper(id);
    return NextResponse.json({ ok: true, remaining: updated.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
