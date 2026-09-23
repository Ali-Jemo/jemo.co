"use client";

import { useCallback, useSyncExternalStore } from "react";

const BOOKMARKS_STORAGE_KEY = "jemo_user_bookmarks";
const BOOKMARKS_EVENT = "jemo_bookmarks_updated";

const DEFAULT_BOOKMARKS = [
  "six-llm-arabic-hallucination-audit",
  "deep-debugging-memory-leak-kernel"
];

const SERVER_BOOKMARKS: string[] = [];
let cachedRaw: string | null = null;
let cachedBookmarks: string[] = DEFAULT_BOOKMARKS;

export function getBookmarkedSlugs(): string[] {
  if (typeof window === "undefined") return DEFAULT_BOOKMARKS;
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) {
      const initial = JSON.stringify(DEFAULT_BOOKMARKS);
      cachedRaw = initial;
      cachedBookmarks = DEFAULT_BOOKMARKS;
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, initial);
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
    const raw = JSON.stringify(slugs);
    cachedRaw = raw;
    cachedBookmarks = slugs;
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, raw);
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

const emptySubscribe = () => () => {};

function subscribeBookmarks(callback: () => void) {
  window.addEventListener(BOOKMARKS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(BOOKMARKS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getBookmarksSnapshot(): string[] {
  if (typeof window === "undefined") return DEFAULT_BOOKMARKS;
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_BOOKMARKS;
    }
    if (raw !== cachedRaw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedRaw = raw;
        cachedBookmarks = parsed;
      }
    }
    return cachedBookmarks;
  } catch {
    return DEFAULT_BOOKMARKS;
  }
}

const getServerBookmarksSnapshot = () => SERVER_BOOKMARKS;
const getClientMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

export function useBookmarks() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientMountedSnapshot,
    getServerMountedSnapshot
  );
  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    getBookmarksSnapshot,
    getServerBookmarksSnapshot
  );

  const has = useCallback(
    (slug: string) => (mounted ? bookmarks.includes(slug) : false),
    [mounted, bookmarks]
  );

  return {
    bookmarks,
    toggle: toggleBookmark,
    remove: removeBookmark,
    has,
    count: bookmarks.length,
    mounted,
  };
}
