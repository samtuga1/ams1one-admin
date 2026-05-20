"use client";

import useAuth from "@/stores/auth.store";

export function usePageAccess() {
  const { auth } = useAuth();
  const pages = auth?.pages;

  const hasPage = (key: string): boolean => {
    if (!pages) return true; // pages not loaded yet — show everything to avoid flash
    if (pages === "*") return true;
    return pages.includes(key);
  };

  const hasAnyPage = (...keys: string[]): boolean => {
    if (!pages) return true;
    if (pages === "*") return true;
    return keys.some((key) => pages.includes(key));
  };

  return { hasPage, hasAnyPage, pages };
}
