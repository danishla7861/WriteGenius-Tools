import { useState, useEffect, useCallback } from 'react';
import { ToolDefinition } from '../types/tools';
import { TOOL_MAP } from '../data/toolsData';

const RECENT_TOOLS_KEY = 'wg_recent_tools';
const MAX_RECENT_TOOLS = 5;

/**
 * Retrieves the list of recently visited tools from localStorage.
 */
export function getRecentToolSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(s => typeof s === 'string') : [];
  } catch (err) {
    console.warn('Failed to parse recent tools from localStorage:', err);
    return [];
  }
}

/**
 * Returns full ToolDefinition objects for recent tools.
 */
export function getRecentTools(): ToolDefinition[] {
  const slugs = getRecentToolSlugs();
  return slugs
    .map(slug => TOOL_MAP[slug])
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, MAX_RECENT_TOOLS);
}

/**
 * Adds a tool slug to the recent tools list in localStorage.
 * Ensures the slug is moved to the top and limits total to 5 items.
 */
export function addRecentTool(slug: string): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const existing = getRecentToolSlugs().filter(s => s !== slug);
    const updated = [slug, ...existing].slice(0, MAX_RECENT_TOOLS);
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wg_recent_tools_updated', { detail: updated }));
  } catch (err) {
    console.warn('Failed to save recent tool to localStorage:', err);
  }
}

/**
 * Clears all recent tools from localStorage.
 */
export function clearRecentTools(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_TOOLS_KEY);
    window.dispatchEvent(new CustomEvent('wg_recent_tools_updated', { detail: [] }));
  } catch (err) {
    console.warn('Failed to clear recent tools from localStorage:', err);
  }
}

/**
 * React hook to observe and interact with recent tools.
 */
export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<ToolDefinition[]>(getRecentTools);

  const refresh = useCallback(() => {
    setRecentTools(getRecentTools());
  }, []);

  useEffect(() => {
    // Initial fetch
    refresh();

    const handleUpdate = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === RECENT_TOOLS_KEY) {
        refresh();
      }
    };

    window.addEventListener('wg_recent_tools_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('wg_recent_tools_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  return {
    recentTools,
    addTool: addRecentTool,
    clearAll: clearRecentTools,
  };
}
