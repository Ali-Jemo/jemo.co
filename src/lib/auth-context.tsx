"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import type { Paper } from "@/lib/data/research-data";
import { useUser, useClerk } from "@clerk/nextjs";

export interface ResearcherProfile {
  id: string;
  email: string;
  name: string;
  handle: string;
  role: string;
  domain: string;
  avatar: string;
  researchId: string;
  isDemo?: boolean;
  isAdmin?: boolean;
  institution?: string;
  bio?: string;
  githubHandle?: string;
  orcidId?: string;
  scholarUrl?: string;
  stats: {
    publishedCount: number;
    replicationsCount: number;
    contributionsCount: number;
    evidenceScore: number;
  };
}

export interface AuthResult {
  error?: string;
}

const DEMO_PROFILES: Record<string, ResearcherProfile> = {
  karkhi: {
    id: "demo-ali-jemo",
    email: "ali@jemo.co",
    name: "علي حسين هادي (Jemo)",
    handle: "@Ali_Jemo",
    role: "مهندس أنظمة ومطور نواة ZiqaKernel • Systems & AI Architect",
    domain: "هندسة النوى، أنظمة التشغيل، والذكاء الاصطناعي السيادي",
    avatar: "/jemo-logo.svg",
    researchId: "JEMO-RES-0001",
    isDemo: true,
    institution: "JEMO LABS / Ziqa Kernel Project",
    bio: "مهندس أنظمة عراقي ومطور نواة ZiqaKernel ونظام Axiq-IQ. يركز على الأنظمة منخفضة المستوى (Rust، C، Linux Kernel)، معمارية أنظمة التشغيل، ومبادرات الذكاء الاصطناعي والسيادة التقنية في العراق.",
    githubHandle: "https://github.com/Ali-Jemo",
    stats: {
      publishedCount: 12,
      replicationsCount: 38,
      contributionsCount: 24,
      evidenceScore: 98,
    },
  },
  jemo: {
    id: "demo-ali-jemo",
    email: "ali@jemo.co",
    name: "علي حسين هادي (Jemo)",
    handle: "@Ali_Jemo",
    role: "مهندس أنظمة ومطور نواة ZiqaKernel • Systems & AI Architect",
    domain: "هندسة النوى، أنظمة التشغيل، والذكاء الاصطناعي السيادي",
    avatar: "/jemo-logo.svg",
    researchId: "JEMO-RES-0001",
    isDemo: true,
    institution: "JEMO LABS / Ziqa Kernel Project",
    bio: "مهندس أنظمة عراقي ومطور نواة ZiqaKernel ونظام Axiq-IQ. يركز على الأنظمة منخفضة المستوى (Rust، C، Linux Kernel)، معمارية أنظمة التشغيل، ومبادرات الذكاء الاصطناعي والسيادة التقنية في العراق.",
    githubHandle: "https://github.com/Ali-Jemo",
    stats: {
      publishedCount: 12,
      replicationsCount: 38,
      contributionsCount: 24,
      evidenceScore: 98,
    },
  },
  tamimi: {
    id: "demo-axiq-team",
    email: "axiq@jemo.co",
    name: "فريق Axiq للذكاء الاصطناعي",
    handle: "@Axiq_Team",
    role: "فريق شبابي تقني • Voluntary AI & Systems Team",
    domain: "الذكاء الاصطناعي، وكلاء البرمجة، والأنظمة السيادية",
    avatar: "/jemo-logo.svg",
    researchId: "JEMO-RES-0002",
    isDemo: true,
    institution: "مبادرة Axiq العراقية",
    bio: "فريق تطوعي شبابي في العراق لتعلم وتطبيق ونشر تقنيات الذكاء الاصطناعي عملياً وبناء المبادرات التقنية المفتوحة.",
    githubHandle: "https://github.com/Ali-Jemo",
    stats: {
      publishedCount: 4,
      replicationsCount: 12,
      contributionsCount: 18,
      evidenceScore: 95,
    },
  },
};

interface AuthContextType {
  user: User | null;
  profile: ResearcherProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<AuthResult>;
  signUpWithEmail: (
    email: string,
    pass: string,
    meta: { name: string; handle: string; domain?: string }
  ) => Promise<AuthResult>;
  loginAsDemo: (type?: "karkhi" | "tamimi") => void;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<ResearcherProfile>) => void;
  publishedPapers: Paper[];
  publishPaper: (paper: Partial<Paper>) => Paper;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = "jemo_demo_researcher_profile";
const PAPERS_STORAGE_KEY = "jemo_user_published_papers";
const EMPTY_PAPERS: Paper[] = [];
let cachedRawPapers: string | null = null;
let cachedParsedPapers: Paper[] = [];

function subscribeToPapers(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("jemo_papers_updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("jemo_papers_updated", callback);
  };
}

function getPapersSnapshot(): Paper[] {
  try {
    const raw = localStorage.getItem(PAPERS_STORAGE_KEY);
    if (raw !== cachedRawPapers) {
      cachedRawPapers = raw;
      cachedParsedPapers = raw ? (JSON.parse(raw) as Paper[]) : [];
    }
  } catch {
    // ignore
  }
  return cachedParsedPapers;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const clerk = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const publishedPapers = useSyncExternalStore(
    subscribeToPapers,
    getPapersSnapshot,
    () => EMPTY_PAPERS
  );
  // Sync session state from Clerk, demo session, or Supabase
  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      if (!clerk.isLoaded) {
        return;
      }

      // 1. Clerk Authenticated User (Highest Priority)
      if (clerk.isSignedIn && clerk.user) {
        const u = clerk.user;
        // A real Clerk session supersedes any stale demo session: drop it so
        // a later Clerk sign-out (via <UserButton/>, which bypasses logout())
        // lands on a clean logged-out state instead of resurrecting demo.
        try {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        } catch {
          // ignore
        }
        const email = u.primaryEmailAddress?.emailAddress || u.emailAddresses?.[0]?.emailAddress || "";
        // Authorization is the Clerk role claim only. Email and username are
        // user-visible, so neither may grant admin — the server enforces the
        // same rule through isAdminUser().
        const isSuperAdmin = u.publicMetadata?.role === "admin";

        const name =
          u.fullName ||
          [u.firstName, u.lastName].filter(Boolean).join(" ") ||
          (isSuperAdmin ? "مدير النظام" : (u.username ? `@${u.username}` : (email ? email.split("@")[0] : "باحث مستقل")));

        const handle = u.username
          ? (u.username.startsWith("@") ? u.username : `@${u.username}`)
          : (email ? `@${email.split("@")[0]}` : "@researcher");

        const role =
          (u.publicMetadata?.role as string) ||
          (isSuperAdmin
            ? "مدير النظام • System Administrator"
            : "باحث مستقل • Independent Researcher");

        const domain =
          (u.publicMetadata?.domain as string) ||
          (isSuperAdmin
            ? "إدارة المنظومة والأنظمة السيادية"
            : "أبحاث النظم والذكاء الاصطناعي");

        const avatar = u.imageUrl || "/jemo-logo.svg";

        const researchId =
          (u.publicMetadata?.researchId as string) ||
          (isSuperAdmin ? "JEMO-ADMIN-0001" : `JEMO-RES-${u.id.replace(/^user_/, "").slice(0, 4).toUpperCase()}`);

        // Check stored profile extensions
        let extProfile: Partial<ResearcherProfile> = {};
        try {
          const rawExt = localStorage.getItem(`jemo_profile_ext_${u.id}`);
          if (rawExt) extProfile = JSON.parse(rawExt);
        } catch {
          // ignore
        }

        if (active) {
          setProfile({
            id: u.id,
            email,
            name: extProfile.name || name,
            handle: extProfile.handle || handle,
            role: extProfile.role || role,
            domain: extProfile.domain || domain,
            avatar,
            researchId,
            isDemo: false,
            isAdmin: isSuperAdmin,
            bio: extProfile.bio || (isSuperAdmin ? "إدارة المنظومة والإشراف على مشاريع البحث والأنظمة." : "باحث مستقل يستكشف حدود المعرفة والاستدلال الرياضي والأنظمة."),
            institution: extProfile.institution || (isSuperAdmin ? "JEMO LABS" : "مستقل / Independent"),
            githubHandle: extProfile.githubHandle || (u.username ? `https://github.com/${u.username}` : ""),
            orcidId: extProfile.orcidId || "",
            scholarUrl: extProfile.scholarUrl || "",
            stats: {
              publishedCount: extProfile.stats?.publishedCount ?? (isSuperAdmin ? 3 : 1),
              replicationsCount: extProfile.stats?.replicationsCount ?? (isSuperAdmin ? 18 : 4),
              contributionsCount: extProfile.stats?.contributionsCount ?? (isSuperAdmin ? 14 : 3),
              evidenceScore: extProfile.stats?.evidenceScore ?? (isSuperAdmin ? 99 : 92),
            },
          });
          setLoading(false);
        }
        return;
      }

      // 2. Local Demo Profile
      try {
        const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (storedDemo) {
          const parsed = JSON.parse(storedDemo) as ResearcherProfile;
          if (active) {
            setProfile(parsed);
            setLoading(false);
          }
          return;
        }
      } catch {
        // ignore
      }

      // 3. Fallback: Supabase Session
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!active) return;
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          setUser(session.user);
          setProfile({
            id: session.user.id,
            email: session.user.email || "",
            name: meta.name || meta.full_name || session.user.email?.split("@")[0] || "باحث مستقل",
            handle: meta.handle || `@${session.user.email?.split("@")[0] || "researcher"}`,
            role: meta.role || "باحث مستقل • Independent Researcher",
            domain: meta.domain || "أبحاث النظم والذكاء الاصطناعي",
            avatar: meta.avatar || "/jemo-logo.svg",
            researchId: `JEMO-RES-${session.user.id.slice(0, 4).toUpperCase()}`,
            isDemo: false,
            stats: {
              publishedCount: 1,
              replicationsCount: 4,
              contributionsCount: 3,
              evidenceScore: 88,
            },
          });
        } else {
          setProfile(null);
          setUser(null);
        }
        setLoading(false);
      } catch {
        if (active) {
          setProfile(null);
          setLoading(false);
        }
      }
    };

    void syncSession();

    const supabase = getSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        if (clerk.isSignedIn) return;
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          setUser(session.user);
          setProfile((prev) => (prev?.isDemo ? prev : {
            id: session.user.id,
            email: session.user.email || "",
            name: meta.name || meta.full_name || session.user.email?.split("@")[0] || "باحث مستقل",
            handle: meta.handle || `@${session.user.email?.split("@")[0] || "researcher"}`,
            role: meta.role || "باحث مستقل • Independent Researcher",
            domain: meta.domain || "أبحاث النظم والذكاء الاصطناعي",
            avatar: meta.avatar || "/jemo-logo.svg",
            researchId: `JEMO-RES-${session.user.id.slice(0, 4).toUpperCase()}`,
            isDemo: false,
            stats: {
              publishedCount: 1,
              replicationsCount: 4,
              contributionsCount: 3,
              evidenceScore: 88,
            },
          }));
        } else {
          const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
          if (!storedDemo && !clerk.isSignedIn) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch {
        // ignore
      }
    });

    return () => {
      active = false;
      try {
        subscription.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, [clerk.isLoaded, clerk.isSignedIn, clerk.user]);

  const loginWithEmail = async (email: string, pass: string): Promise<AuthResult> => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        const meta = data.user.user_metadata || {};
        setProfile({
          id: data.user.id,
          email: data.user.email || "",
          name: meta.name || meta.full_name || data.user.email?.split("@")[0] || "باحث مستقل",
          handle: meta.handle || `@${data.user.email?.split("@")[0] || "researcher"}`,
          role: meta.role || "باحث مستقل • Independent Researcher",
          domain: meta.domain || "أبحاث النظم والذكاء الاصطناعي",
          avatar: meta.avatar || "/jemo-logo.svg",
          researchId: `JEMO-RES-${data.user.id.slice(0, 4).toUpperCase()}`,
          isDemo: false,
          stats: {
            publishedCount: 1,
            replicationsCount: 4,
            contributionsCount: 3,
            evidenceScore: 88,
          },
        });
      }
      return {};
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل تسجيل الدخول";
      return { error: msg };
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    meta: { name: string; handle: string; domain?: string }
  ): Promise<AuthResult> => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            name: meta.name,
            handle: meta.handle.startsWith("@") ? meta.handle : `@${meta.handle}`,
            domain: meta.domain || "أبحاث النظم والذكاء الاصطناعي",
            role: "باحث مستقل • Independent Researcher",
            jemo_opencode_zen_sync: true,
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        setProfile({
          id: data.user.id,
          email: data.user.email || "",
          name: meta.name,
          handle: meta.handle.startsWith("@") ? meta.handle : `@${meta.handle}`,
          role: "باحث مستقل • Independent Researcher",
          domain: meta.domain || "أبحاث النظم والذكاء الاصطناعي",
          avatar: "/jemo-logo.svg",
          researchId: `JEMO-RES-${data.user.id.slice(0, 4).toUpperCase()}`,
          isDemo: false,
          stats: {
            publishedCount: 0,
            replicationsCount: 0,
            contributionsCount: 0,
            evidenceScore: 100,
          },
        });
      }
      return {};
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل إنشاء الحساب";
      return { error: msg };
    }
  };

  const loginAsDemo = (type: "karkhi" | "tamimi" = "karkhi") => {
    const demoProf = DEMO_PROFILES[type] || DEMO_PROFILES.karkhi;
    setProfile(demoProf);
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoProf));
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      if (clerk.isSignedIn) {
        await clerkSignOut();
      }
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
  };

  const updateProfile = (updated: Partial<ResearcherProfile>) => {
    setProfile((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      try {
        if (next.isDemo) {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
        } else if (next.id) {
          localStorage.setItem(`jemo_profile_ext_${next.id}`, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };
  // ponytail: localStorage-backed paper publication, sync to database when multi-user table ready
  const publishPaper = (data: Partial<Paper>): Paper => {
    const firstAuthor = data.authors?.[0] as unknown;
    const authorName = profile?.name || (typeof firstAuthor === "string" ? firstAuthor : (firstAuthor as { name?: string })?.name) || "باحث مستقل";
    const authorHandle = profile?.handle || (profile ? `@${profile.email.split("@")[0]}` : "@guest_researcher");
    const authorSlug = authorHandle.replace(/^@/, "");
    const id = data.id || `JEMO-OBJ-${Date.now().toString().slice(-6)}`;
    const title = data.title || "كائن بحث غير معنون";
    const slug = data.slug || `${title.slice(0, 30).trim().replace(/\s+/g, "-")}-${id.toLowerCase()}`;

    const newPaper: Paper = {
      id,
      slug,
      title,
      titleEn: data.titleEn || title,
      abstract: data.abstract || data.findings || "بحث موثق عبر منصة JEMO بسجل التحقق البشري الصارم.",
      authors: [{ name: authorName, slug: authorSlug, role: profile?.role || "باحث مساهم" }],
      publishDate: new Date().toLocaleDateString("en-CA"),
      pdfUrl: "#",
      field: data.field || "Systems & Kernels",
      labSlug: data.labSlug || "systems",
      keywords: data.keywords || ["Research Object", "Proof of Work", "JEMO"],
      citation: {
        bibtex: `@article{${slug},\n  title={${title}},\n  author={${authorName}},\n  year={${new Date().getFullYear()}}\n}`,
        apa: `${authorName} (${new Date().getFullYear()}). ${title}. JEMO Discovery Registry.`,
      },
      researchType: data.researchType || "Experiment",
      evidenceStatus: "Under Review",
      question: data.question,
      toolsUsed: data.toolsUsed || [],
      methodology: data.methodology,
      findings: data.findings,
      humanVerification: data.humanVerification || {
        accuracyCheck: "تم الفحص البشري والتحقق من المخرجات وتصحيح الهلوسات.",
        confidence: "مرتفعة - تم التكرار بنجاح",
      },
      lineage: {
        replicationsCount: 0,
        challengesCount: 0,
        extensionsCount: 0,
      },
      ...data,
    };

    try {
      const current = getPapersSnapshot();
      const updated = [newPaper, ...current.filter((p) => p.id !== newPaper.id)];
      localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("jemo_papers_updated"));
    } catch {
      // ignore
    }

    if (profile) {
      updateProfile({
        stats: {
          ...profile.stats,
          publishedCount: (profile.stats?.publishedCount || 0) + 1,
        },
      });
    }

    return newPaper;
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithEmail,
        signUpWithEmail,
        loginAsDemo,
        logout,
        updateProfile,
        publishedPapers,
        publishPaper,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      profile: null,
      loading: false,
      loginWithEmail: async (): Promise<AuthResult> => ({}),
      signUpWithEmail: async (): Promise<AuthResult> => ({}),
      loginAsDemo: () => {},
      logout: async () => {},
      updateProfile: () => {},
      publishedPapers: [],
      publishPaper: (p: Partial<Paper>) => (p as Paper),
    };
  }
  return context;
}
