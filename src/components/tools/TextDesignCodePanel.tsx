import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Eye,
  Settings2,
  Sparkles,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Code2,
  WrapText,
  Type,
  Maximize2,
  RefreshCw,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { DesignState } from './TextDesignEditor';
import {
  CodeFormat,
  CODE_FORMAT_OPTIONS,
  CodeGeneratorOptions,
  DEFAULT_CODE_OPTIONS,
  getCodeForFormat,
  getFileExtensionForFormat,
  getFilenameForFormat,
  buildCssTextShadow,
  buildCssBackground,
} from '../../utils/textDesignCodeGenerator';

export interface TextDesignCodePanelProps {
  state: DesignState;
  updateState: (updater: Partial<DesignState> | ((prev: DesignState) => DesignState)) => void;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
  onSwitchToDesignMode?: () => void;
}

export const TextDesignCodePanel: React.FC<TextDesignCodePanelProps> = ({
  state,
  updateState,
  onShowToast,
  onSwitchToDesignMode,
}) => {
  // Active Code Language Format
  const [activeFormat, setActiveFormat] = useState<CodeFormat>('html-css');

  // Generator Options
  const [options, setOptions] = useState<CodeGeneratorOptions>(DEFAULT_CODE_OPTIONS);

  // Editor View Settings
  const [isWordWrap, setIsWordWrap] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base'>('sm');
  const [previewTab, setPreviewTab] = useState<'dom' | 'svg' | 'canvas'>('dom');
  const [viewportWidth, setViewportWidth] = useState<'100%' | '768px' | '375px'>('100%');

  // Copy Feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Canvas ref for canvas preview mode
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate Code based on active format and options
  const generatedCode = useMemo(() => {
    return getCodeForFormat(activeFormat, state, options);
  }, [activeFormat, state, options]);

  // Code Stats
  const lineCount = useMemo(() => generatedCode.split('\n').length, [generatedCode]);
  const charCount = useMemo(() => generatedCode.length, [generatedCode]);
  const filename = useMemo(() => getFilenameForFormat(activeFormat, state), [activeFormat, state]);

  // Render Canvas when canvas preview is active
  useEffect(() => {
    if (previewTab !== 'canvas' || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;

    // Background
    if (state.bgMode === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, state.bgGradientColors[0]);
      grad.addColorStop(1, state.bgGradientColors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (state.bgMode === 'color') {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    const cx = canvas.width / 2 + state.posX;
    const cy = canvas.height / 2 + state.posY;
    ctx.translate(cx, cy);

    if (state.textRotation !== 0) {
      ctx.rotate((state.textRotation * Math.PI) / 180);
    }

    ctx.font = `${state.isItalic ? 'italic ' : ''}${state.fontWeight} ${state.fontSize}px ${state.fontFamily}`;
    ctx.textAlign = state.textAlign;
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = state.textOpacity;

    if (state.shadowEnabled) {
      ctx.shadowColor = state.shadowColor;
      ctx.shadowBlur = state.shadowBlur;
      ctx.shadowOffsetX = state.shadowOffsetX;
      ctx.shadowOffsetY = state.shadowOffsetY;
    }

    if (state.textColorMode === 'gradient') {
      const textGrad = ctx.createLinearGradient(-canvas.width / 4, 0, canvas.width / 4, 0);
      textGrad.addColorStop(0, state.gradientColors[0]);
      textGrad.addColorStop(1, state.gradientColors[1]);
      ctx.fillStyle = textGrad;
    } else {
      ctx.fillStyle = state.textColor;
    }

    if (state.outlineEnabled && state.outlineWidth > 0) {
      ctx.strokeStyle = state.outlineColor;
      ctx.lineWidth = state.outlineWidth * 2;
      ctx.strokeText(state.mainText, 0, 0);
    }

    ctx.fillText(state.mainText, 0, 0);

    if (state.subtitleEnabled && state.subtitleText) {
      ctx.shadowColor = 'transparent';
      ctx.font = `600 ${state.subtitleFontSize}px ${state.subtitleFontFamily || 'Inter, sans-serif'}`;
      ctx.fillStyle = state.subtitleColor;
      ctx.fillText(state.subtitleText.toUpperCase(), 0, state.subtitleOffsetY || 35);
    }

    ctx.restore();
  }, [state, previewTab]);

  // Copy Code Handler
  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = generatedCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (onShowToast) onShowToast(`Copied ${filename} to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      if (onShowToast) onShowToast('Failed to copy to clipboard', 'error');
    }
  };

  // Download Code Handler
  const handleDownloadCode = () => {
    try {
      const mimeTypes: Record<CodeFormat, string> = {
        'html-css': 'text/html;charset=utf-8',
        'html': 'text/html;charset=utf-8',
        'css': 'text/css;charset=utf-8',
        'react': 'text/javascript;charset=utf-8',
        'tailwind': 'text/html;charset=utf-8',
        'svg': 'image/svg+xml;charset=utf-8',
        'javascript': 'text/javascript;charset=utf-8',
      };

      const blob = new Blob([generatedCode], { type: mimeTypes[activeFormat] || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onShowToast) onShowToast(`Downloaded ${filename} successfully!`, 'success');
    } catch (err) {
      if (onShowToast) onShowToast('Download failed', 'error');
    }
  };

  // Toggle Option
  const toggleOption = (key: keyof CodeGeneratorOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Clean formatted code lines
  const codeLines = useMemo(() => generatedCode.split('\n'), [generatedCode]);

  // Computed styles for DOM preview
  const domContainerStyle: React.CSSProperties = useMemo(() => {
    const bg = buildCssBackground(state);
    return {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: `${state.canvasWidth}px`,
      aspectRatio: `${state.canvasWidth} / ${state.canvasHeight}`,
      margin: '0 auto',
      padding: '2.5rem 1.5rem',
      background: bg,
      borderRadius: '1.25rem',
      overflow: 'hidden',
      boxSizing: 'border-box',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
    };
  }, [state]);

  const domTitleStyle: React.CSSProperties = useMemo(() => {
    const shadow = buildCssTextShadow(state);
    const fillStyle: React.CSSProperties = state.textColorMode === 'gradient'
      ? {
          backgroundImage: `linear-gradient(${state.gradientAngle}deg, ${state.gradientColors[0]}, ${state.gradientColors[1]})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }
      : {
          color: state.textColor,
        };

    const outlineStyle: React.CSSProperties = state.outlineEnabled && state.outlineWidth > 0
      ? {
          WebkitTextStroke: `${state.outlineWidth}px ${state.outlineColor}`,
        }
      : {};

    const underlineStyle: React.CSSProperties = state.isUnderline
      ? {
          textDecoration: 'underline',
          textDecorationColor: state.textColor,
        }
      : {};

    return {
      margin: 0,
      fontFamily: state.fontFamily,
      fontSize: options.responsiveContainer
        ? `clamp(1.75rem, 5vw, ${state.fontSize}px)`
        : `${state.fontSize}px`,
      fontWeight: state.fontWeight,
      fontStyle: state.isItalic ? 'italic' : 'normal',
      lineHeight: state.lineHeight,
      letterSpacing: `${state.letterSpacing}px`,
      textAlign: state.textAlign,
      textTransform: state.textTransform,
      opacity: state.textOpacity,
      transform: `rotate(${state.textRotation}deg)`,
      textShadow: shadow.replace(/\n\s+/g, ' '),
      userSelect: 'none',
      ...fillStyle,
      ...outlineStyle,
      ...underlineStyle,
    };
  }, [state, options.responsiveContainer]);

  const domSubtitleStyle: React.CSSProperties = useMemo(() => {
    return {
      marginTop: `${Math.max(12, state.subtitleOffsetY / 2)}px`,
      fontFamily: state.subtitleFontFamily || 'Inter, sans-serif',
      fontSize: `clamp(0.75rem, 1.8vw, ${state.subtitleFontSize}px)`,
      fontWeight: 600,
      color: state.subtitleColor,
      letterSpacing: `${state.subtitleLetterSpacing}px`,
      textAlign: state.textAlign,
      textTransform: 'uppercase',
      userSelect: 'none',
      marginBottom: 0,
    };
  }, [state]);

  return (
    <div className="space-y-6">
      {/* 1. Code Mode Top Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Format Selector Pills / Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090F1D] border border-[#263653] overflow-x-auto max-w-full">
            {CODE_FORMAT_OPTIONS.map((fmt) => {
              const isActive = activeFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setActiveFormat(fmt.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md shadow-[#4776FF]/25'
                      : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{fmt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Copy, Download & Switch Back */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {onSwitchToDesignMode && (
              <button
                type="button"
                onClick={onSwitchToDesignMode}
                className="px-3.5 py-2 rounded-xl bg-[#111B30] hover:bg-[#1A2846] border border-[#263653] text-xs font-medium text-[#AAB8D0] hover:text-[#F8FAFF] flex items-center gap-1.5 transition-colors"
                title="Return to visual canvas editor"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4776FF]" />
                <span className="hidden sm:inline">Visual Editor</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#111B30] hover:bg-[#1B2945] text-[#F8FAFF] border border-[#263653]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#4776FF]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadCode}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-[#4776FF]/25"
            >
              <Download className="w-4 h-4" />
              <span>Download {getFileExtensionForFormat(activeFormat)}</span>
            </button>
          </div>
        </div>

        {/* Format Explanation & Quick Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#263653]/60 text-xs text-[#AAB8D0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[#F8FAFF]">
              {CODE_FORMAT_OPTIONS.find((f) => f.id === activeFormat)?.description}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-[#AAB8D0]">
            <span>{lineCount} lines</span>
            <span>·</span>
            <span>{(charCount / 1024).toFixed(1)} KB</span>
            <span>·</span>
            <span className="text-[#4776FF] font-semibold">Live Synchronized</span>
          </div>
        </div>
      </div>

      {/* 2. Customizable Options & Quick Text Tweak Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFF]">
            <Settings2 className="w-4 h-4 text-[#4776FF]" />
            <span>Code Customization Options:</span>
          </div>

          {/* Quick Toggle Switches */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Include Container */}
            <button
              type="button"
              onClick={() => toggleOption('includeContainer')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                options.includeContainer
                  ? 'bg-[#111A2E] border-[#4776FF]/60 text-[#4776FF]'
                  : 'bg-[#090F1D] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${options.includeContainer ? 'bg-[#4776FF]' : 'bg-[#263653]'}`} />
              <span>Container Card</span>
            </button>

            {/* Google Fonts Import */}
            <button
              type="button"
              onClick={() => toggleOption('includeFontImport')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                options.includeFontImport
                  ? 'bg-[#111A2E] border-[#4776FF]/60 text-[#4776FF]'
                  : 'bg-[#090F1D] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${options.includeFontImport ? 'bg-[#4776FF]' : 'bg-[#263653]'}`} />
              <span>Google Fonts Link</span>
            </button>

            {/* Inline Styles (HTML/JSX) */}
            {(activeFormat === 'html' || activeFormat === 'react') && (
              <button
                type="button"
                onClick={() => toggleOption('inlineStyles')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  options.inlineStyles
                    ? 'bg-[#111A2E] border-[#4776FF]/60 text-[#4776FF]'
                    : 'bg-[#090F1D] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${options.inlineStyles ? 'bg-[#4776FF]' : 'bg-[#263653]'}`} />
                <span>Inline Styles</span>
              </button>
            )}

            {/* TypeScript Toggle for React */}
            {activeFormat === 'react' && (
              <button
                type="button"
                onClick={() => toggleOption('jsxTypeScript')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  options.jsxTypeScript
                    ? 'bg-[#111A2E] border-[#4776FF]/60 text-[#4776FF]'
                    : 'bg-[#090F1D] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${options.jsxTypeScript ? 'bg-[#4776FF]' : 'bg-[#263653]'}`} />
                <span>TypeScript (TSX)</span>
              </button>
            )}

            {/* Responsive Container Clamp */}
            <button
              type="button"
              onClick={() => toggleOption('responsiveContainer')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                options.responsiveContainer
                  ? 'bg-[#111A2E] border-[#4776FF]/60 text-[#4776FF]'
                  : 'bg-[#090F1D] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${options.responsiveContainer ? 'bg-[#4776FF]' : 'bg-[#263653]'}`} />
              <span>Fluid CSS Clamp</span>
            </button>
          </div>
        </div>

        {/* Quick Text Synchronizer Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#263653]/60">
          <div>
            <label className="block text-[11px] font-semibold text-[#AAB8D0] uppercase tracking-wider mb-1">
              Headline Text (Live Sync):
            </label>
            <input
              type="text"
              value={state.mainText}
              onChange={(e) => updateState({ mainText: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-[#070B14] border border-[#263653] text-[#F8FAFF] text-xs font-medium focus:border-[#4776FF] focus:outline-none transition-colors"
              placeholder="Enter headline..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#AAB8D0] uppercase tracking-wider mb-1">
              Subtitle Text (Live Sync):
            </label>
            <input
              type="text"
              value={state.subtitleText}
              onChange={(e) => updateState({ subtitleText: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-[#070B14] border border-[#263653] text-[#F8FAFF] text-xs font-medium focus:border-[#4776FF] focus:outline-none transition-colors"
              placeholder="Enter subtitle..."
            />
          </div>
        </div>
      </div>

      {/* 3. Main Dual-Column: Code Viewer + Live Rendered DOM Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code Display */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl bg-[#070B14] border border-[#263653] shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Top Bar with File Tab & View Toggles */}
            <div className="px-4 py-2.5 bg-[#0D1426] border-b border-[#263653] flex items-center justify-between flex-wrap gap-2">
              {/* File Name Tab */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <div className="ml-2 px-3 py-1 rounded-lg bg-[#070B14] border border-[#263653] text-xs font-mono font-medium text-[#F8FAFF] flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#4776FF]" />
                  <span>{filename}</span>
                </div>
              </div>

              {/* Editor Preferences: Font Size & Word Wrap */}
              <div className="flex items-center gap-2 text-xs">
                {/* Font Size Button */}
                <button
                  type="button"
                  onClick={() => setFontSize((f) => (f === 'sm' ? 'base' : 'sm'))}
                  className="px-2 py-1 rounded bg-[#111B30] border border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF] flex items-center gap-1"
                  title="Toggle font size"
                >
                  <Type className="w-3 h-3 text-[#4776FF]" />
                  <span className="text-[10px] uppercase font-bold">{fontSize}</span>
                </button>

                {/* Wrap Toggle */}
                <button
                  type="button"
                  onClick={() => setIsWordWrap((w) => !w)}
                  className={`px-2 py-1 rounded border text-[10px] font-bold uppercase flex items-center gap-1 transition-colors ${
                    isWordWrap
                      ? 'bg-[#111A2E] border-[#4776FF]/60 text-[#4776FF]'
                      : 'bg-[#111B30] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
                  }`}
                  title="Toggle word wrap"
                >
                  <WrapText className="w-3 h-3" />
                  <span>{isWordWrap ? 'Wrap' : 'Scroll'}</span>
                </button>
              </div>
            </div>

            {/* Code Content Container with Line Numbers */}
            <div className="relative flex max-h-[640px] overflow-auto select-text font-mono text-xs leading-relaxed">
              {/* Line Numbers Column */}
              <div className="py-4 pl-3 pr-3 select-none text-right font-mono text-[11px] text-[#AAB8D0]/30 border-r border-[#263653]/60 bg-[#060912]">
                {codeLines.map((_, i) => (
                  <div key={i} className="h-5">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Pre Block */}
              <pre
                className={`py-4 px-4 flex-1 text-[#F8FAFF] font-mono transition-all ${
                  fontSize === 'sm' ? 'text-xs' : 'text-sm'
                } ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'}`}
              >
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Live Rendered Preview Side-by-Side */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] shadow-2xl space-y-3">
            {/* Header: Live Render Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">
                  Live Rendered Preview
                </span>
              </div>

              {/* Preview Render Engine Selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#070B14] border border-[#263653] text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreviewTab('dom')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    previewTab === 'dom'
                      ? 'bg-[#4776FF] text-white'
                      : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                  }`}
                  title="Render using live CSS & HTML DOM elements"
                >
                  HTML/CSS
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTab('svg')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    previewTab === 'svg'
                      ? 'bg-[#4776FF] text-white'
                      : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                  }`}
                  title="Render using real Scalable Vector SVG"
                >
                  SVG
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTab('canvas')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    previewTab === 'canvas'
                      ? 'bg-[#4776FF] text-white'
                      : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                  }`}
                  title="Render using HTML5 2D Canvas context"
                >
                  Canvas
                </button>
              </div>
            </div>

            {/* Viewport Width Emulator Buttons */}
            <div className="flex items-center justify-between text-xs text-[#AAB8D0] pt-1">
              <span className="text-[11px]">Test Viewport Scale:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewportWidth('100%')}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    viewportWidth === '100%'
                      ? 'bg-[#111A2E] border-[#4776FF] text-[#4776FF]'
                      : 'border-transparent text-[#AAB8D0] hover:bg-[#111B30]'
                  }`}
                  title="Full Width (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewportWidth('768px')}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    viewportWidth === '768px'
                      ? 'bg-[#111A2E] border-[#4776FF] text-[#4776FF]'
                      : 'border-transparent text-[#AAB8D0] hover:bg-[#111B30]'
                  }`}
                  title="Tablet Width (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewportWidth('375px')}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    viewportWidth === '375px'
                      ? 'bg-[#111A2E] border-[#4776FF] text-[#4776FF]'
                      : 'border-transparent text-[#AAB8D0] hover:bg-[#111B30]'
                  }`}
                  title="Mobile Width (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div
              className="relative rounded-2xl overflow-hidden border border-[#263653] p-4 flex items-center justify-center min-h-[380px] bg-[#070B14] transition-all"
              style={{
                maxWidth: viewportWidth,
                margin: '0 auto',
              }}
            >
              {/* Option A: Real DOM Preview */}
              {previewTab === 'dom' && (
                <div style={domContainerStyle}>
                  <div
                    style={{
                      transform: `translate(${state.posX}px, ${state.posY}px)`,
                      textAlign: state.textAlign,
                      width: '100%',
                    }}
                  >
                    <h1 style={domTitleStyle}>{state.mainText}</h1>
                    {state.subtitleEnabled && state.subtitleText && (
                      <p style={domSubtitleStyle}>{state.subtitleText}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Option B: SVG Preview */}
              {previewTab === 'svg' && (
                <div
                  className="w-full flex items-center justify-center max-w-full overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: getCodeForFormat('svg', state, { ...options, includeContainer: true }),
                  }}
                />
              )}

              {/* Option C: Canvas Preview */}
              {previewTab === 'canvas' && (
                <div className="w-full flex items-center justify-center">
                  <canvas
                    ref={previewCanvasRef}
                    className="max-w-full max-h-[360px] object-contain rounded-xl shadow-2xl"
                    style={{
                      aspectRatio: `${state.canvasWidth} / ${state.canvasHeight}`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Preview Info Footer */}
            <div className="flex items-center justify-between text-[11px] text-[#AAB8D0] pt-1">
              <span>
                {state.canvasWidth} × {state.canvasHeight} px · {state.fontFamily.replace(/['"]/g, '')}
              </span>
              <span className="text-emerald-400 font-semibold">100% Pure CSS / SVG Compatible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
