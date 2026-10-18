import { useState, useEffect, useCallback } from 'react';
import { TOOL_MAP } from '../data/toolsData';
import { ToolDefinition } from '../types/tools';

export interface ToolUsageRecord {
  id: string;
  toolSlug: string;
  toolTitle: string;
  category: string;
  timestamp: string; // ISO string
  status: 'success' | 'failed';
  userId?: string;
}

export interface ToolUsageStats {
  totalUses: number;
  todayUses: number;
  mostUsedTool: { slug: string; title: string; count: number } | null;
  toolCounts: Record<string, number>;
  mostUsedList: { tool: ToolDefinition; count: number }[];
}

const STORAGE_KEY = 'wg_tool_usage_history';
const MAX_HISTORY_ITEMS = 500;

/**
 * Returns raw history records from localStorage.
 */
export function getUsageHistory(userId?: string): ToolUsageRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: ToolUsageRecord[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    if (userId) {
      // Filter by specific user if provided, or fallback to guest items
      return parsed.filter(r => r.userId === userId || (!r.userId && userId === 'guest'));
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to parse usage history:', err);
    return [];
  }
}

/**
 * Records a real tool execution (e.g. after successful PDF merge, text generate, etc.).
 */
export function recordToolUsage(
  toolSlug: string,
  status: 'success' | 'failed' = 'success',
  userId?: string
): void {
  if (typeof window === 'undefined' || !toolSlug) return;
  try {
    const tool = TOOL_MAP[toolSlug];
    if (!tool) return;

    const existing = getUsageHistory();
    const newRecord: ToolUsageRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      toolSlug,
      toolTitle: tool.title,
      category: tool.category,
      timestamp: new Date().toISOString(),
      status,
      userId: userId || undefined,
    };

    const updated = [newRecord, ...existing].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wg_usage_history_updated', { detail: updated }));
  } catch (err) {
    console.warn('Failed to record tool usage:', err);
  }
}

/**
 * Computes aggregated statistics from real usage records.
 */
export function computeUsageStats(userId?: string): ToolUsageStats {
  const records = getUsageHistory(userId);
  const successfulRecords = records.filter(r => r.status === 'success');
  
  const todayStr = new Date().toISOString().split('T')[0];
  let todayCount = 0;
  const toolCounts: Record<string, number> = {};

  successfulRecords.forEach(r => {
    if (r.timestamp.startsWith(todayStr)) {
      todayCount += 1;
    }
    toolCounts[r.toolSlug] = (toolCounts[r.toolSlug] || 0) + 1;
  });

  const rankedSlugs = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1]);

  let mostUsedTool: { slug: string; title: string; count: number } | null = null;
  if (rankedSlugs.length > 0) {
    const topSlug = rankedSlugs[0][0];
    const topCount = rankedSlugs[0][1];
    const toolDef = TOOL_MAP[topSlug];
    if (toolDef) {
      mostUsedTool = { slug: topSlug, title: toolDef.title, count: topCount };
    }
  }

  const mostUsedList = rankedSlugs
    .map(([slug, count]) => ({
      tool: TOOL_MAP[slug],
      count,
    }))
    .filter((item): item is { tool: ToolDefinition; count: number } => Boolean(item.tool))
    .slice(0, 5);

  return {
    totalUses: successfulRecords.length,
    todayUses: todayCount,
    mostUsedTool,
    toolCounts,
    mostUsedList,
  };
}

/**
 * Clears usage history from localStorage.
 */
export function clearUsageHistory(userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (userId) {
      const all = getUsageHistory();
      const kept = all.filter(r => r.userId !== userId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kept));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('wg_usage_history_updated', { detail: [] }));
  } catch (err) {
    console.warn('Failed to clear usage history:', err);
  }
}

/**
 * React hook to observe usage statistics and history in real time.
 */
export function useUsageTracking(userId?: string) {
  const [history, setHistory] = useState<ToolUsageRecord[]>(() => getUsageHistory(userId));
  const [stats, setStats] = useState<ToolUsageStats>(() => computeUsageStats(userId));

  const refresh = useCallback(() => {
    setHistory(getUsageHistory(userId));
    setStats(computeUsageStats(userId));
  }, [userId]);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener('wg_usage_history_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('wg_usage_history_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  return {
    history,
    stats,
    recordUse: recordToolUsage,
    clearAll: clearUsageHistory,
    refresh,
  };
}
