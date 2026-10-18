import React, { useState, useMemo } from 'react';
import {
  calculateReadability,
  convertTextCase,
  removeDuplicateLines,
  checkGrammarAndSpellingLocally,
  simplifySentencesLocally,
  convertVoiceLocally,
  summarizeTextLocally,
} from '../../utils/textUtils';
import { copyToClipboard, downloadAsTxt } from '../../utils/downloadUtils';
import { Copy, Download, RotateCcw, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../../types/tools';

interface FreeUtilitiesPanelProps {
  tool: ToolDefinition;
  onAiUpgrade?: (text: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const FreeUtilitiesPanel: React.FC<FreeUtilitiesPanelProps> = ({
  tool,
  onAiUpgrade,
  onShowToast,
}) => {
  const [inputText, setInputText] = useState(tool.examples[0]?.input || '');
  const [selectedCase, setSelectedCase] = useState('titlecase');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [sortAlpha, setSortAlpha] = useState(false);
  const [summarySentences, setSummarySentences] = useState(3);
  const [copied, setCopied] = useState(false);

  // Live Readability & Counting Metrics
  const metrics = useMemo(() => calculateReadability(inputText), [inputText]);

  // Case converted output
  const caseOutput = useMemo(() => {
    return convertTextCase(inputText, selectedCase);
  }, [inputText, selectedCase]);

  // Duplicate line removal output
  const duplicateOutput = useMemo(() => {
    return removeDuplicateLines(inputText, {
      caseSensitive,
      trimWhitespace,
      removeEmptyLines: true,
      sortAlphabetical: sortAlpha,
    });
  }, [inputText, caseSensitive, trimWhitespace, sortAlpha]);

  // Local grammar & spelling
  const grammarOutput = useMemo(() => {
    return checkGrammarAndSpellingLocally(inputText);
  }, [inputText]);

  // Sentence simplifier output
  const simplifierOutput = useMemo(() => {
    return simplifySentencesLocally(inputText);
  }, [inputText]);

  // Voice converter output
  const voiceOutput = useMemo(() => {
    const direction =
      tool.slug === 'active-to-passive-converter'
        ? 'active-to-passive'
        : 'passive-to-active';
    return convertVoiceLocally(inputText, direction);
  }, [inputText, tool.slug]);

  // Extractive summary output
  const summaryOutput = useMemo(() => {
    return summarizeTextLocally(inputText, summarySentences);
  }, [inputText, summarySentences]);

  const handleCopy = async (text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onShowToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      onShowToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleApplyFix = (offset: number, length: number, suggestion: string) => {
    const before = inputText.slice(0, offset);
    const after = inputText.slice(offset + length);
    setInputText(before + suggestion + after);
    onShowToast(`Applied fix: "${suggestion}"`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Primary Input Textarea */}
      <div className="bg-[#0D1424] rounded-xl p-5 border border-[#263653] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="utility-input" className="text-xs font-semibold text-[#F8FAFF]">
            {tool.inputLabel}
          </label>
          <div className="flex items-center gap-3 text-xs text-[#AAB8D0] font-mono tabular-nums">
            <span>{metrics.words} words</span>
            <span aria-hidden="true">·</span>
            <span>{metrics.characters} chars</span>
          </div>
        </div>

        <textarea
          id="utility-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={tool.inputPlaceholder}
          rows={7}
          className="w-full p-3.5 text-sm rounded-lg bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors font-sans"
        />

        {/* Action Row for Input */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#263653]/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInputText('')}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-[#AAB8D0] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={() => setInputText(tool.examples[0]?.input || '')}
              className="px-3 py-1.5 text-xs font-medium text-[#4776FF] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md transition-colors"
            >
              Load Sample Text
            </button>
          </div>

          {onAiUpgrade && (
            <button
              type="button"
              onClick={() => onAiUpgrade(inputText)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Deep Check / Enhance</span>
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 1. Word / Character / Paragraph Counter Specialized Panel */}
      {/* ---------------------------------------------------------------- */}
      {(tool.slug === 'word-counter' ||
        tool.slug === 'character-counter' ||
        tool.slug === 'paragraph-counter') && (
        <div className="space-y-4">
          {/* Real-time stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263653]">
              <span className="text-xs text-[#AAB8D0]">Total Words</span>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#F8FAFF] mt-1">
                {metrics.words.toLocaleString()}
              </p>
              <span className="text-[11px] text-[#AAB8D0]">Avg {metrics.avgWordsPerSentence} w/sentence</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263653]">
              <span className="text-xs text-[#AAB8D0]">Characters (with spaces)</span>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#F8FAFF] mt-1">
                {metrics.characters.toLocaleString()}
              </p>
              <span className="text-[11px] text-[#AAB8D0] font-mono tabular-nums">
                {metrics.charactersNoSpaces.toLocaleString()} no spaces
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263653]">
              <span className="text-xs text-[#AAB8D0]">Sentences & Paragraphs</span>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#F8FAFF] mt-1">
                {metrics.sentences} / {metrics.paragraphs}
              </p>
              <span className="text-[11px] text-[#AAB8D0]">{metrics.syllables} total syllables</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263653]">
              <span className="text-xs text-[#AAB8D0]">Estimated Duration</span>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#4776FF] mt-1">
                {metrics.readingTimeMinutes} min
              </p>
              <span className="text-[11px] text-[#AAB8D0] font-mono tabular-nums">
                Speaking: ~{metrics.speakingTimeMinutes} min
              </span>
            </div>
          </div>

          {/* Social Platform Limits Progress */}
          <div className="p-4 rounded-xl bg-[#0D1424] border border-[#263653] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#AAB8D0]">
              Social Media Character Quotas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>X / Twitter</span>
                  <span className={`font-mono tabular-nums ${metrics.characters > 280 ? 'text-red-500 font-bold' : ''}`}>
                    {metrics.characters} / 280
                  </span>
                </div>
                <div className="w-full bg-[#111A2E] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.characters > 280 ? 'bg-red-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.characters / 280) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Google Meta Description</span>
                  <span className={`font-mono tabular-nums ${metrics.characters > 155 ? 'text-red-500 font-bold' : ''}`}>
                    {metrics.characters} / 155
                  </span>
                </div>
                <div className="w-full bg-[#111A2E] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.characters > 155 ? 'bg-red-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.characters / 155) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Instagram Bio</span>
                  <span className={`font-mono tabular-nums ${metrics.characters > 150 ? 'text-red-500 font-bold' : ''}`}>
                    {metrics.characters} / 150
                  </span>
                </div>
                <div className="w-full bg-[#111A2E] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.characters > 150 ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.characters / 150) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 2. Readability Checker Panel */}
      {/* ---------------------------------------------------------------- */}
      {tool.slug === 'readability-checker' && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263653]">
            <div>
              <span className="text-xs text-[#AAB8D0]">Flesch Reading Ease Score</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-[#F8FAFF]">
                  {metrics.fleschReadingEase}
                </span>
                <span className="text-sm font-semibold text-[#4776FF]">
                  {metrics.readingEaseDescription}
                </span>
              </div>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-[#AAB8D0]">US School Grade Level</span>
              <p className="text-2xl font-bold font-mono tabular-nums text-[#F8FAFF] mt-1">
                Grade {metrics.fleschKincaidGrade}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
              <span className="text-[#AAB8D0]">Automated Readability (ARI)</span>
              <p className="text-base font-bold font-mono tabular-nums text-[#F8FAFF] mt-0.5">
                {metrics.automatedReadabilityIndex}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
              <span className="text-[#AAB8D0]">Avg Words / Sentence</span>
              <p className="text-base font-bold font-mono tabular-nums text-[#F8FAFF] mt-0.5">
                {metrics.avgWordsPerSentence}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
              <span className="text-[#AAB8D0]">Avg Syllables / Word</span>
              <p className="text-base font-bold font-mono tabular-nums text-[#F8FAFF] mt-0.5">
                {metrics.avgSyllablesPerWord}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50">
              <span className="text-[#AAB8D0]">Complex Words (3+ syl)</span>
              <p className="text-base font-bold font-mono tabular-nums text-[#F8FAFF] mt-0.5">
                {metrics.complexWords}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 3. Text Case Converter Panel */}
      {/* ---------------------------------------------------------------- */}
      {tool.slug === 'text-case-converter' && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <label className="text-xs font-semibold text-[#F8FAFF] block">
            Select Case Transformation
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'titlecase', label: 'Title Case' },
              { id: 'sentencecase', label: 'Sentence case' },
              { id: 'uppercase', label: 'UPPERCASE' },
              { id: 'lowercase', label: 'lowercase' },
              { id: 'camelcase', label: 'camelCase' },
              { id: 'snakecase', label: 'snake_case' },
              { id: 'kebabcase', label: 'kebab-case' },
              { id: 'constantcase', label: 'CONSTANT_CASE' },
              { id: 'alternating', label: 'aLtErNaTiNg' },
            ].map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCase(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedCase === c.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#111A2E] text-[#F8FAFF] hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#263653]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">Converted Output</span>
              <button
                type="button"
                onClick={() => handleCopy(caseOutput)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#111A2E] hover:bg-slate-200 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={caseOutput}
              rows={5}
              className="w-full p-3.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-[#263653] text-[#F8FAFF] font-mono"
            />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 4. Duplicate Line Remover Panel */}
      {/* ---------------------------------------------------------------- */}
      {tool.slug === 'duplicate-line-remover' && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#F8FAFF]">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={e => setCaseSensitive(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#F8FAFF]">
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={e => setTrimWhitespace(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Trim Whitespace</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#F8FAFF]">
              <input
                type="checkbox"
                checked={sortAlpha}
                onChange={e => setSortAlpha(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Sort Alphabetically (A-Z)</span>
            </label>
          </div>

          <div className="flex items-center gap-6 py-2 px-3 rounded-lg bg-[#090F1D] text-xs text-slate-600 dark:text-[#AAB8D0] font-mono tabular-nums">
            <span>Original: {duplicateOutput.originalCount} lines</span>
            <span>Removed: {duplicateOutput.removedCount} duplicates</span>
            <span className="font-bold text-[#4776FF]">
              Remaining: {duplicateOutput.remainingCount} lines
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">Cleaned List</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadAsTxt(duplicateOutput.result, 'clean-list.txt')}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#111A2E] hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(duplicateOutput.result)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#111A2E] hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={duplicateOutput.result}
              rows={6}
              className="w-full p-3.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-[#263653] text-[#F8FAFF] font-mono"
            />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 5. Grammar & Spell Checker Diagnostic Issues */}
      {/* ---------------------------------------------------------------- */}
      {(tool.slug === 'free-grammar-checker' || tool.slug === 'spell-checker') && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
            <span className="text-sm font-semibold text-[#F8FAFF]">
              Linguistic Diagnostics ({grammarOutput.issues.length} detected)
            </span>
            <span className="text-xs text-[#AAB8D0]">Instant Local Analysis</span>
          </div>

          {grammarOutput.issues.length === 0 ? (
            <div className="py-6 text-center text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>No basic spelling or punctuation errors detected in your text!</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {grammarOutput.issues.map(issue => (
                <div
                  key={issue.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-[#090F1D] border border-[#263653] gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-rose-500 font-mono font-medium">
                        {issue.originalText}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#AAB8D0]" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {issue.suggestion}
                      </span>
                    </div>
                    <p className="text-[#AAB8D0]">{issue.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyFix(issue.offset, issue.length, issue.suggestion)}
                    className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-md transition-colors shrink-0"
                  >
                    Apply Fix
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 6. Sentence Simplifier & Voice Converters */}
      {/* ---------------------------------------------------------------- */}
      {tool.slug === 'sentence-simplifier' && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
            <span className="text-sm font-semibold text-[#F8FAFF]">
              Plain English Simplification
            </span>
            <button
              type="button"
              onClick={() => handleCopy(simplifierOutput.simplified)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#111A2E] hover:bg-slate-200 rounded-md transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Simplified Text</span>
            </button>
          </div>

          <textarea
            readOnly
            value={simplifierOutput.simplified}
            rows={5}
            className="w-full p-3.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-[#263653] text-[#F8FAFF]"
          />

          {simplifierOutput.changes.length > 0 && (
            <div className="text-xs text-[#AAB8D0] space-y-1">
              <span className="font-semibold block text-[#F8FAFF]">
                Replacements made:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {simplifierOutput.changes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {(tool.slug === 'active-to-passive-converter' ||
        tool.slug === 'passive-to-active-converter') && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
            <span className="text-sm font-semibold text-[#F8FAFF]">
              Syntactic Transformation
            </span>
            <button
              type="button"
              onClick={() => handleCopy(voiceOutput.result)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#111A2E] hover:bg-slate-200 rounded-md transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Converted</span>
            </button>
          </div>

          <textarea
            readOnly
            value={voiceOutput.result}
            rows={4}
            className="w-full p-3.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-[#263653] text-[#F8FAFF]"
          />
          <p className="text-xs text-[#AAB8D0] italic">{voiceOutput.explanation}</p>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 7. Extractive Text Summarizer Panel */}
      {/* ---------------------------------------------------------------- */}
      {tool.slug === 'text-summarizer' && (
        <div className="p-5 rounded-xl bg-[#0D1424] border border-[#263653] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
            <span className="text-sm font-semibold text-[#F8FAFF]">
              Extractive Sentence Summary
            </span>
            <div className="flex items-center gap-3">
              <label className="text-xs text-[#AAB8D0] flex items-center gap-1.5">
                <span>Key Sentences:</span>
                <select
                  value={summarySentences}
                  onChange={e => setSummarySentences(Number(e.target.value))}
                  className="bg-[#111A2E] rounded px-2 py-1 text-xs font-mono"
                >
                  <option value={2}>2 Sentences</option>
                  <option value={3}>3 Sentences</option>
                  <option value={5}>5 Sentences</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(summaryOutput)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-[#111A2E] hover:bg-slate-200 rounded-md transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={summaryOutput}
            rows={5}
            className="w-full p-3.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-[#263653] text-[#F8FAFF]"
          />
        </div>
      )}
    </div>
  );
};
