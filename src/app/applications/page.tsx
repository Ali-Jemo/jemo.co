import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase";
import ApplicationsClient, { type ApplicationsInitial } from "./ApplicationsClient";

export const metadata: Metadata = {
  title: "القبولات والطلبات",
  description: "مؤشرات شفافة حول طلبات الانضمام إلى فرع jemo البحثي — أرقام فقط دون بيانات شخصية.",
};

export const dynamic = "force-dynamic";

async function loadApplications(): Promise<ApplicationsInitial> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), 4000);
  });
  try {
    const stats = await Promise.race([
      (async () => {
        const db = supabaseAdmin();
        const countOf = async (status?: string) => {
          let query = db.from("applications").select("id", { count: "exact", head: true });
          if (status) query = query.eq("status", status);
          const { count, error } = await query;
          if (error) throw new Error(error.message);
          return count ?? 0;
        };
        const [total, pending, accepted, rejected] = await Promise.all([
          countOf(),
          countOf("pending"),
          countOf("accepted"),
          countOf("rejected"),
        ]);
        return { total, pending, accepted, rejected, updatedAt: new Date().toISOString() };
      })(),
      timeout,
    ]);
    return { status: "ready", stats };
  } catch {
    return { status: "unavailable" };
  }
}

export default async function ApplicationsPage() {
  const initial = await loadApplications();
  return (
    <>
      <Header />
      <main>
        <ApplicationsClient initial={initial} />
      </main>
      <Footer />
    </>
  );
}
