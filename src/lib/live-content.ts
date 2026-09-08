import { 
  RESEARCH_PAPERS, 
  RESEARCH_PROJECTS, 
  NEWS_ITEMS, 
  Paper, 
  Project, 
  NewsItem 
} from "@/lib/data/research-data";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://okekfsfyydajyfarnzra.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWtmc2Z5eWRhanlmYXJuenJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg1MTk1OSwiZXhwIjoyMDcyNDI3OTU5fQ.5RRxb3dLOyq9C1OwB88Sh4qNDJzk2SxD5ZTRGsQUm9U";

interface TemplateRow {
  key: string;
  responses: unknown[];
}

export async function getLiveResearchPapers(): Promise<Paper[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/templates?key=in.(published_papers,deleted_paper_ids)&select=key,responses`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return RESEARCH_PAPERS;

    const rows = (await res.json()) as TemplateRow[];
    const papersRow = rows.find((r) => r.key === "published_papers");
    const deletedRow = rows.find((r) => r.key === "deleted_paper_ids");

    const customPapers = (papersRow && Array.isArray(papersRow.responses))
      ? (papersRow.responses as Paper[])
      : [];

    const deletedIds = new Set<string>(
      deletedRow && Array.isArray(deletedRow.responses)
        ? (deletedRow.responses as string[])
        : []
    );

    // Merge: custom papers first, then default papers
    const combined = [...customPapers, ...RESEARCH_PAPERS];
    
    // De-duplicate by ID / slug and filter out deleted
    const seen = new Set<string>();
    const result: Paper[] = [];

    for (const p of combined) {
      if (!p || !p.id) continue;
      if (deletedIds.has(p.id) || (p.slug && deletedIds.has(p.slug))) continue;
      if (!seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }

    return result;
  } catch (err) {
    console.error("Live papers fetch error, falling back to static:", err);
    return RESEARCH_PAPERS;
  }
}

export async function getLiveProjects(): Promise<Project[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/templates?key=in.(research_projects,deleted_project_ids)&select=key,responses`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return RESEARCH_PROJECTS;

    const rows = (await res.json()) as TemplateRow[];
    const projRow = rows.find((r) => r.key === "research_projects");
    const deletedRow = rows.find((r) => r.key === "deleted_project_ids");

    const customProjects = (projRow && Array.isArray(projRow.responses))
      ? (projRow.responses as Project[])
      : [];

    const deletedIds = new Set<string>(
      deletedRow && Array.isArray(deletedRow.responses)
        ? (deletedRow.responses as string[])
        : []
    );

    const combined = [...customProjects, ...RESEARCH_PROJECTS];
    const seen = new Set<string>();
    const result: Project[] = [];

    for (const p of combined) {
      if (!p || !p.id) continue;
      if (deletedIds.has(p.id)) continue;
      if (!seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }

    return result;
  } catch (err) {
    return RESEARCH_PROJECTS;
  }
}

export async function getLiveNews(): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/templates?key=in.(news_items,deleted_news_ids)&select=key,responses`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return NEWS_ITEMS;

    const rows = (await res.json()) as TemplateRow[];
    const newsRow = rows.find((r) => r.key === "news_items");
    const deletedRow = rows.find((r) => r.key === "deleted_news_ids");

    const customNews = (newsRow && Array.isArray(newsRow.responses))
      ? (newsRow.responses as NewsItem[])
      : [];

    const deletedIds = new Set<string>(
      deletedRow && Array.isArray(deletedRow.responses)
        ? (deletedRow.responses as string[])
        : []
    );

    const combined = [...customNews, ...NEWS_ITEMS];
    const seen = new Set<string>();
    const result: NewsItem[] = [];

    for (const n of combined) {
      if (!n || !n.id) continue;
      if (deletedIds.has(n.id)) continue;
      if (!seen.has(n.id)) {
        seen.add(n.id);
        result.push(n);
      }
    }

    return result;
  } catch (err) {
    return NEWS_ITEMS;
  }
}
