import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  getRecentToolSlugs,
  getRecentTools,
  addRecentTool,
  clearRecentTools,
} from '../src/utils/recentToolsUtils';

describe('recentToolsUtils', () => {
  let store: Record<string, string> = {};

  beforeAll(() => {
    // Mock localStorage and window events for node environment
    const mockStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    (globalThis as any).localStorage = mockStorage;
    (globalThis as any).window = {
      dispatchEvent: () => true,
    };
  });

  beforeEach(() => {
    store = {};
  });

  it('starts with an empty list', () => {
    expect(getRecentToolSlugs()).toEqual([]);
    expect(getRecentTools()).toEqual([]);
  });

  it('adds and retrieves recent tool slugs in most recent order', () => {
    addRecentTool('merge-pdf');
    addRecentTool('ai-essay-writer');
    addRecentTool('gpa-calculator');

    const slugs = getRecentToolSlugs();
    expect(slugs).toEqual(['gpa-calculator', 'ai-essay-writer', 'merge-pdf']);

    const tools = getRecentTools();
    expect(tools.length).toBe(3);
    expect(tools[0].slug).toBe('gpa-calculator');
  });

  it('moves existing tool to the top without duplicates', () => {
    addRecentTool('merge-pdf');
    addRecentTool('word-counter');
    addRecentTool('merge-pdf');

    const slugs = getRecentToolSlugs();
    expect(slugs).toEqual(['merge-pdf', 'word-counter']);
  });

  it('caps at maximum 5 items', () => {
    addRecentTool('merge-pdf');
    addRecentTool('compress-pdf');
    addRecentTool('split-pdf');
    addRecentTool('word-counter');
    addRecentTool('gpa-calculator');
    addRecentTool('ai-essay-writer');

    const slugs = getRecentToolSlugs();
    expect(slugs.length).toBe(5);
    expect(slugs[0]).toBe('ai-essay-writer');
    expect(slugs).not.toContain('merge-pdf');
  });

  it('clears recent tools', () => {
    addRecentTool('merge-pdf');
    addRecentTool('compress-pdf');
    clearRecentTools();
    expect(getRecentToolSlugs()).toEqual([]);
    expect(getRecentTools()).toEqual([]);
  });
});
