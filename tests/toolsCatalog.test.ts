import { describe, it, expect } from 'vitest';
import { ALL_TOOLS, TOOL_CATEGORIES, TOOL_MAP } from '../src/data/toolsData';
import { buildSystemInstruction, buildUserPrompt } from '../src/server/prompts';

describe('Tools Catalog Integrity & Route Validation', () => {
  it('contains comprehensive suite of tools across all 5 categories', () => {
    expect(ALL_TOOLS.length).toBe(60);
  });

  it('guarantees all 56 slugs are unique and follow kebab-case format', () => {
    const slugSet = new Set<string>();
    for (const tool of ALL_TOOLS) {
      expect(slugSet.has(tool.slug)).toBe(false);
      slugSet.add(tool.slug);
      expect(tool.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('verifies all tools belong to a recognized category', () => {
    const validCategoryIds = new Set(TOOL_CATEGORIES.map(c => c.id));
    for (const tool of ALL_TOOLS) {
      expect(validCategoryIds.has(tool.category)).toBe(true);
    }
  });

  it('ensures all tools have title, descriptions, examples, and instructions', () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.title.length).toBeGreaterThan(3);
      expect(tool.shortDescription.length).toBeGreaterThan(10);
      expect(tool.fullDescription.length).toBeGreaterThan(30);
      expect((tool.inputLabel || '').length).toBeGreaterThan(3);
      expect((tool.inputPlaceholder || '').length).toBeGreaterThan(5);
      expect(tool.instructions.length).toBeGreaterThanOrEqual(2);
      expect(tool.faqs.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('verifies that TOOL_MAP correctly references all slugs', () => {
    for (const tool of ALL_TOOLS) {
      expect(TOOL_MAP[tool.slug]).toBeDefined();
      expect(TOOL_MAP[tool.slug].title).toBe(tool.title);
    }
  });

  it('ensures server prompts can be built for every tool without throwing', () => {
    for (const tool of ALL_TOOLS) {
      const sys = buildSystemInstruction(tool.slug);
      expect(sys.length).toBeGreaterThan(20);

      const prompt = buildUserPrompt({
        toolSlug: tool.slug,
        input: 'Test input sentence',
        secondaryInput: 'Test context',
        options: {},
      });
      expect(prompt.length).toBeGreaterThan(15);
    }
  });
});
