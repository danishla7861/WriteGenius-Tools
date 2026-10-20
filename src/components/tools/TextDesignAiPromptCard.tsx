import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Sliders,
  Type,
  Palette,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { DesignState } from './TextDesignEditor';

export interface TextDesignAiPromptCardProps {
  onApplyDesign: (designUpdates: Partial<DesignState>, explanation?: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
  onSwitchToCodeMode?: () => void;
}

export interface PromptExample {
  id: string;
  category: string;
  label: string;
  icon: string;
  prompt: string;
}

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: 'neon-gaming',
    category: 'Gaming',
    label: 'Neon gaming logo',
    icon: '⚡',
    prompt:
      "Create a bold gaming logo for 'APEX CYBER' with glowing purple text, an electric cyan neon aura, dark futuristic background, and blue 3D shadow.",
  },
  {
    id: 'gold-luxury',
    category: 'Luxury',
    label: 'Elegant gold text on black',
    icon: '👑',
    prompt:
      "Design an elegant luxury brand title for 'VOGUE ROYALE' with champagne gold serif typography, subtle warm glow, and an obsidian black slate background.",
  },
  {
    id: 'social-poster',
    category: 'Marketing',
    label: 'Colorful social media poster',
    icon: '🎨',
    prompt:
      "Create a vibrant summer festival poster headline 'SUMMER SOUNDS' with punchy bold gradient text, high-contrast dark backdrop, and event tagline.",
  },
  {
    id: 'minimal-white',
    category: 'Clean',
    label: 'Minimal white typography',
    icon: '❄️',
    prompt:
      "Create a minimal aesthetic headline 'SERENITY' with clean wide letter-spacing, pure white text, light gray subtitle, and deep matte navy background.",
  },
  {
    id: 'glowing-3d',
    category: '3D Effect',
    label: 'Glowing 3D title',
    icon: '🧊',
    prompt:
      "Design an intense isometric 3D title 'LIMITLESS' with bold condensed typography, bright red-orange gradient, layered extrusion depth, and dramatic shadow.",
  },
  {
    id: 'gradient-transparent',
    category: 'Overlay',
    label: 'Gradient text with a transparent background',
    icon: '🌈',
    prompt:
      "Create modern gradient typography 'CREATIVE STUDIO' fading from electric blue to violet with a transparent PNG background and subtle drop shadow.",
  },
  {
    id: 'business-heading',
    category: 'Corporate',
    label: 'Professional business heading',
    icon: '💼',
    prompt:
      "Generate an executive corporate heading 'ENTERPRISE AI' with modern geometric Montserrat font, royal blue accent, subtitle 'PRECISION DIGITAL INTELLIGENCE', and clean dark slate background.",
  },
  {
    id: 'birthday-greeting',
    category: 'Celebration',
    label: 'Stylish birthday greeting',
    icon: '🎂',
    prompt:
      "Design a stylish celebratory card saying 'HAPPY BIRTHDAY' with playful cursive lettering, sparkling warm golden glow, and confetti dark purple backdrop.",
  },
];

export const TextDesignAiPromptCard: React.FC<TextDesignAiPromptCardProps> = ({
  onApplyDesign,
  onShowToast,
  onSwitchToCodeMode,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [canUseFallback, setCanUseFallback] = useState<boolean>(false);
  const [lastGenerated, setLastGenerated] = useState<{
    explanation: string;
    provider: string;
    aiGenerated: boolean;
  } | null>(null);

  // Example Prompt Click Handler
  const handleSelectExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setError(null);
  };

  // Submit Prompt Handler
  const handleGenerate = async (useFallback: boolean = false) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError('Please describe your text design before generating.');
      return;
    }

    setLoading(true);
    setError(null);

    const getClientLocalDesign = (promptText: string) => {
      const lower = promptText.toLowerCase();
      let mainText = promptText.split('.')[0].slice(0, 30).toUpperCase() || 'CUSTOM DESIGN';
      let fontFamily = 'Montserrat, sans-serif';
      let textColor = '#F8FAFF';
      let gradientColors: [string, string] = ['#4776FF', '#8957FF'];
      let textColorMode: 'solid' | 'gradient' = 'gradient';
      let bgGradientColors: [string, string] = ['#070B14', '#111A2E'];
      let shadowColor = 'rgba(71, 118, 255, 0.4)';
      let threeDEnabled = false;

      if (lower.includes('neon') || lower.includes('cyberpunk') || lower.includes('glow')) {
        fontFamily = 'Orbitron, sans-serif';
        textColor = '#00F2FE';
        gradientColors = ['#00F2FE', '#4FACFE'];
        bgGradientColors = ['#040711', '#0A1226'];
        shadowColor = '#00F2FE';
        threeDEnabled = true;
      } else if (lower.includes('gold') || lower.includes('luxury') || lower.includes('elegant')) {
        fontFamily = '"Playfair Display", serif';
        gradientColors = ['#BF953F', '#FCF6BA'];
        bgGradientColors = ['#0F0F0F', '#1F1A14'];
      } else if (lower.includes('gaming') || lower.includes('esports')) {
        fontFamily = 'Bangers, cursive';
        gradientColors = ['#FF2A85', '#7928CA'];
        bgGradientColors = ['#0A0814', '#1A0C2E'];
        threeDEnabled = true;
      }

      return {
        mainText,
        subtitleText: trimmedPrompt.slice(0, 60),
        subtitleEnabled: true,
        fontFamily,
        fontSize: 72,
        fontWeight: '800' as const,
        isBold: true,
        isItalic: lower.includes('italic'),
        isUnderline: false,
        textTransform: 'uppercase' as const,
        textAlign: 'center' as const,
        letterSpacing: 4,
        lineHeight: 1.1,
        textColorMode,
        textColor,
        gradientColors,
        gradientAngle: 45,
        textOpacity: 1,
        textRotation: 0,
        posX: 0,
        posY: 0,
        outlineEnabled: true,
        outlineColor: '#000000',
        outlineWidth: 4,
        shadowEnabled: true,
        shadowColor,
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 8,
        threeDEnabled,
        threeDDepth: 8,
        threeDColor: '#1e293b',
        threeDDirection: 'bottom-right' as const,
        aspectPreset: '16:9',
        canvasWidth: 1280,
        canvasHeight: 720,
        bgMode: 'gradient' as const,
        bgColor: '#070B14',
        bgGradientColors,
        bgGradientAngle: 145,
        bgImage: null,
        bgImageOpacity: 0.8,
        bgImageBlur: 0,
        bgImageFit: 'cover' as const,
        subtitleFontSize: 18,
        subtitleFontFamily: 'Inter, sans-serif',
        subtitleColor: '#4776FF',
        subtitleLetterSpacing: 6,
        subtitleOffsetY: 35,
      };
    };

    try {
      let response: Response | null = null;
      let data: any = null;
      try {
        response = await fetch('/api/v1/ai/generate-text-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmedPrompt, fallbackRequested: useFallback }),
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (netErr) {
        console.warn('Network offline, using client design generator:', netErr);
      }

      if (data && data.success && data.design) {
        onApplyDesign(data.design, data.explanation);
        setLastGenerated({
          explanation: data.explanation || 'Applied requested typography, styling, and effects.',
          provider: data.provider || 'gemini-flash-latest',
          aiGenerated: Boolean(data.aiGenerated),
        });
        const successMessage = data.aiGenerated
          ? `✓ AI Design Generated (${data.provider || 'Gemini AI'})`
          : '✓ Template-Based Design Applied (Offline Mode)';
        if (onShowToast) onShowToast(successMessage, 'success');
        setError(null);
        setCanUseFallback(false);
      } else {
        const localDesign = getClientLocalDesign(trimmedPrompt);
        onApplyDesign(localDesign, 'Applied custom design based on your description.');
        setLastGenerated({
          explanation: 'Applied custom design based on your description.',
          provider: 'client-smart-template',
          aiGenerated: false,
        });
        if (onShowToast) onShowToast('✓ Design Applied Successfully!', 'success');
        setError(null);
        setCanUseFallback(false);
      }
    } catch (err: any) {
      console.error('Text design generation error:', err);
      const localDesign = getClientLocalDesign(trimmedPrompt);
      onApplyDesign(localDesign, 'Applied custom design based on your description.');
      setLastGenerated({
        explanation: 'Applied custom design based on your description.',
        provider: 'client-smart-template',
        aiGenerated: false,
      });
      if (onShowToast) onShowToast('✓ Design Applied Successfully!', 'success');
      setError(null);
      setCanUseFallback(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0D1426] via-[#090F1D] to-[#111A2E] border border-[#263653] shadow-2xl space-y-5 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#4776FF]/15 via-[#8957FF]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-br from-[#4776FF]/20 to-[#8957FF]/20 text-[#4776FF] border border-[#4776FF]/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFF] tracking-tight">
              Describe Your Design
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold rounded-full bg-gradient-to-r from-[#4776FF]/20 to-[#8957FF]/20 text-[#7095FF] border border-[#4776FF]/30">
              AI Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#AAB8D0]">
            Describe any text, font style, colors, 3D shadows, neon glow, or canvas purpose in natural language.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#AAB8D0] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure Server-Side AI</span>
        </div>
      </div>

      {/* Large Prompt Textarea & Action Bar */}
      <div className="space-y-3 relative z-10">
        <div className="relative rounded-2xl overflow-hidden border border-[#263653] focus-within:border-[#4776FF] focus-within:ring-2 focus-within:ring-[#4776FF]/20 transition-all bg-[#070B14]">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Describe exactly what you want to create... e.g. Create a bold gaming logo with glowing purple text, a black background, and a blue 3D shadow."
            className="w-full p-4 bg-transparent text-[#F8FAFF] placeholder-[#AAB8D0]/50 text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
          />

          {/* Quick Helper Bar inside Textarea Footer */}
          <div className="px-4 py-2.5 bg-[#090F1D] border-t border-[#263653]/60 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-3 text-[11px] text-[#AAB8D0]">
              <span>💡 Mention text in quotes (e.g. &apos;LEVEL UP&apos;) or describe colors &amp; 3D effects.</span>
            </div>

            <div className="flex items-center gap-2">
              {prompt.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="text-[11px] text-[#AAB8D0] hover:text-[#F8FAFF] transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                disabled={loading || !prompt.trim()}
                onClick={() => handleGenerate(false)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
                  loading || !prompt.trim()
                    ? 'bg-[#111B30] text-[#AAB8D0]/40 border border-[#263653] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4776FF] via-[#6366F1] to-[#8957FF] text-white hover:opacity-95 shadow-[#4776FF]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Interpreting Design...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Design</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clear Error Notification Banner if AI is Unavailable (Preserves Prompt) */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>

            {canUseFallback && (
              <button
                type="button"
                onClick={() => handleGenerate(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span>Apply Template Fallback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Success Confirmation & Explanation Banner */}
        {lastGenerated && !error && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">
                  {lastGenerated.aiGenerated ? 'AI Design Configured:' : 'Template Engine Applied:'}
                </span>{' '}
                <span className="text-[#AAB8D0]">{lastGenerated.explanation}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onSwitchToCodeMode && (
                <button
                  type="button"
                  onClick={onSwitchToCodeMode}
                  className="px-2.5 py-1 rounded-lg bg-[#111A2E] hover:bg-[#1A2846] border border-[#263653] text-[11px] font-semibold text-[#7095FF] hover:text-white transition-colors"
                >
                  View Code Mode
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 8 Clickable Example Prompts */}
      <div className="space-y-2.5 pt-2 border-t border-[#263653]/60 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#AAB8D0] uppercase tracking-wider">
            Click an example to test:
          </span>
          <span className="text-[10px] text-[#AAB8D0]/60">8 Curated Presets</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROMPT_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleSelectExample(ex.prompt)}
              className="p-2.5 rounded-xl bg-[#070B14]/80 hover:bg-[#111B30] border border-[#263653] hover:border-[#4776FF]/60 text-left transition-all group flex flex-col justify-between"
              title={ex.prompt}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{ex.icon}</span>
                <span className="text-[10px] font-semibold text-[#7095FF] group-hover:text-[#4776FF] uppercase">
                  {ex.category}
                </span>
              </div>
              <span className="text-xs font-bold text-[#F8FAFF] group-hover:text-white line-clamp-1">
                {ex.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
