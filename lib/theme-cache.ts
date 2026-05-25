"use client";

/**
 * lib/theme-cache.ts
 * Cache en mémoire des thèmes chargés — évite N requêtes fetch pour le même thème.
 * Partagé entre tous les composants via ThemeContext.
 */

import type { Theme } from "@/lib/types";

const cache = new Map<string, Promise<Theme | null>>();

export function loadThemeCached(themeId: string): Promise<Theme | null> {
  if (cache.has(themeId)) {
    return cache.get(themeId)!;
  }

  const promise = fetch(`/data/themes/${themeId}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<Theme>) : null))
    .catch(() => null);

  cache.set(themeId, promise);
  return promise;
}

/** Préchargement silencieux */
export function prefetchTheme(themeId: string): void {
  if (!cache.has(themeId)) {
    loadThemeCached(themeId);
  }
}
