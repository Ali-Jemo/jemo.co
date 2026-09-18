"use client";

import { useState, useEffect, useCallback } from "react";

const BOOKMARKS_STORAGE_KEY = "jemo_user_bookmarks";
const BOOKMARKS_EVENT = "jemo_bookmarks_updated";

const DEFAULT_BOOKMARKS = [
  "six-llm-arabic-hallucination-audit",
  "deep-debugging-memory-leak-kernel"
];

export function getBookmarkedSlugs(): string[] {
  if (typeof window === "undefined") return DEFAULT_BOOKMARKS;
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKMARKS));
      return DEFAULT_BOOKMARKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_BOOKMARKS;
  } catch {
    return DEFAULT_BOOKMARKS;
  }
}

export function saveBookmarkedSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(BOOKMARKS_EVENT, { detail: slugs }));
  } catch {
    // ignore
  }
}

export function addBookmark(slug: string): void {
  const current = getBookmarkedSlugs();
  if (!current.includes(slug)) {
    saveBookmarkedSlugs([...current, slug]);
  }
}

export function removeBookmark(slug: string): void {
  const current = getBookmarkedSlugs();
  saveBookmarkedSlugs(current.filter((s) => s !== slug));
}

export function toggleBookmark(slug: string): boolean {
  const current = getBookmarkedSlugs();
  const exists = current.includes(slug);
  if (exists) {
    saveBookmarkedSlugs(current.filter((s) => s !== slug));
    return false;
  } else {
    saveBookmarkedSlugs([...current, slug]);
    return true;
  }
}

export function isBookmarked(slug: string): boolean {
  return getBookmarkedSlugs().includes(slug);
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(getBookmarkedSlugs());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail) {
        setBookmarks(customEvent.detail);
      } else {
        setBookmarks(getBookmarkedSlugs());
      }
    };

    window.addEventListener(BOOKMARKS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    return toggleBookmark(slug);
  }, []);

  const remove = useCallback((slug: string) => {
    removeBookmark(slug);
  }, []);

  const has = useCallback(
    (slug: string) => {
      return mounted ? bookmarks.includes(slug) : false;
    },
    [mounted, bookmarks]
  );

  return {
    bookmarks,
    toggle,
    remove,
    has,
    count: bookmarks.length,
    mounted,
  };
}
