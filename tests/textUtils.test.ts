import { describe, it, expect } from 'vitest';
import {
  calculateReadability,
  convertTextCase,
  removeDuplicateLines,
  normalizeWhitespace,
  stripHtmlTags,
  summarizeTextLocally,
  simplifySentencesLocally,
  convertVoiceLocally,
  checkGrammarAndSpellingLocally,
  countSyllablesInWord,
} from '../src/utils/textUtils';

describe('Text Analysis & Readability Utilities', () => {
  it('handles empty input gracefully', () => {
    const metrics = calculateReadability('');
    expect(metrics.words).toBe(0);
    expect(metrics.characters).toBe(0);
    expect(metrics.sentences).toBe(0);
    expect(metrics.paragraphs).toBe(0);
    expect(metrics.fleschReadingEase).toBe(0);
  });

  it('correctly counts words, characters, sentences, and paragraphs', () => {
    const text = 'Writing clearly is a superpower. It helps you think better.\n\nGood tools save valuable time.';
    const metrics = calculateReadability(text);

    expect(metrics.words).toBe(15);
    expect(metrics.sentences).toBe(3);
    expect(metrics.paragraphs).toBe(2);
    expect(metrics.characters).toBe(text.length);
    expect(metrics.charactersNoSpaces).toBe(text.replace(/\s/g, '').length);
    expect(metrics.readingTimeMinutes).toBeGreaterThan(0);
  });

  it('accurately counts syllables in common words', () => {
    expect(countSyllablesInWord('cat')).toBe(1);
    expect(countSyllablesInWord('simple')).toBe(2);
    expect(countSyllablesInWord('writing')).toBe(2);
    expect(countSyllablesInWord('engineering')).toBe(4);
    expect(countSyllablesInWord('accessibility')).toBe(6);
  });

  it('computes Flesch Reading Ease and Grade Level within expected bounds', () => {
    const plainEnglish = 'The dog ran in the park. The sun was hot and bright. He drank cold water.';
    const metrics = calculateReadability(plainEnglish);
    // Plain English with 1-syllable words and short sentences should score high on reading ease (>= 80)
    expect(metrics.fleschReadingEase).toBeGreaterThanOrEqual(80);
    expect(metrics.fleschKincaidGrade).toBeLessThanOrEqual(4);
  });

  it('handles unicode and accented characters properly', () => {
    const unicodeText = 'Café résumé Über naïve façade. El niño está bien.';
    const metrics = calculateReadability(unicodeText);
    expect(metrics.words).toBe(9);
  });
});

describe('Text Case Conversions', () => {
  const sample = 'the quick brown fox jumps over the lazy dog';

  it('converts to UPPERCASE', () => {
    expect(convertTextCase(sample, 'uppercase')).toBe('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
  });

  it('converts to lowercase', () => {
    expect(convertTextCase('HELLO WORLD', 'lowercase')).toBe('hello world');
  });

  it('converts to Title Case adhering to minor word exceptions', () => {
    const title = convertTextCase('the art of computer programming and design', 'titlecase');
    // First word capitalized, 'of' and 'and' lowercase
    expect(title).toBe('The Art of Computer Programming and Design');
  });

  it('converts to Sentence case', () => {
    expect(convertTextCase('hello world. this is a test! awesome.', 'sentencecase')).toBe(
      'Hello world. This is a test! Awesome.'
    );
  });

  it('converts to camelCase', () => {
    expect(convertTextCase('User profile settings', 'camelcase')).toBe('userProfileSettings');
  });

  it('converts to snake_case', () => {
    expect(convertTextCase('User Profile Settings', 'snakecase')).toBe('user_profile_settings');
  });

  it('converts to kebab-case', () => {
    expect(convertTextCase('User Profile Settings', 'kebabcase')).toBe('user-profile-settings');
  });

  it('converts to CONSTANT_CASE', () => {
    expect(convertTextCase('api rate limit', 'constantcase')).toBe('API_RATE_LIMIT');
  });

  it('converts to alternating case', () => {
    const alt = convertTextCase('hello', 'alternating');
    expect(alt).toBe('HeLlO');
  });
});

describe('Duplicate Line Remover', () => {
  it('removes duplicate lines ignoring case and whitespace when configured', () => {
    const list = 'apple\nbanana\n  apple  \nApple\ncherry';
    const result = removeDuplicateLines(list, {
      caseSensitive: false,
      trimWhitespace: true,
      removeEmptyLines: true,
    });

    expect(result.originalCount).toBe(5);
    expect(result.remainingCount).toBe(3);
    expect(result.removedCount).toBe(2);
    expect(result.result).toBe('apple\nbanana\ncherry');
  });

  it('preserves case distinctions when caseSensitive is true', () => {
    const list = 'apple\nApple\napple';
    const result = removeDuplicateLines(list, {
      caseSensitive: true,
      trimWhitespace: true,
      removeEmptyLines: true,
    });

    expect(result.remainingCount).toBe(2);
    expect(result.result).toBe('apple\nApple');
  });

  it('sorts alphabetically when requested', () => {
    const list = 'banana\ncherry\napple';
    const result = removeDuplicateLines(list, { sortAlphabetical: true });
    expect(result.result).toBe('apple\nbanana\ncherry');
  });
});

describe('Formatting & Cleanup Utilities', () => {
  it('normalizes multiple spaces and excessive newlines', () => {
    const dirty = 'Hello    world!   \n\n\n\n\nHow  are   you?';
    const cleaned = normalizeWhitespace(dirty);
    expect(cleaned).toBe('Hello world! \n\nHow are you?');
  });

  it('strips HTML tags', () => {
    const html = '<p>This is <strong>bold</strong> text with a <a href="#">link</a>.</p>';
    expect(stripHtmlTags(html)).toBe('This is bold text with a link.');
  });
});

describe('Heuristic Grammar, Jargon & Voice Utilities', () => {
  it('detects common spelling mistakes and suggests corrections', () => {
    const text = 'We have recieved the report and it is definitly great.';
    const { issues } = checkGrammarAndSpellingLocally(text);
    expect(issues.length).toBeGreaterThanOrEqual(2);
    expect(issues.some(i => i.originalText === 'recieved' && i.suggestion === 'received')).toBe(true);
    expect(issues.some(i => i.originalText === 'definitly' && i.suggestion === 'definitely')).toBe(true);
  });

  it('detects duplicated adjacent words', () => {
    const text = 'This is the the best option in in town.';
    const { issues } = checkGrammarAndSpellingLocally(text);
    expect(issues.some(i => i.originalText.toLowerCase() === 'the the')).toBe(true);
  });

  it('simplifies bureaucratic jargon with plain English equivalents', () => {
    const jargon = 'In order to utilize this tool prior to the deadline, we must commence now.';
    const { simplified, changes } = simplifySentencesLocally(jargon);
    expect(simplified.toLowerCase()).toContain('to use this tool before the deadline, we must start now');
    expect(changes.length).toBeGreaterThanOrEqual(3);
  });

  it('converts active to passive voice rule-based structure', () => {
    const active = 'The developer built the application.';
    const { result } = convertVoiceLocally(active, 'active-to-passive');
    expect(result.toLowerCase()).toContain('was built by the developer');
  });

  it('extracts key sentences in the local summarizer', () => {
    const multiSentence =
      'Artificial intelligence is transforming software engineering. Developers can write code faster and with fewer repetitive tasks. Neural networks analyze code patterns across large repositories. As tools improve, human judgment and architecture remain essential. In summary, automated systems complement human creativity rather than replacing it.';
    const summary = summarizeTextLocally(multiSentence, 2);
    expect(summary.length).toBeGreaterThan(0);
    expect(summary.split(/[.!?]+/).filter(Boolean).length).toBeLessThanOrEqual(3);
  });
});
