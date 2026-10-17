import { GrammarIssue, ReadabilityMetrics } from '../types/tools';

/**
 * Counts syllables in an English word using phonetic rules.
 */
export function countSyllablesInWord(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return 0;
  if (cleanWord.length <= 3) return 1;

  // Remove silent ending e unless ending in le
  let working = cleanWord;
  if (working.endsWith('e') && !working.endsWith('le')) {
    working = working.slice(0, -1);
  }

  // Count vowel groupings
  const vowelGroups = working.match(/[aeiouy]{1,2}/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Special suffix handling
  if (cleanWord.endsWith('ed') && !cleanWord.endsWith('ted') && !cleanWord.endsWith('ded')) {
    count = Math.max(1, count - 1);
  }

  return Math.max(1, count);
}

/**
 * Calculates full readability metrics and word stats for a given text.
 */
export function calculateReadability(text: string): ReadabilityMetrics {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      automatedReadabilityIndex: 0,
      readingEaseDescription: 'No text provided',
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      syllables: 0,
      complexWords: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Words matching alphanumeric chunks
  const wordTokens = trimmed.match(/[\p{L}\p{N}'-]+/gu) || [];
  const words = wordTokens.length;

  // Sentences splitting on . ! ?
  const sentenceTokens = trimmed
    .split(/[.!?]+(?:\s+|$)/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const sentences = Math.max(1, sentenceTokens.length);

  // Paragraphs splitting on double newline or newline
  const paragraphTokens = trimmed
    .split(/\n\s*\n|\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphs = Math.max(1, paragraphTokens.length);

  let syllables = 0;
  let complexWords = 0;

  for (const w of wordTokens) {
    const syl = countSyllablesInWord(w);
    syllables += syl;
    if (syl >= 3) {
      complexWords++;
    }
  }

  if (words === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      automatedReadabilityIndex: 0,
      readingEaseDescription: 'No words',
      words: 0,
      characters,
      charactersNoSpaces,
      sentences: 0,
      paragraphs: 0,
      syllables: 0,
      complexWords: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
    };
  }

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  // Flesch Reading Ease Formula: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  let flesch = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  flesch = Math.min(100, Math.max(0, Math.round(flesch * 10) / 10));

  // Flesch-Kincaid Grade Level Formula: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  let fkGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  fkGrade = Math.max(0, Math.round(fkGrade * 10) / 10);

  // Automated Readability Index (ARI): 4.71 * (charsNoSpaces / words) + 0.5 * (words / sentences) - 21.43
  let ari = 4.71 * (charactersNoSpaces / words) + 0.5 * avgWordsPerSentence - 21.43;
  ari = Math.max(0, Math.round(ari * 10) / 10);

  let readingEaseDescription = 'Standard';
  if (flesch >= 90) readingEaseDescription = 'Very Easy (5th grade level)';
  else if (flesch >= 80) readingEaseDescription = 'Easy (6th grade level)';
  else if (flesch >= 70) readingEaseDescription = 'Fairly Easy (7th grade level)';
  else if (flesch >= 60) readingEaseDescription = 'Plain English (8th-9th grade)';
  else if (flesch >= 50) readingEaseDescription = 'Fairly Difficult (High School)';
  else if (flesch >= 30) readingEaseDescription = 'Difficult (College level)';
  else readingEaseDescription = 'Very Difficult (Graduate level)';

  // Average reading speed = 200 wpm, speaking speed = 130 wpm
  const readingTimeMinutes = Math.round((words / 200) * 10) / 10;
  const speakingTimeMinutes = Math.round((words / 130) * 10) / 10;

  return {
    fleschReadingEase: flesch,
    fleschKincaidGrade: fkGrade,
    automatedReadabilityIndex: ari,
    readingEaseDescription,
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    syllables,
    complexWords,
    readingTimeMinutes,
    speakingTimeMinutes,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
  };
}

/**
 * Text case conversions
 */
export function convertTextCase(text: string, mode: string): string {
  if (!text) return '';

  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'titlecase': {
      const minorWords = new Set([
        'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'with'
      ]);
      return text
        .toLowerCase()
        .split('\n')
        .map(line => {
          const words = line.split(/(\s+)/);
          let wordIndex = 0;
          return words
            .map(token => {
              if (/^\s+$/.test(token) || !token) return token;
              const cleanToken = token.trim();
              const isFirstOrLast = wordIndex === 0 || wordIndex === words.filter(w => !/^\s+$/.test(w)).length - 1;
              wordIndex++;

              if (!isFirstOrLast && minorWords.has(cleanToken)) {
                return cleanToken;
              }
              return cleanToken.charAt(0).toUpperCase() + cleanToken.slice(1);
            })
            .join('');
        })
        .join('\n');
    }

    case 'sentencecase': {
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_match, prefix, char) => prefix + char.toUpperCase());
    }

    case 'camelcase': {
      const words = text
        .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
        .split(/[\s_-]+/)
        .filter(Boolean);
      if (words.length === 0) return '';
      return (
        words[0].toLowerCase() +
        words
          .slice(1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('')
      );
    }

    case 'snakecase': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
    }

    case 'kebabcase': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    }

    case 'constantcase': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toUpperCase();
    }

    case 'alternating': {
      let uppercase = true;
      let result = '';
      for (const char of text) {
        if (/[a-zA-Z]/.test(char)) {
          result += uppercase ? char.toUpperCase() : char.toLowerCase();
          uppercase = !uppercase;
        } else {
          result += char;
        }
      }
      return result;
    }

    default:
      return text;
  }
}

/**
 * Duplicate line remover
 */
export interface DuplicateRemovalOptions {
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
  sortAlphabetical?: boolean;
}

export function removeDuplicateLines(
  text: string,
  options: DuplicateRemovalOptions = {}
): { result: string; removedCount: number; originalCount: number; remainingCount: number } {
  const {
    caseSensitive = false,
    trimWhitespace = true,
    removeEmptyLines = true,
    sortAlphabetical = false,
  } = options;

  const rawLines = text.split('\n');
  const originalCount = rawLines.length;

  const seen = new Set<string>();
  const output: string[] = [];

  for (const line of rawLines) {
    const processed = trimWhitespace ? line.trim() : line;
    if (removeEmptyLines && !processed) continue;

    const key = caseSensitive ? processed : processed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      output.push(line);
    }
  }

  if (sortAlphabetical) {
    output.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
  }

  const remainingCount = output.length;
  const removedCount = originalCount - remainingCount;

  return {
    result: output.join('\n'),
    removedCount,
    originalCount,
    remainingCount,
  };
}

/**
 * Text cleanup utilities
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

export function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Extractive Text Summarizer (Frequency-based Sentence Scoring)
 */
export function summarizeTextLocally(text: string, targetSentences = 3): string {
  const clean = text.trim();
  if (!clean) return '';

  const rawSentences = clean
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  if (rawSentences.length <= targetSentences) {
    return clean;
  }

  // Common stop words to exclude from frequency analysis
  const stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
    'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
    'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of',
    'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
    'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
    'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
    'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you',
    'your', 'yours', 'yourself', 'yourselves'
  ]);

  // Compute word frequencies
  const words = clean.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const frequencies: Record<string, number> = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      frequencies[w] = (frequencies[w] || 0) + 1;
    }
  }

  // Score sentences based on word frequency + position bonus for first/last sentences
  const scored = rawSentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let score = 0;
    for (const sw of sWords) {
      if (frequencies[sw]) {
        score += frequencies[sw];
      }
    }
    // Length normalization
    if (sWords.length > 0) {
      score = score / Math.sqrt(sWords.length);
    }
    // Lead sentence boost
    if (index === 0) score *= 1.35;
    if (index === rawSentences.length - 1) score *= 1.15;

    return { sentence, score, index };
  });

  // Pick top sentences
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, Math.min(targetSentences, rawSentences.length));

  // Re-sort selected back to their original document order for natural reading
  selected.sort((a, b) => a.index - b.index);

  return selected.map(s => s.sentence).join(' ');
}

/**
 * Sentence Simplifier - replaces bureaucratic or convoluted phrases with clear English
 */
export const JARGON_REPLACEMENTS: [RegExp, string][] = [
  [/\bin order to\b/gi, 'to'],
  [/\butilize[s|d|ing]*\b/gi, 'use'],
  [/\bcommence[s|d|ing]*\b/gi, 'start'],
  [/\bterminate[s|d|ing]*\b/gi, 'end'],
  [/\bsubsequent to\b/gi, 'after'],
  [/\bprior to\b/gi, 'before'],
  [/\bfacilitate[s|d|ing]*\b/gi, 'help'],
  [/\bdemonstrate[s|d|ing]*\b/gi, 'show'],
  [/\bdisseminate[s|d|ing]*\b/gi, 'share'],
  [/\bendeavor to\b/gi, 'try to'],
  [/\bhas the capability to\b/gi, 'can'],
  [/\bat this point in time\b/gi, 'now'],
  [/\bdue to the fact that\b/gi, 'because'],
  [/\bin the event that\b/gi, 'if'],
  [/\bwith regard to\b/gi, 'regarding'],
  [/\bfor the purpose of\b/gi, 'for'],
  [/\boptimal\b/gi, 'best'],
  [/\bexpedite[s|d|ing]*\b/gi, 'speed up'],
  [/\bapproximately\b/gi, 'about'],
  [/\bimplement[s|d|ing]*\b/gi, 'carry out'],
  [/\bleverage[s|d|ing]*\b/gi, 'use'],
];

export function simplifySentencesLocally(text: string): { simplified: string; changes: string[] } {
  let simplified = text;
  const changes: string[] = [];

  for (const [regex, replacement] of JARGON_REPLACEMENTS) {
    const matches = simplified.match(regex);
    if (matches && matches.length > 0) {
      simplified = simplified.replace(regex, replacement);
      changes.push(`Replaced "${matches[0]}" with "${replacement}"`);
    }
  }

  return { simplified, changes };
}

/**
 * Heuristic Active / Passive voice transformations
 */
export function convertVoiceLocally(
  text: string,
  direction: 'active-to-passive' | 'passive-to-active'
): { result: string; explanation: string } {
  const trimmed = text.trim();
  if (!trimmed) return { result: '', explanation: 'No text provided.' };

  if (direction === 'active-to-passive') {
    // Pattern: "Subject verb(past) object" -> "Object was/were verb(past) by subject"
    const simpleActiveMatch = trimmed.match(
      /^(the|a|an|my|our|their|his|her|[A-Z][a-z]+)\s+([a-z]+)\s+(wrote|built|painted|created|designed|completed|fixed|broke|discovered|ate|analyzed|approved)\s+(the|a|an|this|that)\s+([a-z\s]+)\.?$/i
    );

    if (simpleActiveMatch) {
      const [, subjectDet, subjectNoun, verb, objectDet, objectNoun] = simpleActiveMatch;
      const capitalizedObj = objectDet.charAt(0).toUpperCase() + objectDet.slice(1);
      const isPlural = objectNoun.trim().endsWith('s');
      const aux = isPlural ? 'were' : 'was';
      const result = `${capitalizedObj} ${objectNoun.trim()} ${aux} ${verb} by ${subjectDet.toLowerCase()} ${subjectNoun}.`;
      return {
        result,
        explanation: 'Converted active subject-verb-object into passive voice by promoting the direct object to sentence subject.',
      };
    }

    return {
      result: `The actions in this statement were conducted such that: ${trimmed}`,
      explanation: 'Rule-based transformation: In passive voice, the focus shifts to the receiver of the action. For complex multi-clause sentences, AI-enhanced transformation is recommended below.',
    };
  } else {
    // Passive to active: Look for "... was/were [verb] by [agent]"
    const passiveByMatch = trimmed.match(
      /^(the|a|an|this|that)\s+([a-z\s]+?)\s+(was|were)\s+([a-z]+ed|[a-z]+en|written|built|made|held|done)\s+by\s+(the|a|an|my|our|[A-Z][a-z]+)(?:\s+([a-z]+))?\.?$/i
    );

    if (passiveByMatch) {
      const [, objDet, objNoun, , verb, agentDet, maybeAgentNoun] = passiveByMatch;
      const agent = maybeAgentNoun ? `${agentDet} ${maybeAgentNoun}` : agentDet;
      const capitalizedAgent = agent.charAt(0).toUpperCase() + agent.slice(1);
      const result = `${capitalizedAgent} ${verb} ${objDet.toLowerCase()} ${objNoun.trim()}.`;
      return {
        result,
        explanation: 'Converted passive voice into direct active voice by moving the acting agent to the front.',
      };
    }

    return {
      result: trimmed.replace(/\b(?:is|are|was|were|been|being)\s+([a-z]+ed|[a-z]+en|written|built)\s+by\s+/gi, '$1 '),
      explanation: 'Identified passive voice construction. For complex sentence restructuring, see the AI transformation option below.',
    };
  }
}

/**
 * Common Spelling and Grammar Heuristic Dictionary
 */
const COMMON_TYPOS: Record<string, string> = {
  teh: 'the',
  recieve: 'receive',
  recieved: 'received',
  recieving: 'receiving',
  seperate: 'separate',
  seperated: 'separated',
  definately: 'definitely',
  definitly: 'definitely',
  occured: 'occurred',
  occuring: 'occurring',
  untill: 'until',
  truely: 'truly',
  accomodate: 'accommodate',
  accomodation: 'accommodation',
  calender: 'calendar',
  writting: 'writing',
  grammer: 'grammar',
  alot: 'a lot',
  wierd: 'weird',
  beleive: 'believe',
  goverment: 'government',
  enviroment: 'environment',
  tommorow: 'tomorrow',
  tomorow: 'tomorrow',
  succesful: 'successful',
  neccessary: 'necessary',
  reccomend: 'recommend',
  maintainance: 'maintenance',
  priviledge: 'privilege',
};

export function checkGrammarAndSpellingLocally(text: string): {
  issues: GrammarIssue[];
  cleanCount: number;
} {
  const issues: GrammarIssue[] = [];
  if (!text) return { issues: [], cleanCount: 0 };

  // 1. Check for common typos
  const wordsWithOffsets = Array.from(text.matchAll(/\b([a-zA-Z]+)\b/g));
  for (const match of wordsWithOffsets) {
    const rawWord = match[1];
    const lower = rawWord.toLowerCase();
    const offset = match.index ?? 0;

    if (COMMON_TYPOS[lower]) {
      const fixed =
        rawWord.charAt(0) === rawWord.charAt(0).toUpperCase()
          ? COMMON_TYPOS[lower].charAt(0).toUpperCase() + COMMON_TYPOS[lower].slice(1)
          : COMMON_TYPOS[lower];

      issues.push({
        id: `typo-${offset}`,
        offset,
        length: rawWord.length,
        originalText: rawWord,
        suggestion: fixed,
        message: `Possible spelling mistake: did you mean "${fixed}"?`,
        type: 'spelling',
      });
    }
  }

  // 2. Check for duplicated words (e.g., "the the", "in in")
  const dupWordRegex = /\b([a-zA-Z]{2,})\s+\1\b/gi;
  for (const match of Array.from(text.matchAll(dupWordRegex))) {
    const offset = match.index ?? 0;
    const word = match[1];
    issues.push({
      id: `dup-${offset}`,
      offset,
      length: match[0].length,
      originalText: match[0],
      suggestion: word,
      message: `Duplicated word detected: "${match[0]}"`,
      type: 'grammar',
    });
  }

  // 3. Check for lowercase sentence starters
  const sentenceStarterRegex = /(?:^|[.!?]\s+)([a-z])/g;
  for (const match of Array.from(text.matchAll(sentenceStarterRegex))) {
    const char = match[1];
    const fullMatch = match[0];
    const offset = (match.index ?? 0) + fullMatch.length - 1;

    issues.push({
      id: `cap-${offset}`,
      offset,
      length: 1,
      originalText: char,
      suggestion: char.toUpperCase(),
      message: `Sentence starts with lowercase letter: "${char}"`,
      type: 'punctuation',
    });
  }

  // 4. Missing space after punctuation
  const punctSpaceRegex = /([a-zA-Z0-9])([,;:.!?])([a-zA-Z])/g;
  for (const match of Array.from(text.matchAll(punctSpaceRegex))) {
    const offset = match.index ?? 0;
    issues.push({
      id: `punct-${offset}`,
      offset,
      length: match[0].length,
      originalText: match[0],
      suggestion: `${match[1]}${match[2]} ${match[3]}`,
      message: `Missing space after punctuation: "${match[2]}"`,
      type: 'punctuation',
    });
  }

  return {
    issues,
    cleanCount: issues.length,
  };
}
