/**
 * High-fidelity procedural creative art generator
 * Used as an instant fallback when Gemini image generation quota is exhausted
 */
export function generateProceduralArt(prompt: string, style: string = 'Digital Art', aspectRatio: string = '1:1'): string {
  let width = 1024;
  let height = 1024;

  if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  } else if (aspectRatio === '3:4') {
    width = 768;
    height = 1024;
  } else if (aspectRatio === '4:3') {
    width = 1024;
    height = 768;
  } else if (aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  }

  // Derive pseudo-random seed from prompt
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // Palette selection based on style & seed
  const palettes = [
    { bg1: '#070B14', bg2: '#0D1424', a1: '#4776FF', a2: '#8957FF', a3: '#00F0FF', name: 'Cyberpunk' },
    { bg1: '#0A1128', bg2: '#1C1936', a1: '#FF2A85', a2: '#7928CA', a3: '#FF0080', name: 'Neon Dream' },
    { bg1: '#061A23', bg2: '#0D324D', a1: '#10B981', a2: '#06B6D4', a3: '#3B82F6', name: 'Deep Oceanic' },
    { bg1: '#1E1B18', bg2: '#2D231E', a1: '#F59E0B', a2: '#EF4444', a3: '#EC4899', name: 'Sunset Glow' },
    { bg1: '#0F172A', bg2: '#1E293B', a1: '#6366F1', a2: '#A855F7', a3: '#38BDF8', name: 'Galactic Aurora' },
  ];
  const p = palettes[seed % palettes.length];

  // Generate glowing orbs and geometric visual layers
  const orbs = [];
  for (let i = 0; i < 6; i++) {
    const cx = ((seed * (i + 1) * 31) % (width - 200)) + 100;
    const cy = ((seed * (i + 1) * 47) % (height - 200)) + 100;
    const r = ((seed * (i + 1) * 17) % (width / 3)) + 80;
    const color = i % 2 === 0 ? p.a1 : p.a2;
    orbs.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.35" filter="url(#glow)"/>`);
  }

  // Generate artistic geometric grid or abstract wave
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}" />
      <stop offset="100%" stop-color="${p.bg2}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.a1}" />
      <stop offset="50%" stop-color="${p.a2}" />
      <stop offset="100%" stop-color="${p.a3}" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="60" result="blur" />
    </filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Deep Canvas Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Ambient Glowing Light Orbs -->
  ${orbs.join('\n  ')}

  <!-- Abstract Vector Art Centerpiece -->
  <g transform="translate(${width / 2}, ${height / 2})">
    <circle r="${Math.min(width, height) * 0.35}" fill="none" stroke="${p.a1}" stroke-width="2" opacity="0.4" stroke-dasharray="8 12"/>
    <circle r="${Math.min(width, height) * 0.28}" fill="none" stroke="${p.a2}" stroke-width="3" opacity="0.6"/>
    <circle r="${Math.min(width, height) * 0.20}" fill="none" stroke="${p.a3}" stroke-width="4" opacity="0.8" stroke-dasharray="16 8"/>

    <!-- Polygonal Core Art -->
    <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="url(#accentGrad)" opacity="0.85" filter="url(#cardShadow)"/>
    <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="${p.bg1}" opacity="0.9"/>
    
    <!-- Stylized emblem -->
    <path d="M-30,-20 L0,-50 L30,-20 L0,40 Z" fill="url(#accentGrad)"/>
    <circle cx="0" cy="0" r="10" fill="#FFFFFF"/>
  </g>

  <!-- Tech Grid Overlay -->
  <g opacity="0.12" stroke="#FFFFFF" stroke-width="1">
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${(height / 8) * (i + 1)}" x2="${width}" y2="${(height / 8) * (i + 1)}" />`).join('\n    ')}
    ${Array.from({ length: 8 }, (_, i) => `<line x1="${(width / 8) * (i + 1)}" y1="0" x2="${(width / 8) * (i + 1)}" y2="${height}" />`).join('\n    ')}
  </g>

  <!-- Prompt Badge Overlay -->
  <rect x="32" y="${height - 110}" width="${width - 64}" height="78" rx="20" fill="#070B14" fill-opacity="0.85" stroke="#263653" stroke-width="2"/>
  <text x="56" y="${height - 72}" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#F8FAFF">
    ${escapeXml(prompt.slice(0, 75))}${prompt.length > 75 ? '...' : ''}
  </text>
  <text x="56" y="${height - 48}" font-family="system-ui, sans-serif" font-size="11" fill="#AAB8D0">
    Style: ${escapeXml(style)} · Aspect Ratio: ${aspectRatio} · WriteGenius Studio
  </text>
</svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
