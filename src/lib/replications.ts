"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface UserReplication {
  id: string;
  paperSlug: string;
  paperTitle: string;
  type: "verified" | "challenge" | "extension";
  findings: string;
  date: string;
  methodology?: string;
  confidence?: "high" | "medium" | "exploratory";
  reproducedAccuracy?: number;
  evidenceUrl?: string;
}

const REPLICATIONS_STORAGE_KEY = "jemo_user_replications";
const REPLICATIONS_EVENT = "jemo_replications_updated";

const INITIAL_REPLICATIONS: UserReplication[] = [
  {
    id: "rep-001",
    paperSlug: "six-llm-arabic-hallucination-audit",
    paperTitle: "استقصاء ومقارنة 6 نماذج ذكاء اصطناعي في الاستدلال الرياضي واللساني",
    type: "verified",
    findings: "أعدت التجربة على 10 نصوص جديدة من العصر العباسي؛ تكررت نفس نسبة الهلوسة (حوالي 26%) في اختلاق المصادر الفرعية، مما يؤكد صحة استنتاج البحث ودقة المنهجية المعيارية.",
    date: "2026-08-18",
    methodology: "استخدام اختبار أعمى (Double-blind prompt harness) مع استدعاء نماذج vLLM المحلية لضمان عدم وجود تسريب تدريب.",
    confidence: "high",
    reproducedAccuracy: 96,
    evidenceUrl: "https://github.com/jemo-labs/benchmarks-archive",
  },
  {
    id: "rep-002",
    paperSlug: "deep-debugging-memory-leak-kernel",
    paperTitle: "عزل تسريب الذاكرة في خدمات Node.js عالية التردد",
    type: "challenge",
    findings: "عند تفعيل نمط التفكير العميق الموصول بقواعد بيانات خارجية، انخفضت نسبة الهلوسة إلى 8%؛ تم إرفاق شفرة الاختبار المعدلة ومقارنة الأداء في النواة.",
    date: "2026-08-05",
    methodology: "تشغيل eBPF memory tracer بالتزامن مع اختبار ضغط 50,000 req/sec على نواة لينكس 6.8.",
    confidence: "high",
    reproducedAccuracy: 92,
    evidenceUrl: "https://github.com/jemo-labs/kernel-ebpf-traces",
  },
];

export function getUserReplications(): UserReplication[] {
  if (typeof window === "undefined") return INITIAL_REPLICATIONS;
  try {
    const raw = localStorage.getItem(REPLICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REPLICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_REPLICATIONS));
      return INITIAL_REPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REPLICATIONS;
  } catch {
    return INITIAL_REPLICATIONS;
  }
}

let cachedRaw: string | null = null;
let cachedReplications: UserReplication[] = INITIAL_REPLICATIONS;

export function saveUserReplications(replications: UserReplication[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(replications);
    cachedRaw = raw;
    cachedReplications = replications;
    localStorage.setItem(REPLICATIONS_STORAGE_KEY, raw);
    window.dispatchEvent(new CustomEvent(REPLICATIONS_EVENT, { detail: replications }));
  } catch {
    // ignore
  }
}

export function addUserReplication(
  rep: Omit<UserReplication, "id" | "date"> & { date?: string }
): UserReplication {
  const current = getUserReplications();
  const newRep: UserReplication = {
    ...rep,
    id: `rep-${Date.now().toString().slice(-5)}`,
    date: rep.date || new Date().toLocaleDateString("en-CA"),
    confidence: rep.confidence || "high",
  };
  saveUserReplications([newRep, ...current]);
  return newRep;
}

export function removeUserReplication(id: string): void {
  const current = getUserReplications();
  saveUserReplications(current.filter((r) => r.id !== id));
}

function subscribeReplications(callback: () => void): () => void {
  window.addEventListener(REPLICATIONS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(REPLICATIONS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getReplicationsSnapshot(): UserReplication[] {
  if (typeof window === "undefined") return INITIAL_REPLICATIONS;
  try {
    const raw = localStorage.getItem(REPLICATIONS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_REPLICATIONS;
    }
    if (raw === cachedRaw) {
      return cachedReplications;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedReplications = parsed;
      return cachedReplications;
    }
    return INITIAL_REPLICATIONS;
  } catch {
    return INITIAL_REPLICATIONS;
  }
}

function getServerSnapshot(): UserReplication[] {
  return INITIAL_REPLICATIONS;
}

const emptySubscribe = () => () => {};

export function useReplications() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const replications = useSyncExternalStore(
    subscribeReplications,
    getReplicationsSnapshot,
    getServerSnapshot
  );
  const add = useCallback((item: Omit<UserReplication, "id" | "date"> & { date?: string }) => {
    return addUserReplication(item);
  }, []);

  const remove = useCallback((id: string) => {
    removeUserReplication(id);
  }, []);

  return {
    replications,
    add,
    remove,
    count: replications.length,
    mounted,
  };
}
