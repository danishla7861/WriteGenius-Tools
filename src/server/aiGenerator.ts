import { GoogleGenAI } from '@google/genai';

/**
 * Candidate models in order of priority & reliability.
 * 'gemini-flash-latest' is the primary recommended model for Gemini Flash.
 */
export const CANDIDATE_TEXT_MODELS = [
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-4-argon',
];

/**
 * Executes generateContent through candidate models with automatic failover.
 */
export async function generateWithModelCascade(
  aiClient: GoogleGenAI,
  userPrompt: string,
  systemInstruction: string
): Promise<{ text: string; model: string }> {
  let lastError: any = null;

  for (const model of CANDIDATE_TEXT_MODELS) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text?.trim();
      if (text) {
        return { text, model };
      }
    } catch (err: any) {
      console.warn(`[AI Engine] Model ${model} encountered ${err?.status || err?.message}. Failing over...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All AI candidate models failed to return content.');
}

/**
 * Intelligent local synthesis engine.
 * Guarantees zero application downtime if all upstream cloud models encounter transient 503/429 spikes.
 */
export function generateLocalFallback(payload: {
  toolSlug: string;
  input: string;
  secondaryInput?: string;
  options?: Record<string, any>;
  mode?: string;
}): string {
  const { toolSlug, input, secondaryInput, options = {}, mode = 'generate' } = payload;
  const cleanInput = input.trim();
  const tone = options.tone || 'Professional & Engaging';

  if (mode === 'improve' || toolSlug === 'ai-text-improver') {
    const sentences = cleanInput.split(/(?<=[.?!])\s+/);
    const polished = sentences
      .map((s) => {
        let trimmed = s.trim();
        if (!trimmed) return '';
        trimmed = trimmed.replace(/\bvery\b\s+/gi, '');
        trimmed = trimmed.replace(/\breally\b\s+/gi, '');
        trimmed = trimmed.replace(/\ba lot of\b/gi, 'substantial');
        trimmed = trimmed.replace(/\bin order to\b/gi, 'to');
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      })
      .filter(Boolean)
      .join(' ');

    return `${polished}\n\nKey Improvement Summary: Enhanced structural cadence, eliminated wordiness, and aligned phrasing with a ${tone.toLowerCase()} standard.`;
  }

  if (mode === 'rewrite' || toolSlug === 'paragraph-rewriter') {
    return `In today's fast-evolving landscape, ${cleanInput.toLowerCase().replace(/[.?!]$/, '')}. By implementing a methodical strategy focused on measurable outcomes and structural clarity, professionals and creators can consistently achieve optimal efficiency. Moving forward, prioritizing iterative refinement and clarity ensures long-term sustained impact.`;
  }

  if (toolSlug === 'ai-paragraph-writer') {
    return `${cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1).replace(/[.?!]$/, '')} represents a vital focal point in contemporary discussions. As strategic priorities shift toward efficiency and rigor, understanding the underlying mechanisms of this topic enables actionable breakthroughs. Furthermore, incorporating practical case studies and structured workflows solidifies overall execution. Ultimately, maintaining a consistent focus on these core principles delivers lasting and measurable results.`;
  }

  if (toolSlug === 'ai-essay-writer') {
    return `# Exploring ${cleanInput}\n\n## Introduction\nThe discourse surrounding ${cleanInput.toLowerCase()} has emerged as one of the most significant intellectual inquiries of recent years. Understanding its historical development, operational dynamics, and broader socioeconomic impact is essential for comprehensive analysis. This essay argues that addressing these fundamental dimensions provides actionable insights for academic, professional, and ethical progression.\n\n## Context & Analytical Framework\nAt its core, ${cleanInput.toLowerCase()} operates within a complex network of interrelated principles. When examined through empirical frameworks, evidence indicates that strategic application directly influences operational productivity and sustainable innovation. Scholars consistently observe that proactive engagement minimizes systemic friction while maximizing long-term efficacy.\n\n## Critical Examination & Practical Dimensions\nBeyond theoretical abstraction, tangible implementation demands careful calibration. Modern workflows that leverage structured methodologies demonstrate higher adaptability and reduced variance in performance. Balancing innovation with rigorous quality standards remains the defining benchmark for success in this domain.\n\n## Conclusion\nIn conclusion, ${cleanInput.toLowerCase()} continues to reshape paradigms across multidisciplinary sectors. By synthesizing theoretical depth with practical agility, researchers and practitioners can navigate complex challenges with confidence. Continued exploration will undoubtedly illuminate new pathways for sustainable progress.`;
  }

  if (toolSlug === 'ai-article-writer') {
    return `# The Definitive Guide to ${cleanInput}\n\n## Introduction\nIn an era defined by rapid technological transformation and information density, mastering **${cleanInput.toLowerCase()}** has evolved from an optional advantage into an indispensable competency. Whether you are leading a team, crafting digital products, or streamlining daily operations, developing a strategic grasp of this domain is critical.\n\n## Key Strategic Pillars\n1. **Foundational Understanding:** Establish clear, measurable benchmarks before committing organizational or personal resources.\n2. **Systemic Integration:** Embed repeatable workflows rather than relying on ad-hoc interventions.\n3. **Continuous Iteration:** Monitor qualitative feedback and quantifiable analytics to refine your approach continually.\n\n## Actionable Takeaways\n- Audit existing processes to identify operational bottlenecks associated with ${cleanInput.toLowerCase()}.\n- Deploy modern productivity utilities to automate routine tasks and preserve cognitive bandwidth.\n- Maintain an adaptive mindset as new industry standards and creative capabilities emerge.\n\n## Final Thoughts\nMastering ${cleanInput.toLowerCase()} is an ongoing journey of continuous learning. By staying grounded in foundational principles while embracing innovative techniques, you position yourself for sustained excellence.`;
  }

  if (toolSlug === 'ai-email-writer' || toolSlug === 'formal-email-writer') {
    return `Subject: Following up regarding ${cleanInput.slice(0, 40)}...\n\nDear [Name / Team],\n\nI hope this email finds you well.\n\nI am reaching out regarding ${cleanInput}. Our objective is to ensure that all deliverables and strategic objectives are seamlessly aligned for the upcoming phase.\n\nPlease let me know your availability for a brief 10-minute catch-up later this week to confirm next steps and address any immediate questions.\n\nThank you for your time and collaboration.\n\nBest regards,\n[Your Name]\n[Your Title / Contact Information]`;
  }

  if (toolSlug.includes('social') || toolSlug.includes('caption') || toolSlug.includes('instagram')) {
    return `🚀 Big breakthrough in ${cleanInput.slice(0, 30)}!\n\nHere are 3 game-changing takeaways you need to know today:\n\n1️⃣ Clarity drives speed—eliminate the noise.\n2️⃣ Consistency compounds faster than occasional intensity.\n3️⃣ Build systems that work even when motivation dips.\n\n💬 What is your biggest priority this week? Drop your thoughts below!\n\n---\n#Productivity #Innovation #Strategy #GrowthMindset #ContentCreation #WriteGenius`;
  }

  return `${cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1).replace(/[.?!]$/, '')}.\n\nBy leveraging structured execution, clear objective setting, and proven industry frameworks, teams and creators can accelerate production while maintaining publication-grade standards. Consistent application of these core principles guarantees high-impact results across all digital channels.`;
}

export interface TextDesignAiResult {
  mainText?: string;
  subtitleText?: string;
  subtitleEnabled?: boolean;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textColorMode?: 'solid' | 'gradient';
  textColor?: string;
  gradientColors?: [string, string];
  gradientAngle?: number;
  textOpacity?: number;
  textRotation?: number;
  posX?: number;
  posY?: number;
  outlineEnabled?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  threeDEnabled?: boolean;
  threeDDepth?: number;
  threeDColor?: string;
  threeDDirection?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  subtitleFontSize?: number;
  subtitleFontFamily?: string;
  subtitleColor?: string;
  subtitleLetterSpacing?: number;
  subtitleOffsetY?: number;
  aspectPreset?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  bgMode?: 'color' | 'gradient' | 'transparent';
  bgColor?: string;
  bgGradientColors?: [string, string];
  bgGradientAngle?: number;
  explanation: string;
}

export interface TextDesignAiResponse {
  success: boolean;
  design?: TextDesignAiResult;
  provider: string;
  explanation: string;
  aiGenerated: boolean;
  error?: string;
  canUseFallback?: boolean;
}

/**
 * Intelligent deterministic local design generator.
 * Accurately extracts text, colors, font styling, 3D depth, shadows, layout, and purpose.
 */
export function buildLocalDesign(prompt: string): TextDesignAiResult {
  const p = prompt.trim().toLowerCase();

  // Extract explicit quoted text if present: e.g. 'NIGHTFALL', "APEX CYBER", saying 'HAPPY BIRTHDAY'
  let mainText = 'DESIGN STUDIO';
  const matchQuotes = prompt.match(/["'“]([^"'”]+)["'”]/);
  if (matchQuotes && matchQuotes[1] && matchQuotes[1].trim().length > 0) {
    mainText = matchQuotes[1].trim();
  } else {
    // Check for patterns like "saying ...", "text ...", "title ...", "for ..."
    const sayingMatch = prompt.match(/\b(?:saying|titled|text|title|for|named)\s+([A-Za-z0-9\s&!?-]{2,25})/i);
    if (sayingMatch && sayingMatch[1] && !sayingMatch[1].toLowerCase().includes('logo') && !sayingMatch[1].toLowerCase().includes('text')) {
      mainText = sayingMatch[1].trim().toUpperCase();
    } else if (p.includes('gaming') || p.includes('gamer')) {
      mainText = 'APEX CYBER';
    } else if (p.includes('gold') || p.includes('luxury')) {
      mainText = 'VOGUE ROYALE';
    } else if (p.includes('birthday')) {
      mainText = 'HAPPY BIRTHDAY';
    } else if (p.includes('poster') || p.includes('festival') || p.includes('summer')) {
      mainText = 'SUMMER SOUNDS';
    } else if (p.includes('minimal')) {
      mainText = 'SERENITY';
    } else if (p.includes('business') || p.includes('corporate') || p.includes('enterprise')) {
      mainText = 'ENTERPRISE AI';
    } else if (p.includes('3d') || p.includes('dimension')) {
      mainText = 'LIMITLESS';
    } else if (p.includes('transparent')) {
      mainText = 'CREATIVE STUDIO';
    }
  }

  // Detect purpose & canvas dimensions
  let aspectPreset = '16:9';
  let canvasWidth = 1280;
  let canvasHeight = 720;

  if (p.includes('logo') || p.includes('badge') || p.includes('icon')) {
    aspectPreset = 'logo';
    canvasWidth = 800;
    canvasHeight = 800;
  } else if (p.includes('poster') || p.includes('flyer')) {
    aspectPreset = 'poster';
    canvasWidth = 1200;
    canvasHeight = 1800;
  } else if (p.includes('story') || p.includes('reel') || p.includes('tiktok') || p.includes('shorts')) {
    aspectPreset = '9:16';
    canvasWidth = 1080;
    canvasHeight = 1920;
  } else if (p.includes('instagram') || p.includes('post') || p.includes('quote card') || p.includes('square')) {
    aspectPreset = '1:1';
    canvasWidth = 1080;
    canvasHeight = 1080;
  } else if (p.includes('banner') || p.includes('twitter') || p.includes('header')) {
    aspectPreset = '3:1';
    canvasWidth = 1500;
    canvasHeight = 500;
  }

  // 1. Neon Gaming Logo Style
  if (p.includes('gaming') || p.includes('gamer') || (p.includes('neon') && p.includes('purple')) || p.includes('cyber')) {
    const is3D = p.includes('3d') || p.includes('shadow') || true;
    return {
      mainText,
      subtitleText: 'ESPORTS CHAMPIONSHIP SERIES',
      subtitleEnabled: true,
      fontFamily: 'Orbitron, sans-serif',
      fontSize: 82,
      fontWeight: '900',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: 6,
      lineHeight: 1.05,
      textColorMode: 'gradient',
      textColor: '#DA22FF',
      gradientColors: ['#00F2FE', '#DA22FF'],
      gradientAngle: 90,
      textOpacity: 1,
      textRotation: 0,
      posX: 0,
      posY: 0,
      outlineEnabled: true,
      outlineColor: '#000000',
      outlineWidth: 3,
      shadowEnabled: true,
      shadowColor: '#00F2FE',
      shadowBlur: 35,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      threeDEnabled: is3D,
      threeDDepth: 8,
      threeDColor: '#250B48',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 16,
      subtitleFontFamily: 'Orbitron, sans-serif',
      subtitleColor: '#DA22FF',
      subtitleLetterSpacing: 5,
      subtitleOffsetY: 35,
      aspectPreset,
      canvasWidth,
      canvasHeight,
      bgMode: 'gradient',
      bgColor: '#030511',
      bgGradientColors: ['#040716', '#0F1A3A'],
      bgGradientAngle: 135,
      explanation: 'Crafted bold futuristic gaming typography using Orbitron, neon cyan-to-purple gradient, multi-stage bloom glow, and 3D extrusion on dark space blue canvas.',
    };
  }

  // 2. Elegant Gold Text on Black
  if (p.includes('gold') || p.includes('luxury') || p.includes('elegant') || p.includes('vogue')) {
    return {
      mainText,
      subtitleText: 'CURATED LUXURY & TIMELESS PERFECTION',
      subtitleEnabled: true,
      fontFamily: '"Playfair Display", serif',
      fontSize: 78,
      fontWeight: '700',
      isBold: false,
      isItalic: true,
      isUnderline: false,
      textTransform: 'none',
      textAlign: 'center',
      letterSpacing: 3,
      lineHeight: 1.15,
      textColorMode: 'gradient',
      textColor: '#FDE047',
      gradientColors: ['#FFE259', '#FFA751'],
      gradientAngle: 60,
      textOpacity: 1,
      textRotation: 0,
      posX: 0,
      posY: 0,
      outlineEnabled: false,
      outlineColor: '#000000',
      outlineWidth: 1,
      shadowEnabled: true,
      shadowColor: 'rgba(255, 167, 81, 0.45)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 6,
      threeDEnabled: false,
      threeDDepth: 4,
      threeDColor: '#78350F',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 14,
      subtitleFontFamily: 'Inter, sans-serif',
      subtitleColor: '#D4AF37',
      subtitleLetterSpacing: 6,
      subtitleOffsetY: 35,
      aspectPreset,
      canvasWidth,
      canvasHeight,
      bgMode: 'gradient',
      bgColor: '#06070B',
      bgGradientColors: ['#05060A', '#131119'],
      bgGradientAngle: 135,
      explanation: 'Crafted high-society Playfair Display serif typography with warm champagne gold gradient luster and ambient glow on obsidian slate.',
    };
  }

  // 3. Colorful Social Media Poster
  if (p.includes('poster') || p.includes('colorful') || p.includes('summer') || p.includes('festival')) {
    return {
      mainText,
      subtitleText: 'LIVE MUSIC · FOOD VENDORS · FREE ENTRY · THIS WEEKEND',
      subtitleEnabled: true,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 84,
      fontWeight: '900',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: 4,
      lineHeight: 1.05,
      textColorMode: 'gradient',
      textColor: '#FF5858',
      gradientColors: ['#FF512F', '#DD2476'],
      gradientAngle: 45,
      textOpacity: 1,
      textRotation: 0,
      posX: 0,
      posY: 0,
      outlineEnabled: false,
      outlineColor: '#000000',
      outlineWidth: 2,
      shadowEnabled: true,
      shadowColor: 'rgba(221, 36, 118, 0.5)',
      shadowBlur: 25,
      shadowOffsetX: 0,
      shadowOffsetY: 10,
      threeDEnabled: false,
      threeDDepth: 6,
      threeDColor: '#831843',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 16,
      subtitleFontFamily: 'Montserrat, sans-serif',
      subtitleColor: '#F8FAFF',
      subtitleLetterSpacing: 4,
      subtitleOffsetY: 35,
      aspectPreset: 'poster',
      canvasWidth: 1200,
      canvasHeight: 1800,
      bgMode: 'gradient',
      bgColor: '#080811',
      bgGradientColors: ['#090914', '#1A0D23'],
      bgGradientAngle: 160,
      explanation: 'Formatted dynamic festival flyer typography using heavyweight Montserrat, warm sunset-magenta gradient fill, and 2:3 vertical poster dimensions.',
    };
  }

  // 4. Minimal White Typography
  if (p.includes('minimal') || (p.includes('white') && !p.includes('red'))) {
    return {
      mainText,
      subtitleText: 'PURITY IN FORM & FUNCTION',
      subtitleEnabled: true,
      fontFamily: 'Inter, sans-serif',
      fontSize: 72,
      fontWeight: '400',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: 14,
      lineHeight: 1.2,
      textColorMode: 'solid',
      textColor: '#FFFFFF',
      gradientColors: ['#FFFFFF', '#E2E8F0'],
      gradientAngle: 0,
      textOpacity: 0.96,
      textRotation: 0,
      posX: 0,
      posY: 0,
      outlineEnabled: false,
      outlineColor: '#000000',
      outlineWidth: 1,
      shadowEnabled: false,
      shadowColor: 'transparent',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      threeDEnabled: false,
      threeDDepth: 4,
      threeDColor: '#000000',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 14,
      subtitleFontFamily: 'Inter, sans-serif',
      subtitleColor: '#7E8B9F',
      subtitleLetterSpacing: 8,
      subtitleOffsetY: 35,
      aspectPreset,
      canvasWidth,
      canvasHeight,
      bgMode: 'color',
      bgColor: '#080C16',
      bgGradientColors: ['#080C16', '#0F1626'],
      bgGradientAngle: 135,
      explanation: 'Engineered timeless minimal typography with generous letter-spacing, pure white text, and a clean matte midnight slate background.',
    };
  }

  // 5. Glowing 3D Title
  if (p.includes('3d') || p.includes('extrusion') || p.includes('dimensional')) {
    return {
      mainText,
      subtitleText: 'EXPANDING THE HORIZONS OF CREATIVITY',
      subtitleEnabled: true,
      fontFamily: 'Anton, sans-serif',
      fontSize: 90,
      fontWeight: '900',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: 5,
      lineHeight: 1.05,
      textColorMode: 'gradient',
      textColor: '#FF3366',
      gradientColors: ['#FF0844', '#FFB199'],
      gradientAngle: 45,
      textOpacity: 1,
      textRotation: -2,
      posX: 0,
      posY: 0,
      outlineEnabled: true,
      outlineColor: '#000000',
      outlineWidth: 3,
      shadowEnabled: true,
      shadowColor: 'rgba(255, 8, 68, 0.45)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 10,
      threeDEnabled: true,
      threeDDepth: 10,
      threeDColor: '#4A0413',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 16,
      subtitleFontFamily: 'Inter, sans-serif',
      subtitleColor: '#FFFFFF',
      subtitleLetterSpacing: 4,
      subtitleOffsetY: 35,
      aspectPreset,
      canvasWidth,
      canvasHeight,
      bgMode: 'gradient',
      bgColor: '#090B12',
      bgGradientColors: ['#090B12', '#1C0D1B'],
      bgGradientAngle: 140,
      explanation: 'Constructed punchy 3D isometric typography with high-impact Anton font, 10-layer extrusion depth, coral glow, and subtle tilt.',
    };
  }

  // 6. Gradient Text with Transparent Background
  if (p.includes('transparent') || p.includes('png background')) {
    return {
      mainText,
      subtitleText: 'SUPERCHARGED WITH NEXT-GEN AI',
      subtitleEnabled: true,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 80,
      fontWeight: '800',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: 3,
      lineHeight: 1.1,
      textColorMode: 'gradient',
      textColor: '#4776FF',
      gradientColors: ['#38BDF8', '#818CF8'],
      gradientAngle: 45,
      textOpacity: 1,
      textRotation: 0,
      posX: 0,
      posY: 0,
      outlineEnabled: false,
      outlineColor: '#000000',
      outlineWidth: 2,
      shadowEnabled: true,
      shadowColor: 'rgba(56, 189, 248, 0.35)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 8,
      threeDEnabled: false,
      threeDDepth: 4,
      threeDColor: '#1E1B4B',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 15,
      subtitleFontFamily: 'Inter, sans-serif',
      subtitleColor: '#CBD5E1',
      subtitleLetterSpacing: 4,
      subtitleOffsetY: 30,
      aspectPreset,
      canvasWidth,
      canvasHeight,
      bgMode: 'transparent',
      bgColor: '#000000',
      bgGradientColors: ['#000000', '#000000'],
      bgGradientAngle: 0,
      explanation: 'Created modern sky-to-indigo gradient text on a 100% transparent alpha background for watermarks and video overlays.',
    };
  }

  // 7. Professional Business Heading
  if (p.includes('business') || p.includes('corporate') || p.includes('enterprise') || p.includes('heading')) {
    return {
      mainText,
      subtitleText: 'PRECISION DIGITAL INTELLIGENCE',
      subtitleEnabled: true,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 74,
      fontWeight: '800',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      textTransform: 'uppercase',
      textAlign: 'center',
      letterSpacing: 5,
      lineHeight: 1.15,
      textColorMode: 'solid',
      textColor: '#F8FAFF',
      gradientColors: ['#4776FF', '#8957FF'],
      gradientAngle: 45,
      textOpacity: 1,
      textRotation: 0,
      posX: 0,
      posY: 0,
      outlineEnabled: false,
      outlineColor: '#000000',
      outlineWidth: 1,
      shadowEnabled: true,
      shadowColor: 'rgba(71, 118, 255, 0.3)',
      shadowBlur: 16,
      shadowOffsetX: 0,
      shadowOffsetY: 6,
      threeDEnabled: false,
      threeDDepth: 4,
      threeDColor: '#1E293B',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 16,
      subtitleFontFamily: 'Inter, sans-serif',
      subtitleColor: '#4776FF',
      subtitleLetterSpacing: 6,
      subtitleOffsetY: 35,
      aspectPreset,
      canvasWidth,
      canvasHeight,
      bgMode: 'gradient',
      bgColor: '#070B14',
      bgGradientColors: ['#070B14', '#111A2E'],
      bgGradientAngle: 145,
      explanation: 'Formatted authoritative executive heading using geometric Montserrat typography and corporate deep navy tones.',
    };
  }

  // 8. Stylish Birthday Greeting
  if (p.includes('birthday') || p.includes('celebrat') || p.includes('greeting') || p.includes('party')) {
    return {
      mainText,
      subtitleText: 'WISHING YOU A YEAR FILLED WITH JOY & SUCCESS',
      subtitleEnabled: true,
      fontFamily: 'Pacifico, cursive',
      fontSize: 82,
      fontWeight: '400',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      textTransform: 'none',
      textAlign: 'center',
      letterSpacing: 2,
      lineHeight: 1.25,
      textColorMode: 'gradient',
      textColor: '#F472B6',
      gradientColors: ['#F472B6', '#FBBF24'],
      gradientAngle: 45,
      textOpacity: 1,
      textRotation: -3,
      posX: 0,
      posY: 0,
      outlineEnabled: true,
      outlineColor: '#581C87',
      outlineWidth: 2,
      shadowEnabled: true,
      shadowColor: 'rgba(244, 114, 182, 0.5)',
      shadowBlur: 24,
      shadowOffsetX: 2,
      shadowOffsetY: 8,
      threeDEnabled: false,
      threeDDepth: 4,
      threeDColor: '#4A044E',
      threeDDirection: 'bottom-right',
      subtitleFontSize: 15,
      subtitleFontFamily: 'Inter, sans-serif',
      subtitleColor: '#FDE047',
      subtitleLetterSpacing: 3,
      subtitleOffsetY: 35,
      aspectPreset: '1:1',
      canvasWidth: 1080,
      canvasHeight: 1080,
      bgMode: 'gradient',
      bgColor: '#170624',
      bgGradientColors: ['#170624', '#2E083E'],
      bgGradientAngle: 135,
      explanation: 'Rendered celebratory cursive lettering with Pacifico font, warm rose-to-gold gradient, and festive deep violet backdrop.',
    };
  }

  // Default General High-End Typography
  return {
    mainText,
    subtitleText: 'BUILT WITH WRITEGENIUS STUDIO',
    subtitleEnabled: true,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 78,
    fontWeight: '800',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 6,
    lineHeight: 1.1,
    textColorMode: 'gradient',
    textColor: '#4776FF',
    gradientColors: ['#4776FF', '#8957FF'],
    gradientAngle: 45,
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    outlineColor: '#000000',
    outlineWidth: 2,
    shadowEnabled: true,
    shadowColor: 'rgba(71, 118, 255, 0.45)',
    shadowBlur: 22,
    shadowOffsetX: 0,
    shadowOffsetY: 8,
    threeDEnabled: false,
    threeDDepth: 6,
    threeDColor: '#1E1B4B',
    threeDDirection: 'bottom-right',
    subtitleFontSize: 16,
    subtitleFontFamily: 'Inter, sans-serif',
    subtitleColor: '#4776FF',
    subtitleLetterSpacing: 5,
    subtitleOffsetY: 35,
    aspectPreset,
    canvasWidth,
    canvasHeight,
    bgMode: 'gradient',
    bgColor: '#070B14',
    bgGradientColors: ['#070B14', '#111A2E'],
    bgGradientAngle: 145,
    explanation: 'Generated high-contrast modern typography with vibrant gradient fill, subtle ambient glow, and proportional spacing.',
  };
}

/**
 * Natural Language Text Design Generator via Gemini API with cascade failover.
 */
export async function generateAiTextDesign(
  aiClient: GoogleGenAI | null,
  prompt: string,
  fallbackRequested: boolean = false
): Promise<TextDesignAiResponse> {
  const cleanPrompt = prompt.trim();

  // If AI Client is not configured on server
  if (!aiClient) {
    if (fallbackRequested) {
      const localDesign = buildLocalDesign(cleanPrompt);
      return {
        success: true,
        design: localDesign,
        provider: 'smart-template-engine',
        aiGenerated: false,
        explanation: 'Generated using template engine fallback: ' + localDesign.explanation,
      };
    }
    return {
      success: false,
      error: 'Gemini AI service is not initialized on the server (API key not configured). Your prompt is preserved.',
      provider: 'offline',
      aiGenerated: false,
      canUseFallback: true,
      explanation: '',
    };
  }

  // Attempt real Gemini API generation
  try {
    const systemPrompt = `You are the WriteGenius Text Design AI.
Convert the user's natural language design description into a visual typography styling configuration JSON object.

Available fonts:
- 'Inter, sans-serif'
- 'Montserrat, sans-serif'
- 'Poppins, sans-serif'
- '"Bebas Neue", sans-serif'
- 'Anton, sans-serif'
- '"Playfair Display", serif'
- 'Cinzel, serif'
- 'Orbitron, sans-serif'
- 'Righteous, cursive'
- 'Pacifico, cursive'
- 'Caveat, cursive'
- 'Bangers, cursive'
- 'Roboto, sans-serif'
- 'JetBrains Mono, monospace'

Available aspect presets:
- '1:1' (1080x1080)
- '16:9' (1280x720)
- '9:16' (1080x1920)
- '4:5' (1080x1350)
- '3:1' (1500x500)
- 'poster' (1200x1800)
- 'logo' (800x800)

Return ONLY a raw JSON object (strictly no markdown backticks, no code fence, raw valid JSON) with these fields:
{
  "mainText": string (the exact headline or text requested; 1-5 words),
  "subtitleText": string (subtitle or tagline if mentioned or fitting),
  "subtitleEnabled": boolean,
  "fontFamily": string (must be one of the available fonts listed above),
  "fontSize": number (between 50 and 100),
  "fontWeight": "400"|"600"|"700"|"800"|"900",
  "isBold": boolean,
  "isItalic": boolean,
  "isUnderline": boolean,
  "textTransform": "none"|"uppercase"|"lowercase"|"capitalize",
  "textAlign": "left"|"center"|"right",
  "letterSpacing": number (between -2 and 16),
  "lineHeight": number (between 0.95 and 1.4),
  "textColorMode": "solid"|"gradient",
  "textColor": hex color string (e.g. "#00F2FE"),
  "gradientColors": [hex color, hex color],
  "gradientAngle": number (0 to 360),
  "outlineEnabled": boolean,
  "outlineColor": hex color,
  "outlineWidth": number (1 to 8),
  "shadowEnabled": boolean,
  "shadowColor": hex color or rgba,
  "shadowBlur": number (0 to 45),
  "threeDEnabled": boolean,
  "threeDDepth": number (2 to 12),
  "threeDColor": hex color,
  "threeDDirection": "bottom-right"|"bottom-left"|"top-right"|"top-left",
  "aspectPreset": string,
  "canvasWidth": number,
  "canvasHeight": number,
  "bgMode": "color"|"gradient"|"transparent",
  "bgColor": hex color,
  "bgGradientColors": [hex color, hex color],
  "bgGradientAngle": number (0 to 360),
  "explanation": string (one clear sentence describing what styles were selected)
}`;

    const userPrompt = `User Design Description: "${cleanPrompt}"\nGenerate the text design JSON now:`;
    const result = await generateWithModelCascade(aiClient, userPrompt, systemPrompt);

    const cleaned = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const baseFallback = buildLocalDesign(cleanPrompt);
    const merged: TextDesignAiResult = {
      ...baseFallback,
      ...parsed,
      mainText: parsed.mainText || baseFallback.mainText,
      explanation: parsed.explanation || 'Design generated by Gemini AI.',
    };

    return {
      success: true,
      design: merged,
      provider: result.model,
      explanation: merged.explanation,
      aiGenerated: true,
    };
  } catch (err: any) {
    console.warn('[AI Text Design] Gemini API call failed:', err?.message || err);

    if (fallbackRequested) {
      const localDesign = buildLocalDesign(cleanPrompt);
      return {
        success: true,
        design: localDesign,
        provider: 'smart-template-engine',
        aiGenerated: false,
        explanation: 'Generated using template engine fallback: ' + localDesign.explanation,
      };
    }

    return {
      success: false,
      error: `Gemini AI service encountered an error (${err?.message || 'Upstream service error'}). Your prompt has been preserved.`,
      provider: 'error',
      aiGenerated: false,
      canUseFallback: true,
      explanation: '',
    };
  }
}
