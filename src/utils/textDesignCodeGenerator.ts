import { DesignState } from '../components/tools/TextDesignEditor';

export type CodeFormat =
  | 'html-css'
  | 'html'
  | 'css'
  | 'react'
  | 'tailwind'
  | 'svg'
  | 'javascript';

export interface CodeFormatOption {
  id: CodeFormat;
  label: string;
  extension: string;
  language: string;
  description: string;
}

export interface CodeGeneratorOptions {
  includeFontImport: boolean;
  includeContainer: boolean;
  inlineStyles: boolean;
  fullBoilerplate: boolean;
  responsiveContainer: boolean;
  jsxTypeScript: boolean;
}

export const DEFAULT_CODE_OPTIONS: CodeGeneratorOptions = {
  includeFontImport: true,
  includeContainer: true,
  inlineStyles: false,
  fullBoilerplate: true,
  responsiveContainer: true,
  jsxTypeScript: true,
};

export const CODE_FORMAT_OPTIONS: CodeFormatOption[] = [
  {
    id: 'html-css',
    label: 'HTML + CSS',
    extension: '.html',
    language: 'html',
    description: 'Complete standalone HTML5 file with embedded CSS and Google Fonts, ready to run in any browser.',
  },
  {
    id: 'html',
    label: 'HTML Only',
    extension: '.html',
    language: 'html',
    description: 'Clean semantic HTML structure with class hooks or inline styles.',
  },
  {
    id: 'css',
    label: 'CSS Styles',
    extension: '.css',
    language: 'css',
    description: 'Modular stylesheet with font imports, gradients, shadows, 3D text rules, and responsiveness.',
  },
  {
    id: 'react',
    label: 'React JSX',
    extension: '.jsx',
    language: 'javascript',
    description: 'Reusable modern React component with TypeScript/JSX styling and customizable props.',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    extension: '.html',
    language: 'html',
    description: 'Modern Tailwind CSS utility classes with arbitrary values for gradient text, fonts, and shadows.',
  },
  {
    id: 'svg',
    label: 'Scalable SVG',
    extension: '.svg',
    language: 'xml',
    description: 'Vector SVG graphic with embedded linear gradients, outlines, drop shadow filters, and scalable text definitions.',
  },
  {
    id: 'javascript',
    label: 'JavaScript (Canvas)',
    extension: '.js',
    language: 'javascript',
    description: 'Dynamic JavaScript generator function to render typography directly onto an HTML5 Canvas or web app.',
  },
];

/**
 * Maps font family string to Google Fonts URL parameter
 */
export function getGoogleFontImportUrl(fontFamily: string): string {
  const clean = fontFamily.replace(/['"]/g, '').split(',')[0].trim();
  const fontMap: Record<string, string> = {
    'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap',
    'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800;900&display=swap',
    'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'Anton': 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
    'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap',
    'Cinzel': 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap',
    'Orbitron': 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&display=swap',
    'Righteous': 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
    'Pacifico': 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    'Caveat': 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap',
    'Bangers': 'https://fonts.googleapis.com/css2?family=Bangers&display=swap',
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap',
    'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap',
  };
  return fontMap[clean] || 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap';
}

/**
 * Builds CSS text-shadow string incorporating 3D layers and glow shadows
 */
export function buildCssTextShadow(state: DesignState): string {
  const shadows: string[] = [];

  // 3D Extrusion Shadows
  if (state.threeDEnabled && state.threeDDepth > 0) {
    const dirMap = {
      'bottom-right': { dx: 1, dy: 1 },
      'bottom-left': { dx: -1, dy: 1 },
      'top-right': { dx: 1, dy: -1 },
      'top-left': { dx: -1, dy: -1 },
    };
    const { dx, dy } = dirMap[state.threeDDirection] || { dx: 1, dy: 1 };
    for (let i = 1; i <= state.threeDDepth; i++) {
      shadows.push(`${i * dx}px ${i * dy}px 0 ${state.threeDColor}`);
    }
  }

  // Glow / Drop Shadow
  if (state.shadowEnabled) {
    if (state.shadowBlur > 20) {
      // Multi-stage neon bloom
      shadows.push(`0 0 5px ${state.shadowColor}`);
      shadows.push(`0 0 15px ${state.shadowColor}`);
    }
    shadows.push(`${state.shadowOffsetX}px ${state.shadowOffsetY}px ${state.shadowBlur}px ${state.shadowColor}`);
  }

  return shadows.length > 0 ? shadows.join(',\n    ') : 'none';
}

/**
 * Builds background CSS style string
 */
export function buildCssBackground(state: DesignState): string {
  if (state.bgMode === 'transparent') {
    return 'transparent';
  }
  if (state.bgMode === 'gradient') {
    return `linear-gradient(${state.bgGradientAngle}deg, ${state.bgGradientColors[0]}, ${state.bgGradientColors[1]})`;
  }
  if (state.bgMode === 'image' && state.bgImage) {
    return `url('${state.bgImage}') center / ${state.bgImageFit} no-repeat`;
  }
  return state.bgColor || '#070B14';
}

/**
 * 1. HTML Only Code
 */
export function generateHtmlCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  const lines = state.mainText.split('\n');
  const renderedTitle = lines.length > 1
    ? lines.map((l) => `      <span>${escapeHtml(l)}</span>`).join('<br>\n')
    : `      ${escapeHtml(state.mainText)}`;

  if (options.inlineStyles) {
    const textShadow = buildCssTextShadow(state);
    const background = buildCssBackground(state);
    const gradientFill = state.textColorMode === 'gradient'
      ? `background: linear-gradient(${state.gradientAngle}deg, ${state.gradientColors[0]}, ${state.gradientColors[1]}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${state.textColor};`;
    const outline = state.outlineEnabled && state.outlineWidth > 0
      ? ` -webkit-text-stroke: ${state.outlineWidth}px ${state.outlineColor};`
      : '';
    const rotation = state.textRotation !== 0
      ? ` transform: rotate(${state.textRotation}deg);`
      : '';
    const underline = state.isUnderline ? ' text-decoration: underline;' : '';
    const fontSize = options.responsiveContainer
      ? `clamp(2rem, 6vw, ${state.fontSize}px)`
      : `${state.fontSize}px`;

    const titleStyle = `margin: 0; font-family: ${state.fontFamily}; font-size: ${fontSize}; font-weight: ${state.fontWeight}; font-style: ${state.isItalic ? 'italic' : 'normal'}; line-height: ${state.lineHeight}; letter-spacing: ${state.letterSpacing}px; text-transform: ${state.textTransform}; opacity: ${state.textOpacity}; text-shadow: ${textShadow.replace(/\n\s+/g, ' ')}; ${gradientFill}${outline}${rotation}${underline}`;

    const subtitleStyle = `margin-top: ${Math.max(12, state.subtitleOffsetY / 2)}px; font-family: ${state.subtitleFontFamily || 'Inter, sans-serif'}; font-size: clamp(0.75rem, 2vw, ${state.subtitleFontSize}px); font-weight: 600; color: ${state.subtitleColor}; letter-spacing: ${state.subtitleLetterSpacing}px; text-transform: uppercase; margin-bottom: 0;`;

    const contentStyle = `position: relative; z-index: 2; text-align: ${state.textAlign}; transform: translate(${state.posX}px, ${state.posY}px);`;

    const containerStyle = `position: relative; display: flex; align-items: center; justify-content: center; width: 100%; max-width: ${state.canvasWidth}px; min-height: 380px; aspect-ratio: ${state.canvasWidth} / ${state.canvasHeight}; margin: 0 auto; padding: 2.5rem 1.5rem; background: ${background}; border-radius: 1.5rem; overflow: hidden; box-sizing: border-box;`;

    if (!options.includeContainer) {
      return `<div style="${contentStyle}">
  <h1 style="${titleStyle}">
${renderedTitle}
  </h1>${state.subtitleEnabled && state.subtitleText ? `\n  <p style="${subtitleStyle}">${escapeHtml(state.subtitleText)}</p>` : ''}
</div>`;
    }

    return `<div style="${containerStyle}">
  <div style="${contentStyle}">
    <h1 style="${titleStyle}">
${renderedTitle}
    </h1>${state.subtitleEnabled && state.subtitleText ? `\n    <p style="${subtitleStyle}">${escapeHtml(state.subtitleText)}</p>` : ''}
  </div>
</div>`;
  }

  const subtitleHtml = state.subtitleEnabled && state.subtitleText
    ? `\n    <p class="text-design-subtitle">${escapeHtml(state.subtitleText)}</p>`
    : '';

  if (!options.includeContainer) {
    return `<div class="text-design-content">
  <h1 class="text-design-title">
${renderedTitle}
  </h1>${subtitleHtml}
</div>`;
  }

  return `<div class="text-design-card">
  <div class="text-design-content">
    <h1 class="text-design-title">
${renderedTitle}
    </h1>${subtitleHtml}
  </div>
</div>`;
}

/**
 * 2. CSS Stylesheet Code
 */
export function generateCssCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  const fontUrl = getGoogleFontImportUrl(state.fontFamily);
  const textShadow = buildCssTextShadow(state);
  const background = buildCssBackground(state);

  const fillRules = state.textColorMode === 'gradient'
    ? `  background: linear-gradient(${state.gradientAngle}deg, ${state.gradientColors[0]}, ${state.gradientColors[1]});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;`
    : `  color: ${state.textColor};`;

  const outlineRules = state.outlineEnabled && state.outlineWidth > 0
    ? `  -webkit-text-stroke: ${state.outlineWidth}px ${state.outlineColor};\n`
    : '';

  const rotationRule = state.textRotation !== 0
    ? `  transform: rotate(${state.textRotation}deg);\n  transform-origin: center;\n`
    : '';

  const underlineRule = state.isUnderline
    ? `  text-decoration: underline;\n  text-decoration-color: ${state.textColor};\n`
    : '';

  const fontSizeRule = options.responsiveContainer
    ? `clamp(2rem, 6vw, ${state.fontSize}px)`
    : `${state.fontSize}px`;

  const fontImport = options.includeFontImport ? `@import url('${fontUrl}');\n\n` : '';

  const containerRules = options.includeContainer
    ? `/* Container Card */
.text-design-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: ${state.canvasWidth}px;
  min-height: 380px;
  aspect-ratio: ${state.canvasWidth} / ${state.canvasHeight};
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  background: ${background};
  border-radius: 1.5rem;
  overflow: hidden;
  box-sizing: border-box;
}

.text-design-content {
  position: relative;
  z-index: 2;
  text-align: ${state.textAlign};
  transform: translate(${state.posX}px, ${state.posY}px);
}

`
    : `/* Content Wrapper */
.text-design-content {
  position: relative;
  text-align: ${state.textAlign};
  transform: translate(${state.posX}px, ${state.posY}px);
}

`;

  return `${fontImport}${containerRules}/* Main Headline */
.text-design-title {
  margin: 0;
  font-family: ${state.fontFamily};
  font-size: ${fontSizeRule};
  font-weight: ${state.fontWeight};
  font-style: ${state.isItalic ? 'italic' : 'normal'};
  line-height: ${state.lineHeight};
  letter-spacing: ${state.letterSpacing}px;
  text-transform: ${state.textTransform};
  opacity: ${state.textOpacity};
${rotationRule}${underlineRule}${fillRules}
${outlineRules}  text-shadow: ${textShadow};
}

/* Subtitle */
.text-design-subtitle {
  margin-top: ${state.subtitleOffsetY ? Math.max(12, state.subtitleOffsetY / 2) : 16}px;
  font-family: ${state.subtitleFontFamily || 'Inter, sans-serif'};
  font-size: clamp(0.75rem, 2vw, ${state.subtitleFontSize}px);
  font-weight: 600;
  color: ${state.subtitleColor};
  letter-spacing: ${state.subtitleLetterSpacing}px;
  text-transform: uppercase;
  margin-bottom: 0;
}`;
}

/**
 * 3. HTML + CSS Complete Standalone Document
 */
export function generateHtmlCssCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  const fontUrl = getGoogleFontImportUrl(state.fontFamily);
  const cssCode = generateCssCode(state, { ...options, includeFontImport: false });
  const htmlBody = generateHtmlCode(state, { ...options, inlineStyles: false });

  if (!options.fullBoilerplate) {
    return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontUrl}" rel="stylesheet">

<style>
${cssCode}
</style>

${htmlBody}`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(state.mainText)} – WriteGenius Text Design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">
  <style>
    /* Reset & Viewport Center */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #050811;
      padding: 1.5rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

${cssCode}
  </style>
</head>
<body>

${htmlBody}

</body>
</html>`;
}

/**
 * 4. React JSX Component Code
 */
export function generateReactCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  const fontUrl = getGoogleFontImportUrl(state.fontFamily);
  const textShadow = buildCssTextShadow(state);
  const background = buildCssBackground(state);

  const fontSizeVal = options.responsiveContainer
    ? `'clamp(2rem, 6vw, ${state.fontSize}px)'`
    : `'${state.fontSize}px'`;

  if (options.jsxTypeScript) {
    return `import React from 'react';

// Preload Google Font in index.html or root layout:
// <link href="${fontUrl}" rel="stylesheet" />

export interface TextDesignCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const TextDesignCard: React.FC<TextDesignCardProps> = ({
  title = ${JSON.stringify(state.mainText)},
  subtitle = ${JSON.stringify(state.subtitleText)},
  className = '',
}) => {
${options.includeContainer ? `  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '${state.canvasWidth}px',
    aspectRatio: '${state.canvasWidth} / ${state.canvasHeight}',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    background: '${background}',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };
` : ''}
  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: ${JSON.stringify(state.fontFamily)},
    fontSize: ${fontSizeVal},
    fontWeight: ${JSON.stringify(state.fontWeight)},
    fontStyle: ${state.isItalic ? "'italic'" : "'normal'"},
    lineHeight: ${state.lineHeight},
    letterSpacing: '${state.letterSpacing}px',
    textAlign: '${state.textAlign}',
    textTransform: '${state.textTransform}',
    opacity: ${state.textOpacity},
    transform: 'rotate(${state.textRotation}deg)',
    textShadow: ${JSON.stringify(textShadow.replace(/\n\s+/g, ' '))},
    ${
      state.textColorMode === 'gradient'
        ? `background: 'linear-gradient(${state.gradientAngle}deg, ${state.gradientColors[0]}, ${state.gradientColors[1]})',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',`
        : `color: '${state.textColor}',`
    }
    ${
      state.outlineEnabled && state.outlineWidth > 0
        ? `WebkitTextStroke: '${state.outlineWidth}px ${state.outlineColor}',`
        : ''
    }
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: '${Math.max(12, state.subtitleOffsetY / 2)}px',
    fontFamily: ${JSON.stringify(state.subtitleFontFamily || 'Inter, sans-serif')},
    fontSize: 'clamp(0.75rem, 2vw, ${state.subtitleFontSize}px)',
    fontWeight: 600,
    color: '${state.subtitleColor}',
    letterSpacing: '${state.subtitleLetterSpacing}px',
    textAlign: '${state.textAlign}',
    textTransform: 'uppercase',
  };

  return (
${options.includeContainer ? `    <div style={containerStyle} className={className}>
      <div style={{ transform: 'translate(${state.posX}px, ${state.posY}px)', textAlign: '${state.textAlign}' }}>
        <h1 style={titleStyle}>{title}</h1>
        {${state.subtitleEnabled} && subtitle && (
          <p style={subtitleStyle}>{subtitle}</p>
        )}
      </div>
    </div>` : `    <div style={{ transform: 'translate(${state.posX}px, ${state.posY}px)', textAlign: '${state.textAlign}' }} className={className}>
      <h1 style={titleStyle}>{title}</h1>
      {${state.subtitleEnabled} && subtitle && (
        <p style={subtitleStyle}>{subtitle}</p>
      )}
    </div>`}
  );
};

export default TextDesignCard;`;
  }

  // Plain JavaScript React
  return `import React from 'react';

// Include font in your HTML:
// <link href="${fontUrl}" rel="stylesheet" />

export function TextDesignCard({
  title = ${JSON.stringify(state.mainText)},
  subtitle = ${JSON.stringify(state.subtitleText)},
  className = '',
}) {
${options.includeContainer ? `  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '${state.canvasWidth}px',
    aspectRatio: '${state.canvasWidth} / ${state.canvasHeight}',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    background: '${background}',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };
` : ''}
  const titleStyle = {
    margin: 0,
    fontFamily: ${JSON.stringify(state.fontFamily)},
    fontSize: ${fontSizeVal},
    fontWeight: ${JSON.stringify(state.fontWeight)},
    fontStyle: ${state.isItalic ? "'italic'" : "'normal'"},
    lineHeight: ${state.lineHeight},
    letterSpacing: '${state.letterSpacing}px',
    textAlign: '${state.textAlign}',
    textTransform: '${state.textTransform}',
    opacity: ${state.textOpacity},
    transform: 'rotate(${state.textRotation}deg)',
    textShadow: ${JSON.stringify(textShadow.replace(/\n\s+/g, ' '))},
    ${
      state.textColorMode === 'gradient'
        ? `background: 'linear-gradient(${state.gradientAngle}deg, ${state.gradientColors[0]}, ${state.gradientColors[1]})',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',`
        : `color: '${state.textColor}',`
    }
    ${
      state.outlineEnabled && state.outlineWidth > 0
        ? `WebkitTextStroke: '${state.outlineWidth}px ${state.outlineColor}',`
        : ''
    }
  };

  const subtitleStyle = {
    marginTop: '${Math.max(12, state.subtitleOffsetY / 2)}px',
    fontFamily: ${JSON.stringify(state.subtitleFontFamily || 'Inter, sans-serif')},
    fontSize: 'clamp(0.75rem, 2vw, ${state.subtitleFontSize}px)',
    fontWeight: 600,
    color: '${state.subtitleColor}',
    letterSpacing: '${state.subtitleLetterSpacing}px',
    textAlign: '${state.textAlign}',
    textTransform: 'uppercase',
  };

  return (
${options.includeContainer ? `    <div style={containerStyle} className={className}>
      <div style={{ transform: 'translate(${state.posX}px, ${state.posY}px)', textAlign: '${state.textAlign}' }}>
        <h1 style={titleStyle}>{title}</h1>
        {${state.subtitleEnabled} && subtitle && (
          <p style={subtitleStyle}>{subtitle}</p>
        )}
      </div>
    </div>` : `    <div style={{ transform: 'translate(${state.posX}px, ${state.posY}px)', textAlign: '${state.textAlign}' }} className={className}>
      <h1 style={titleStyle}>{title}</h1>
      {${state.subtitleEnabled} && subtitle && (
        <p style={subtitleStyle}>{subtitle}</p>
      )}
    </div>`}
  );
}`;
}

/**
 * 5. Tailwind CSS Utility Markup
 */
export function generateTailwindCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  const fontClean = state.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
  const fontClass = `font-['${fontClean}',sans-serif]`;

  const bgGradient = state.bgMode === 'gradient'
    ? `bg-[linear-gradient(${state.bgGradientAngle}deg,${state.bgGradientColors[0]},${state.bgGradientColors[1]})]`
    : state.bgMode === 'transparent'
    ? 'bg-transparent'
    : `bg-[${state.bgColor}]`;

  const textGradient = state.textColorMode === 'gradient'
    ? `bg-[linear-gradient(${state.gradientAngle}deg,${state.gradientColors[0]},${state.gradientColors[1]})] bg-clip-text text-transparent`
    : `text-[${state.textColor}]`;

  const textAlignClass = state.textAlign === 'center' ? 'text-center' : state.textAlign === 'right' ? 'text-right' : 'text-left';

  const outlineStyle = state.outlineEnabled && state.outlineWidth > 0
    ? ` [-webkit-text-stroke:${state.outlineWidth}px_${state.outlineColor}]`
    : '';

  const cleanShadow = buildCssTextShadow(state).replace(/\s+/g, '_').replace(/,/g, ',');
  const shadowStyle = cleanShadow !== 'none' ? ` [text-shadow:${cleanShadow}]` : '';

  const rotation = state.textRotation !== 0 ? ` rotate-[${state.textRotation}deg]` : '';
  const transformClasses = state.posX !== 0 || state.posY !== 0
    ? `translate-x-[${state.posX}px] translate-y-[${state.posY}px]`
    : '';

  const fontSizeClass = options.responsiveContainer
    ? `text-[clamp(2rem,6vw,${state.fontSize}px)]`
    : `text-[${state.fontSize}px]`;

  if (!options.includeContainer) {
    return `<!-- Tailwind Typography Element -->
<div class="relative z-10 ${textAlignClass} ${transformClasses}">
  <!-- Main Headline -->
  <h1 class="${fontClass} ${fontSizeClass} font-[${state.fontWeight}] ${state.isItalic ? 'italic ' : ''}${state.textTransform} tracking-[${state.letterSpacing}px] leading-[${state.lineHeight}] ${textGradient}${outlineStyle}${shadowStyle}${rotation} select-none">
    ${escapeHtml(state.mainText)}
  </h1>

  ${state.subtitleEnabled && state.subtitleText ? `<!-- Subtitle -->
  <p class="mt-4 text-[clamp(0.75rem,2vw,${state.subtitleFontSize}px)] font-semibold text-[${state.subtitleColor}] tracking-[${state.subtitleLetterSpacing}px] uppercase">
    ${escapeHtml(state.subtitleText)}
  </p>` : ''}
</div>`;
  }

  return `<!-- Responsive Tailwind Card Container -->
<div class="relative flex items-center justify-center w-full max-w-[${state.canvasWidth}px] aspect-[${state.canvasWidth}/${state.canvasHeight}] mx-auto p-8 rounded-3xl overflow-hidden ${bgGradient} shadow-2xl">
  
  <div class="relative z-10 ${textAlignClass} ${transformClasses}">
    <!-- Main Headline -->
    <h1 class="${fontClass} ${fontSizeClass} font-[${state.fontWeight}] ${state.isItalic ? 'italic ' : ''}${state.textTransform} tracking-[${state.letterSpacing}px] leading-[${state.lineHeight}] ${textGradient}${outlineStyle}${shadowStyle}${rotation} select-none">
      ${escapeHtml(state.mainText)}
    </h1>

    ${state.subtitleEnabled && state.subtitleText ? `<!-- Subtitle -->
    <p class="mt-4 text-[clamp(0.75rem,2vw,${state.subtitleFontSize}px)] font-semibold text-[${state.subtitleColor}] tracking-[${state.subtitleLetterSpacing}px] uppercase">
      ${escapeHtml(state.subtitleText)}
    </p>` : ''}
  </div>

</div>`;
}

/**
 * 6. Scalable Vector SVG
 */
export function generateSvgCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  const w = state.canvasWidth;
  const h = state.canvasHeight;
  const cx = w / 2 + state.posX;
  const cy = h / 2 + state.posY;

  let bgElement = '';
  if (options.includeContainer) {
    if (state.bgMode === 'color') {
      bgElement = `  <rect width="${w}" height="${h}" rx="24" fill="${state.bgColor}" />\n`;
    } else if (state.bgMode === 'gradient') {
      bgElement = `  <rect width="${w}" height="${h}" rx="24" fill="url(#svgBgGradient)" />\n`;
    }
  }

  const defsElements: string[] = [];

  if (options.includeContainer && state.bgMode === 'gradient') {
    defsElements.push(`    <linearGradient id="svgBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${state.bgGradientColors[0]}" />
      <stop offset="100%" stop-color="${state.bgGradientColors[1]}" />
    </linearGradient>`);
  }

  if (state.textColorMode === 'gradient') {
    defsElements.push(`    <linearGradient id="svgTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${state.gradientColors[0]}" />
      <stop offset="100%" stop-color="${state.gradientColors[1]}" />
    </linearGradient>`);
  }

  if (state.shadowEnabled) {
    defsElements.push(`    <filter id="textShadowFilter" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="${state.shadowOffsetX}" dy="${state.shadowOffsetY}" stdDeviation="${Math.max(1, state.shadowBlur / 2)}" flood-color="${state.shadowColor}" />
    </filter>`);
  }

  const lines = state.mainText.split('\n');
  const lineHeight = state.fontSize * state.lineHeight;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2;

  const textFill = state.textColorMode === 'gradient' ? 'url(#svgTextGradient)' : state.textColor;
  const strokeAttr = state.outlineEnabled && state.outlineWidth > 0
    ? `stroke="${state.outlineColor}" stroke-width="${state.outlineWidth * 2}" stroke-linejoin="round"`
    : '';
  const filterAttr = state.shadowEnabled ? 'filter="url(#textShadowFilter)"' : '';

  const textAnchor = state.textAlign === 'center' ? 'middle' : state.textAlign === 'right' ? 'end' : 'start';

  const textElements = lines.map((line, idx) => {
    const yPos = startY + idx * lineHeight;
    return `    <text
      x="${cx}"
      y="${yPos}"
      font-family="${state.fontFamily.replace(/['"]/g, '')}"
      font-size="${state.fontSize}"
      font-weight="${state.fontWeight}"
      font-style="${state.isItalic ? 'italic' : 'normal'}"
      letter-spacing="${state.letterSpacing}px"
      text-anchor="${textAnchor}"
      fill="${textFill}"
      opacity="${state.textOpacity}"
      ${strokeAttr}
      ${filterAttr}
      transform="rotate(${state.textRotation} ${cx} ${yPos})"
    >${escapeHtml(line)}</text>`;
  }).join('\n');

  let subtitleElement = '';
  if (state.subtitleEnabled && state.subtitleText) {
    const subY = startY + lines.length * lineHeight + (state.subtitleOffsetY || 30);
    subtitleElement = `\n    <text
      x="${cx}"
      y="${subY}"
      font-family="${(state.subtitleFontFamily || 'Inter').replace(/['"]/g, '')}"
      font-size="${state.subtitleFontSize}"
      font-weight="600"
      letter-spacing="${state.subtitleLetterSpacing}px"
      text-anchor="${textAnchor}"
      fill="${state.subtitleColor}"
    >${escapeHtml(state.subtitleText.toUpperCase())}</text>`;
  }

  const defsBlock = defsElements.length > 0
    ? `  <defs>\n${defsElements.join('\n')}\n  </defs>\n`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
${defsBlock}${bgElement}  <g id="text-design-group">
${textElements}${subtitleElement}
  </g>
</svg>`;
}

/**
 * 7. JavaScript Canvas / Web App Code
 */
export function generateJsCode(
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  return `/**
 * WriteGenius Typography Canvas Renderer
 * Renders high-resolution text design onto an HTML5 Canvas element.
 *
 * @param {HTMLCanvasElement|string} targetCanvas - Canvas element or ID string
 */
function renderTypography(targetCanvas) {
  const canvas = typeof targetCanvas === 'string'
    ? document.getElementById(targetCanvas)
    : targetCanvas;

  if (!canvas) {
    console.error('Target canvas not found.');
    return;
  }
  const ctx = canvas.getContext('2d');
  const width = ${state.canvasWidth};
  const height = ${state.canvasHeight};

  // Configure high-DPI scaling
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);

  // 1. Draw Background
  ${
    options.includeContainer
      ? state.bgMode === 'gradient'
        ? `const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '${state.bgGradientColors[0]}');
  bgGrad.addColorStop(1, '${state.bgGradientColors[1]}');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);`
        : state.bgMode === 'transparent'
        ? `ctx.clearRect(0, 0, width, height);`
        : `ctx.fillStyle = '${state.bgColor}';
  ctx.fillRect(0, 0, width, height);`
      : `ctx.clearRect(0, 0, width, height);`
  }

  // 2. Set Transformation & Alignment
  const centerX = width / 2 + ${state.posX};
  const centerY = height / 2 + ${state.posY};

  ctx.save();
  ctx.translate(centerX, centerY);
  ${state.textRotation !== 0 ? `ctx.rotate((${state.textRotation} * Math.PI) / 180);` : ''}

  // 3. Configure Font & Shadow
  ctx.font = '${state.isItalic ? 'italic ' : ''}${state.fontWeight} ${state.fontSize}px ${state.fontFamily}';
  ctx.textAlign = '${state.textAlign}';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = ${state.textOpacity};

  ${
    state.shadowEnabled
      ? `ctx.shadowColor = '${state.shadowColor}';
  ctx.shadowBlur = ${state.shadowBlur};
  ctx.shadowOffsetX = ${state.shadowOffsetX};
  ctx.shadowOffsetY = ${state.shadowOffsetY};`
      : ''
  }

  // 4. Fill Style
  ${
    state.textColorMode === 'gradient'
      ? `const textGrad = ctx.createLinearGradient(-width / 4, 0, width / 4, 0);
  textGrad.addColorStop(0, '${state.gradientColors[0]}');
  textGrad.addColorStop(1, '${state.gradientColors[1]}');
  ctx.fillStyle = textGrad;`
      : `ctx.fillStyle = '${state.textColor}';`
  }

  // 5. Render Main Headline
  const text = ${JSON.stringify(state.mainText)};
  ${
    state.outlineEnabled && state.outlineWidth > 0
      ? `ctx.strokeStyle = '${state.outlineColor}';
  ctx.lineWidth = ${state.outlineWidth * 2};
  ctx.strokeText(text, 0, 0);`
      : ''
  }
  ctx.fillText(text, 0, 0);

  ${
    state.subtitleEnabled && state.subtitleText
      ? `// 6. Render Subtitle
  ctx.shadowColor = 'transparent';
  ctx.font = '600 ${state.subtitleFontSize}px ${state.subtitleFontFamily || 'Inter, sans-serif'}';
  ctx.fillStyle = '${state.subtitleColor}';
  ctx.fillText(${JSON.stringify(state.subtitleText.toUpperCase())}, 0, ${state.subtitleOffsetY || 35});`
      : ''
  }

  ctx.restore();
  console.log('✓ Rendered WriteGenius typography successfully.');
}

// Example usage:
// window.addEventListener('DOMContentLoaded', () => {
//   renderTypography('myCanvas');
// });
`;
}

/**
 * Universal Code Selector
 */
export function getCodeForFormat(
  format: CodeFormat,
  state: DesignState,
  options: CodeGeneratorOptions = DEFAULT_CODE_OPTIONS
): string {
  switch (format) {
    case 'html-css':
      return generateHtmlCssCode(state, options);
    case 'html':
      return generateHtmlCode(state, options);
    case 'css':
      return generateCssCode(state, options);
    case 'react':
      return generateReactCode(state, options);
    case 'tailwind':
      return generateTailwindCode(state, options);
    case 'svg':
      return generateSvgCode(state, options);
    case 'javascript':
      return generateJsCode(state, options);
    default:
      return generateHtmlCssCode(state, options);
  }
}

/**
 * Helper to get file extension for download
 */
export function getFileExtensionForFormat(format: CodeFormat): string {
  const opt = CODE_FORMAT_OPTIONS.find((o) => o.id === format);
  return opt ? opt.extension : '.html';
}

/**
 * Helper to get recommended default filename
 */
export function getFilenameForFormat(format: CodeFormat, state: DesignState): string {
  const base = state.mainText
    ? state.mainText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24) || 'text-design'
    : 'text-design';

  switch (format) {
    case 'html-css':
      return `${base}-preview.html`;
    case 'html':
      return `${base}.html`;
    case 'css':
      return `${base}.css`;
    case 'react':
      return `TextDesignCard.jsx`;
    case 'tailwind':
      return `${base}-tailwind.html`;
    case 'svg':
      return `${base}.svg`;
    case 'javascript':
      return `${base}-canvas.js`;
    default:
      return `${base}.html`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
