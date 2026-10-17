import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  RefreshCw,
  Check,
  ChevronDown,
  ArrowRight,
  AlertCircle,
  Cpu,
  Zap,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import { copyToClipboard, downloadAsTxt } from '../../utils/downloadUtils';
import { calculateReadability } from '../../utils/textUtils';
import { FreeUtilitiesPanel } from './FreeUtilitiesPanel';
import { PdfToolsPanel } from './PdfToolsPanel';
import { ImageToolsPanel } from './ImageToolsPanel';
import { StudentToolsPanel } from './StudentToolsPanel';
import { AiImageGeneratorPanel } from './AiImageGeneratorPanel';
import { AdBannerPlaceholder } from '../common/AdBannerPlaceholder';
import { TOOL_MAP } from '../../data/toolsData';

interface ToolLayoutProps {
  tool: ToolDefinition;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, onShowToast }) => {
  const [inputText, setInputText] = useState('');
  const [secondaryInputText, setSecondaryInputText] = useState('');
  const [options, setOptions] = useState<Record<string, string | number | boolean>>({});
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Initialize options with defaults from tool definition
  useEffect(() => {
    const defaultOpts: Record<string, string | number | boolean> = {};
    if (tool.options) {
      tool.options.forEach(opt => {
        defaultOpts[opt.id] = opt.defaultValue;
      });
    }
    setOptions(defaultOpts);
    setInputText(tool.examples[0]?.input || '');
    setSecondaryInputText('');
    setOutputText('');
    setErrorMessage(null);
  }, [tool]);

  // Live input metrics
  const inputMetrics = calculateReadability(inputText);
  const outputMetrics = calculateReadability(outputText);

  const handleOptionChange = (id: string, value: string | number | boolean) => {
    setOptions(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async (mode: 'generate' | 'improve' | 'rewrite' | 'shorten' | 'expand' = 'generate') => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter input text before generating.');
      onShowToast('Please enter input text.', 'error');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const endpoint =
        mode === 'improve'
          ? '/api/v1/ai/improve'
          : mode === 'rewrite'
          ? '/api/v1/ai/rewrite'
          : '/api/v1/ai/generate';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: tool.slug,
          input: mode === 'generate' ? inputText : (outputText || inputText),
          secondaryInput: secondaryInputText,
          options,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const msg = data.message || data.error || 'Failed to generate output.';
        setErrorMessage(msg);
        onShowToast(msg, 'error');
      } else {
        setOutputText(data.output);
        onShowToast('Generated successfully!', 'success');
      }
    } catch (err: any) {
      console.error('API Error:', err);
      const msg = 'Network error or service unavailable. Please check your connection and retry.';
      setErrorMessage(msg);
      onShowToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    const ok = await copyToClipboard(outputText);
    if (ok) {
      setCopied(true);
      onShowToast('Copied output to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      onShowToast('Failed to copy output.', 'error');
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    downloadAsTxt(outputText, `${tool.slug}-output.txt`);
    onShowToast('Downloaded document as TXT file.', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Tool Header Section */}
      <section className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#AAB8D0]">
          <span className="capitalize">{tool.category.replace('-', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span>{tool.isFreeClientSide ? 'Client-Side Utility' : 'AI-Powered Generator'}</span>
          {tool.badge && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#4776FF] font-semibold">{tool.badge}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFF] tracking-tight text-balance">
          {tool.title}
        </h1>
        <p className="text-sm sm:text-base text-[#AAB8D0] max-w-3xl leading-relaxed">
          {tool.fullDescription}
        </p>
      </section>

      {/* Dedicated Workspace: PDF / Image / Student / Free Utility / AI Studio */}
      {tool.slug === 'ai-image-generator' || tool.toolType === 'ai-image' ? (
        <AiImageGeneratorPanel tool={tool} onShowToast={onShowToast} />
      ) : tool.toolType === 'pdf' || tool.category === 'pdf-tools' ? (
        <PdfToolsPanel tool={tool} onShowToast={onShowToast} />
      ) : tool.toolType === 'image' || tool.category === 'image-tools' ? (
        <ImageToolsPanel tool={tool} onShowToast={onShowToast} />
      ) : tool.toolType === 'student' || tool.category === 'student-tools' ? (
        ['word-counter', 'character-counter', 'reading-time-calculator'].includes(tool.slug) ? (
          <FreeUtilitiesPanel
            tool={tool}
            onAiUpgrade={(text) => {
              setInputText(text);
              handleGenerate('generate');
            }}
            onShowToast={onShowToast}
          />
        ) : (
          <StudentToolsPanel tool={tool} onShowToast={onShowToast} />
        )
      ) : tool.isFreeClientSide ? (
        <FreeUtilitiesPanel
          tool={tool}
          onAiUpgrade={(text) => {
            setInputText(text);
            handleGenerate('generate');
          }}
          onShowToast={onShowToast}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Form & Input Area */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="tool-main-input" className="text-xs font-semibold text-[#F8FAFF]">
                  {tool.inputLabel}
                </label>
                <div className="text-xs text-[#AAB8D0] font-mono tabular-nums">
                  <span>{inputMetrics.words} words</span>
                  <span aria-hidden="true" className="mx-1">·</span>
                  <span>{inputMetrics.characters} chars</span>
                </div>
              </div>
              <textarea
                id="tool-main-input"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={tool.inputPlaceholder}
                rows={6}
                className="w-full p-3.5 text-sm rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF] transition-colors"
              />
            </div>

            {/* Optional Secondary Input */}
            {tool.secondaryInputLabel && (
              <div className="space-y-1.5">
                <label htmlFor="tool-secondary-input" className="text-xs font-semibold text-[#F8FAFF]">
                  {tool.secondaryInputLabel}
                </label>
                <textarea
                  id="tool-secondary-input"
                  value={secondaryInputText}
                  onChange={e => setSecondaryInputText(e.target.value)}
                  placeholder={tool.secondaryInputPlaceholder}
                  rows={3}
                  className="w-full p-3 text-sm rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF] transition-colors"
                />
              </div>
            )}

            {/* Tool-Specific Options */}
            {tool.options && tool.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#263653]">
                {tool.options.map(opt => (
                  <div key={opt.id} className="space-y-1">
                    <label htmlFor={`opt-${opt.id}`} className="text-xs font-semibold text-[#F8FAFF]">
                      {opt.label}
                    </label>
                    {opt.type === 'select' && (
                      <select
                        id={`opt-${opt.id}`}
                        value={String(options[opt.id] ?? opt.defaultValue)}
                        onChange={e => handleOptionChange(opt.id, e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                      >
                        {opt.options?.map(choice => (
                          <option key={choice.value} value={choice.value} className="bg-[#0D1424] text-[#F8FAFF]">
                            {choice.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#263653] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setSecondaryInputText('');
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30] rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputText(tool.examples[0]?.input || '')}
                  className="px-3.5 py-2 text-xs font-medium text-[#4776FF] hover:bg-[#111B30] rounded-xl transition-colors"
                >
                  Load Example
                </button>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleGenerate('generate')}
                className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4776FF] ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message Notification */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1">
                  <p className="font-semibold">Unable to complete request</p>
                  <p className="leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Output & Refinement Studio */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#F8FAFF]">Generated Output</span>
                {outputText && (
                  <span className="text-[11px] text-[#AAB8D0] font-mono tabular-nums">
                    ({outputMetrics.words} words · {outputMetrics.readingTimeMinutes} min read)
                  </span>
                )}
              </div>

              {outputText && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-2 text-[#AAB8D0] hover:text-[#F8FAFF] rounded-xl hover:bg-[#111B30] transition-colors"
                    title="Download output as TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F8FAFF] bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Editable Output Textarea */}
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-[#070B14]/80 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center gap-2 z-10">
                  <div className="w-7 h-7 border-2 border-[#4776FF] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-[#F8FAFF]">
                    Drafting content with Gemini AI...
                  </span>
                </div>
              )}

              <textarea
                value={outputText}
                onChange={e => setOutputText(e.target.value)}
                placeholder="Generated text will appear here. You can edit the text directly, regenerate, or trigger quick improvements."
                rows={12}
                className="w-full p-4 text-sm rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF] transition-colors font-sans leading-relaxed"
              />
            </div>

            {/* Refinement Actions */}
            {outputText && (
              <div className="pt-3 border-t border-[#263653] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#AAB8D0] font-medium">Quick Refinements:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleGenerate('improve')}
                    className="px-3 py-1.5 rounded-xl bg-[#111B30] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
                  >
                    Improve Flow
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleGenerate('shorten')}
                    className="px-3 py-1.5 rounded-xl bg-[#111B30] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
                  >
                    Make Shorter
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleGenerate('expand')}
                    className="px-3 py-1.5 rounded-xl bg-[#111B30] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
                  >
                    Expand
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleGenerate('rewrite')}
                    className="px-3 py-1.5 rounded-xl bg-[#111B30] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monetization / Sponsorship Slot */}
      <AdBannerPlaceholder slotId={`tool-${tool.slug}`} />

      {/* Editorial Content: Instructions & Step-by-Step Guide */}
      <section className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#F8FAFF]">
          How to Use the {tool.title}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#AAB8D0]">
          {tool.instructions.map((inst, index) => (
            <li key={index} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="font-mono font-bold text-[#4776FF] shrink-0">
                0{index + 1}.
              </span>
              <span className="leading-relaxed text-[#F8FAFF]">{inst}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQs Accordion */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#F8FAFF]">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-[#263653] rounded-2xl bg-[#0D1424] border border-[#263653] overflow-hidden shadow-xl">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-[#F8FAFF] hover:bg-[#111B30] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#AAB8D0] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#AAB8D0] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools Links */}
      {tool.relatedSlugs && tool.relatedSlugs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#263653]">
          <h2 className="text-base font-bold text-[#F8FAFF]">
            Recommended Writing Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tool.relatedSlugs
              .map(slug => TOOL_MAP[slug])
              .filter(Boolean)
              .map(rel => (
                <Link
                  key={rel.slug}
                  to={`/${rel.slug}`}
                  className="p-4 rounded-2xl bg-[#0D1424] border border-[#263653] hover:border-[#4776FF] transition-colors group shadow-xl"
                >
                  <span className="text-[11px] text-[#AAB8D0] capitalize">
                    {rel.category.replace('-', ' ')}
                  </span>
                  <h3 className="text-xs font-semibold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors mt-1">
                    {rel.title}
                  </h3>
                  <p className="text-[11px] text-[#AAB8D0] line-clamp-2 mt-1">
                    {rel.shortDescription}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};
