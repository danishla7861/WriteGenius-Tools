import { useState, useEffect, useCallback } from 'react';
import { TOOL_MAP } from '../data/toolsData';
import { ToolDefinition } from '../types/tools';

const FAVORITES_KEY = 'wg_favorite_tools';

export function getFavoriteSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(s => typeof s === 'string') : [];
  } catch (err) {
    console.warn('Failed to parse favorites:', err);
    return [];
  }
}

export function getFavoriteTools(): ToolDefinition[] {
  const slugs = getFavoriteSlugs();
  return slugs
    .map(slug => TOOL_MAP[slug])
    .filter((t): t is ToolDefinition => Boolean(t));
}

export function isFavorite(slug: string): boolean {
  return getFavoriteSlugs().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  if (typeof window === 'undefined' || !slug) return false;
  try {
    const existing = getFavoriteSlugs();
    let updated: string[];
    let nowFavorited = false;

    if (existing.includes(slug)) {
      updated = existing.filter(s => s !== slug);
      nowFavorited = false;
    } else {
      updated = [slug, ...existing];
      nowFavorited = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wg_favorites_updated', { detail: updated }));
    return nowFavorited;
  } catch (err) {
    console.warn('Failed to toggle favorite:', err);
    return false;
  }
}

export function useFavorites() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(getFavoriteSlugs);
  const [favoriteTools, setFavoriteTools] = useState<ToolDefinition[]>(getFavoriteTools);

  const refresh = useCallback(() => {
    const slugs = getFavoriteSlugs();
    setFavoriteSlugs(slugs);
    setFavoriteTools(
      slugs.map(s => TOOL_MAP[s]).filter((t): t is ToolDefinition => Boolean(t))
    );
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) refresh();
    };

    window.addEventListener('wg_favorites_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('wg_favorites_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  return {
    favoriteSlugs,
    favoriteTools,
    isFavorite: (slug: string) => favoriteSlugs.includes(slug),
    toggleFavorite,
    refresh,
  };
}
