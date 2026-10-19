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
  ChevronRight,
  Home,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileText,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import { copyToClipboard, downloadAsTxt } from '../../utils/downloadUtils';
import { calculateReadability } from '../../utils/textUtils';
import { FreeUtilitiesPanel } from './FreeUtilitiesPanel';
import { PdfToolsPanel } from './PdfToolsPanel';
import { ImageToolsPanel } from './ImageToolsPanel';
import { StudentToolsPanel } from './StudentToolsPanel';
import { AiImageGeneratorPanel } from './AiImageGeneratorPanel';
import { TextDesignEditor } from './TextDesignEditor';
import { AdBannerPlaceholder } from '../common/AdBannerPlaceholder';
import { TOOL_MAP, TOOL_CATEGORIES } from '../../data/toolsData';
import { getToolSeoData, ToolSeoData } from '../../data/toolSeoContent';
import { updateDocumentSeo } from '../../utils/seoUtils';
import { recordToolUsage } from '../../utils/usageHistoryUtils';

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

  const seoData: ToolSeoData = getToolSeoData(tool);
  const categoryInfo = TOOL_CATEGORIES.find((c) => c.id === tool.category);

  // Initialize options and SEO metadata whenever tool changes
  useEffect(() => {
    const defaultOpts: Record<string, string | number | boolean> = {};
    if (tool.options) {
      tool.options.forEach((opt) => {
        defaultOpts[opt.id] = opt.defaultValue;
      });
    }
    setOptions(defaultOpts);
    setInputText(tool.examples[0]?.input || '');
    setSecondaryInputText('');
    setOutputText('');
    setErrorMessage(null);
    setOpenFaqIndex(0);

    // Dynamic SEO update with rich Schema.org structured data
    updateDocumentSeo({
      title: seoData.seoTitle,
      description: seoData.metaDescription,
      canonicalPath: `/tools/${tool.slug}`,
      keywords: [seoData.primaryKeyword, ...seoData.secondaryKeywords],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: categoryInfo?.name || 'Tools', url: `/category/${tool.category}` },
        { name: tool.title, url: `/tools/${tool.slug}` },
      ],
      faqs: seoData.faqs,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.title,
        description: tool.shortDescription,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    });
  }, [tool.slug]);

  // Live input metrics for text tools
  const inputMetrics = calculateReadability(inputText);
  const outputMetrics = calculateReadability(outputText);

  const handleOptionChange = (id: string, value: string | number | boolean) => {
    setOptions((prev) => ({ ...prev, [id]: value }));
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
        recordToolUsage(tool.slug, 'success');
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
      {/* 1. Tool Header & Breadcrumbs Section */}
      <section className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0] flex-wrap">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to={`/category/${tool.category}`} className="hover:text-[#F8FAFF] transition-colors capitalize">
            {categoryInfo?.name || tool.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            {tool.title}
          </span>
        </nav>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-[#111A2E] border border-[#263653] text-[#AAB8D0] font-medium capitalize">
            {tool.category.replace('-', ' ')}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            tool.isFreeClientSide
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
              : 'bg-indigo-950/60 text-[#4776FF] border border-indigo-800'
          }`}>
            {tool.isFreeClientSide ? '100% Client-Side Privacy' : 'Generative AI Studio'}
          </span>
          {tool.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#4776FF]/20 text-[#4776FF] border border-[#4776FF]/40 text-xs font-semibold">
              {tool.badge}
            </span>
          )}
        </div>

        {/* H1 Heading & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFF] tracking-tight">
            {tool.title}
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] max-w-4xl leading-relaxed">
            {tool.fullDescription}
          </p>
        </div>
      </section>

      {/* 2. Working Tool Interface & Live Result Preview */}
      {tool.slug === 'text-design-tool' || tool.toolType === 'text-design' ? (
        <TextDesignEditor onShowToast={onShowToast} />
      ) : tool.slug === 'ai-image-generator' || tool.toolType === 'ai-image' ? (
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
                onChange={(e) => setInputText(e.target.value)}
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
                  onChange={(e) => setSecondaryInputText(e.target.value)}
                  placeholder={tool.secondaryInputPlaceholder}
                  rows={3}
                  className="w-full p-3 text-sm rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF] transition-colors"
                />
              </div>
            )}

            {/* Tool-Specific Options */}
            {tool.options && tool.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#263653]">
                {tool.options.map((opt) => (
                  <div key={opt.id} className="space-y-1">
                    <label htmlFor={`opt-${opt.id}`} className="text-xs font-semibold text-[#F8FAFF]">
                      {opt.label}
                    </label>
                    {opt.type === 'select' && (
                      <select
                        id={`opt-${opt.id}`}
                        value={String(options[opt.id] ?? opt.defaultValue)}
                        onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                      >
                        {opt.options?.map((choice) => (
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

          {/* Right Column: Live Output & Refinement Studio */}
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
                onChange={(e) => setOutputText(e.target.value)}
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

      {/* 3. Deep Tool-Specific SEO Information Section */}
      <div className="space-y-6 pt-4 border-t border-[#263653]/60">
        
        {/* Section A: What Is [Tool Name]? */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4776FF] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Comprehensive Tool Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            What Is the {tool.title}?
          </h2>
          <div className="space-y-3 text-sm text-[#AAB8D0] leading-relaxed">
            {seoData.whatIs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Section B: What You Can Do With This Tool (Key Capabilities) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            Key Features and Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {seoData.capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#090F1D] border border-[#263653]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#F8FAFF] leading-relaxed">{cap}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section C: Step-by-Step "How to Use" Guide */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            How to Use the {tool.title} (Step-by-Step)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoData.stepByStep.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#4776FF] px-2 py-0.5 rounded-md bg-[#111A2E] border border-[#263653]">
                    0{idx + 1}
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold text-[#F8FAFF]">
                    {item.step}
                  </h3>
                </div>
                <p className="text-xs text-[#AAB8D0] leading-relaxed pl-8">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section D: Supported Formats & Technical Limits */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            Supported Formats & Technical Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <span className="text-[#AAB8D0] font-medium block">Accepted Inputs</span>
              <ul className="space-y-1 text-[#F8FAFF]">
                {seoData.supportedFormats.inputs.map((inp, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4776FF]" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <span className="text-[#AAB8D0] font-medium block">Supported Outputs</span>
              <ul className="space-y-1 text-[#F8FAFF]">
                {seoData.supportedFormats.outputs.map((out, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <span className="text-[#AAB8D0] font-medium block">Processing Capacity</span>
              <p className="text-[#F8FAFF] font-medium leading-relaxed">
                {seoData.supportedFormats.maxLimit}
              </p>
            </div>
          </div>
        </section>

        {/* Section E: Who Can Use This Tool? */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4776FF] uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Target Audience & Personas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            Who Should Use the {tool.title}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {seoData.targetAudience.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1.5"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-[#F8FAFF]">
                  {item.persona}
                </h3>
                <p className="text-xs text-[#AAB8D0] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section F: Practical Examples & Real Use Cases */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            Real-World Use Cases & Practical Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoData.realUseCases.map((uc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2.5"
              >
                <h3 className="text-sm font-bold text-[#F8FAFF]">
                  {uc.title}
                </h3>
                <p className="text-xs text-[#AAB8D0] leading-relaxed">
                  <strong className="text-[#F8FAFF]">Scenario:</strong> {uc.scenario}
                </p>
                <p className="text-xs text-emerald-400 leading-relaxed">
                  <strong className="text-[#F8FAFF]">Key Benefit:</strong> {uc.benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section G: Privacy & Security Verified Details */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Privacy & Execution Architecture</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFF]">
            Data Security & Technical Limitations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#AAB8D0] pt-1">
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1">
              <span className="font-semibold text-[#F8FAFF] block">Privacy Commitment</span>
              <p className="leading-relaxed">{seoData.limitationsAndPrivacy.privacy}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1">
              <span className="font-semibold text-[#F8FAFF] block">Operational Boundaries</span>
              <p className="leading-relaxed">{seoData.limitationsAndPrivacy.limitations}</p>
            </div>
          </div>
        </section>

        {/* Section H: Frequently Asked Questions (FAQPage) */}
        {seoData.faqs && seoData.faqs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4776FF] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Answers to Common Queries</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
              Frequently Asked Questions About {tool.title}
            </h2>
            <div className="divide-y divide-[#263653] rounded-2xl bg-[#0D1424] border border-[#263653] overflow-hidden shadow-xl">
              {seoData.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-xs sm:text-sm text-[#F8FAFF] hover:bg-[#111B30] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#AAB8D0] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#AAB8D0] leading-relaxed pt-1">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section I: Related Recommended Tools with Crawlable Links */}
        {tool.relatedSlugs && tool.relatedSlugs.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-[#263653]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
              Explore Related {categoryInfo?.name || 'Studio'} Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tool.relatedSlugs
                .map((slug) => TOOL_MAP[slug])
                .filter(Boolean)
                .map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/tools/${rel.slug}`}
                    className="p-5 rounded-2xl bg-[#0D1424] border border-[#263653] hover:border-[#4776FF] transition-all group shadow-xl hover:-translate-y-0.5"
                  >
                    <span className="text-[11px] text-[#AAB8D0] font-mono capitalize">
                      {rel.category.replace('-', ' ')}
                    </span>
                    <h3 className="text-sm font-semibold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors mt-1">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[#AAB8D0] line-clamp-2 mt-1.5 leading-relaxed">
                      {rel.shortDescription}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#4776FF] font-medium mt-3">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
