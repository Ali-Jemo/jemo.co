"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import type { Paper } from "@/lib/data/research-data";
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishedPapers, setPublishedPapers] = useState<Paper[]>([]);

  useEffect(() => {
    // 1. Check local demo session first
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
    // 1b. Check local published papers
    try {
      const storedPapers = localStorage.getItem(PAPERS_STORAGE_KEY);
      if (storedPapers) {
        setPublishedPapers(JSON.parse(storedPapers) as Paper[]);
      }
    } catch {
      // ignore
    }


    // 2. Check Supabase session safely
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
          }
          setLoading(false);
        })
        .catch((err) => {
          console.warn("Session retrieval bypassed gracefully:", err);
          setLoading(false);
        });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        try {
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
            if (!storedDemo) {
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
    } catch (err) {
      console.warn("Supabase client initialization bypassed:", err);
      setLoading(false);
    }
  }, []);

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
      if (next.isDemo) {
        try {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  };
  // ponytail: localStorage-backed paper publication, sync to database when multi-user table ready
  const publishPaper = (data: Partial<Paper>): Paper => {
    const authorName = profile?.name || data.authors?.[0]?.name || "باحث مستقل";
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
