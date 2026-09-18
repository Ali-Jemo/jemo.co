"use client";

import { useState, useEffect, useCallback } from "react";

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

export function saveUserReplications(replications: UserReplication[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REPLICATIONS_STORAGE_KEY, JSON.stringify(replications));
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

export function useReplications() {
  const [replications, setReplications] = useState<UserReplication[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReplications(getUserReplications());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserReplication[]>;
      if (customEvent.detail) {
        setReplications(customEvent.detail);
      } else {
        setReplications(getUserReplications());
      }
    };

    window.addEventListener(REPLICATIONS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(REPLICATIONS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

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
