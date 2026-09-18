"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  apiKey?: string;
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
    id: "demo-omar-karkhi",
    email: "omar@karkhi.ai",
    name: "عمر الكرخي",
    handle: "@omar_karkhi",
    role: "باحث مواطن مستقل • Citizen AI Researcher",
    domain: "الذكاء الاصطناعي وهندسة الاستدلال",
    avatar: "/jemo-logo.svg",
    researchId: "JEMO-RES-9102",
    isDemo: true,
    institution: "مختبر الاستدلال العربي المستقل",
    bio: "باحث مستقل متخصص في تدقيق هلوسات النماذج التوليدية في السياقات اللغوية العربية القديمة واختبار متانة سلاسل التفكير المنطقي.",
    githubHandle: "https://github.com/omar-karkhi",
    orcidId: "0009-0002-8192-4410",
    scholarUrl: "https://scholar.google.com",
    apiKey: "jemo_live_res_89fa41c09b2e817d",
    stats: {
      publishedCount: 2,
      replicationsCount: 14,
      contributionsCount: 8,
      evidenceScore: 92,
    },
  },
  tamimi: {
    id: "demo-zaid-tamimi",
    email: "zaid@tamimi.dev",
    name: "م. زيد التميمي",
    handle: "@zaid_systems",
    role: "مهندس برمجيات ونظم • Deep Debugging",
    domain: "هندسة النظم وتحليل الذاكرة",
    avatar: "/jemo-logo.svg",
    researchId: "JEMO-RES-4418",
    isDemo: true,
    institution: "مجموعة النظم المضمنة وعزل النواة",
    bio: "مهندس نظم ومطور برمجيات منخفضة المستوى، يركز على تتبع تسريبات الذاكرة في الخدمات الحية وبناء أدوات التحقق من الأداء في بيئات الإنتاج.",
    githubHandle: "https://github.com/zaid-tamimi",
    orcidId: "0009-0004-1290-7731",
    scholarUrl: "https://scholar.google.com",
    apiKey: "jemo_live_res_44189b2e817d0aa1",
    stats: {
      publishedCount: 1,
      replicationsCount: 8,
      contributionsCount: 12,
      evidenceScore: 96,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const clerk = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishedPapers, setPublishedPapers] = useState<Paper[]>([]);

  // Load published papers from localStorage
  useEffect(() => {
    try {
      const storedPapers = localStorage.getItem(PAPERS_STORAGE_KEY);
      if (storedPapers) {
        setPublishedPapers(JSON.parse(storedPapers) as Paper[]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync session state from Clerk, demo session, or Supabase
  useEffect(() => {
    if (!clerk.isLoaded) {
      setLoading(true);
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
      const isSuperAdmin =
        email === "ali.jemo1.9@gmail.com" ||
        u.username === "jemo" ||
        u.publicMetadata?.role === "admin";

      const name =
        u.fullName ||
        [u.firstName, u.lastName].filter(Boolean).join(" ") ||
        (isSuperAdmin ? "م. علي حسين هادي" : (u.username ? `@${u.username}` : (email ? email.split("@")[0] : "باحث مستقل")));

      const handle = u.username
        ? (u.username.startsWith("@") ? u.username : `@${u.username}`)
        : (email ? `@${email.split("@")[0]}` : "@researcher");

      const role =
        (u.publicMetadata?.role as string) ||
        (isSuperAdmin
          ? "المؤسس والمهندس الرئيسي • Founder & Lead Engineer"
          : "باحث مستقل • Independent Researcher");

      const domain =
        (u.publicMetadata?.domain as string) ||
        (isSuperAdmin
          ? "الأنظمة المضمنة وهندسة الاستدلال والبرمجيات السيادية"
          : "أبحاث النظم والذكاء الاصطناعي");

      const avatar = u.imageUrl || "/jemo-logo.svg";

      const researchId =
        (u.publicMetadata?.researchId as string) ||
        (isSuperAdmin ? "JEMO-CORE-0001" : `JEMO-RES-${u.id.replace(/^user_/, "").slice(0, 4).toUpperCase()}`);

      // Check stored profile extensions
      let extProfile: Partial<ResearcherProfile> = {};
      try {
        const rawExt = localStorage.getItem(`jemo_profile_ext_${u.id}`);
        if (rawExt) extProfile = JSON.parse(rawExt);
      } catch {
        // ignore
      }

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
        bio: extProfile.bio || (isSuperAdmin ? "مهندس وباحث مستقل يقود مشاريع السيادة الرقمية والذكاء الاصطناعي وبناء أنظمة التشغيل العربية." : "باحث مستقل يستكشف حدود المعرفة والاستدلال الرياضي والأنظمة."),
        institution: extProfile.institution || (isSuperAdmin ? "JEMO CORE RESEARCH LABS" : "مستقل / Independent"),
        githubHandle: extProfile.githubHandle || (u.username ? `https://github.com/${u.username}` : ""),
        orcidId: extProfile.orcidId || "",
        scholarUrl: extProfile.scholarUrl || "",
        apiKey: extProfile.apiKey || `jemo_live_res_${u.id.replace(/^user_/, "").slice(0, 16)}`,
        stats: {
          publishedCount: extProfile.stats?.publishedCount ?? (isSuperAdmin ? 3 : 1),
          replicationsCount: extProfile.stats?.replicationsCount ?? (isSuperAdmin ? 18 : 4),
          contributionsCount: extProfile.stats?.contributionsCount ?? (isSuperAdmin ? 14 : 3),
          evidenceScore: extProfile.stats?.evidenceScore ?? (isSuperAdmin ? 99 : 92),
        },
      });
      setLoading(false);
      return;
    }

    // 2. Local Demo Profile
    try {
      const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
      if (storedDemo) {
        const parsed = JSON.parse(storedDemo) as ResearcherProfile;
        setProfile(parsed);
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    // 3. Fallback: Supabase Session
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
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
        })
        .catch(() => {
          setProfile(null);
          setLoading(false);
        });

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
        try {
          subscription.unsubscribe();
        } catch {
          // ignore
        }
      };
    } catch {
      setProfile(null);
      setLoading(false);
    }
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

    setPublishedPapers((prev) => {
      const updated = [newPaper, ...prev];
      try {
        localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

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
