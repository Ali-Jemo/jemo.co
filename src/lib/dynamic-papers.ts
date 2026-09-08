import { supabaseAdmin } from "@/lib/supabase";
import { Paper } from "@/lib/data/research-data";

const PAPERS_KEY = "published_papers";
const SITE_INFO_KEY = "site_info";

export async function getCustomPapers(): Promise<Paper[]> {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("templates")
      .select("responses")
      .eq("key", PAPERS_KEY)
      .maybeSingle();

    if (error || !data || !Array.isArray(data.responses)) {
      return [];
    }

    return data.responses as Paper[];
  } catch (err) {
    console.error("Error fetching custom papers:", err);
    return [];
  }
}

export async function saveCustomPaper(paper: Paper): Promise<Paper[]> {
  const db = supabaseAdmin();
  const existing = await getCustomPapers();
  
  // Remove if already exists with same ID or slug, then prepend
  const updated = [paper, ...existing.filter((p) => p.id !== paper.id && p.slug !== paper.slug)];

  const { data: existingRow } = await db
    .from("templates")
    .select("id")
    .eq("key", PAPERS_KEY)
    .maybeSingle();

  if (existingRow?.id) {
    const { error } = await db
      .from("templates")
      .update({ responses: updated, updated_at: new Date().toISOString() })
      .eq("id", existingRow.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await db
      .from("templates")
      .insert({ key: PAPERS_KEY, responses: updated });
    if (error) throw new Error(error.message);
  }

  return updated;
}

export async function deleteCustomPaper(paperIdOrSlug: string): Promise<Paper[]> {
  const db = supabaseAdmin();
  const existing = await getCustomPapers();
  const updated = existing.filter((p) => p.id !== paperIdOrSlug && p.slug !== paperIdOrSlug);

  const { data: existingRow } = await db
    .from("templates")
    .select("id")
    .eq("key", PAPERS_KEY)
    .maybeSingle();

  if (existingRow?.id) {
    const { error } = await db
      .from("templates")
      .update({ responses: updated, updated_at: new Date().toISOString() })
      .eq("id", existingRow.id);
    if (error) throw new Error(error.message);
  }

  return updated;
}

export interface SiteInfoData {
  announcement?: string;
  announcementEn?: string;
  activeStatus?: string;
  focusHighlight?: string;
  contactEmail?: string;
  updatedAt?: string;
}

export async function getDynamicSiteInfo(): Promise<SiteInfoData> {
  try {
    const db = supabaseAdmin();
    const { data } = await db
      .from("templates")
      .select("responses")
      .eq("key", SITE_INFO_KEY)
      .maybeSingle();

    if (data && Array.isArray(data.responses) && data.responses[0]) {
      return data.responses[0] as SiteInfoData;
    }
  } catch (e) {
    console.error("Error reading site info:", e);
  }

  return {
    announcement: "مختبر JEMO LABS يطلق برامج الأبحاث المفتوحة للعام 2026",
    announcementEn: "JEMO LABS launches open research programs for 2026",
    activeStatus: "نشط — استلام المشاركات البحثية مفتوح",
    focusHighlight: "الذكاء الاصطناعي، الحوسبة الفائقة، والأنظمة الموزعة",
    contactEmail: "research@jemo.co",
    updatedAt: new Date().toISOString(),
  };
}

export async function saveDynamicSiteInfo(info: SiteInfoData): Promise<SiteInfoData> {
  const db = supabaseAdmin();
  const payload = { ...info, updatedAt: new Date().toISOString() };

  const { data: existingRow } = await db
    .from("templates")
    .select("id")
    .eq("key", SITE_INFO_KEY)
    .maybeSingle();

  if (existingRow?.id) {
    await db
      .from("templates")
      .update({ responses: [payload], updated_at: new Date().toISOString() })
      .eq("id", existingRow.id);
  } else {
    await db
      .from("templates")
      .insert({ key: SITE_INFO_KEY, responses: [payload] });
  }

  return payload;
}
