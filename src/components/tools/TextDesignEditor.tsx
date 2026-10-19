import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type,
  Palette,
  Sparkles,
  Download,
  Copy,
  RotateCcw,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Sliders,
  Layers,
  Check,
  Move,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Trash2,
  Upload,
  Eye,
  FileCode,
  ZoomIn,
  RefreshCw,
} from 'lucide-react';
import { TextDesignCodePanel } from './TextDesignCodePanel';
import { TextDesignAiPromptCard } from './TextDesignAiPromptCard';

export interface TextDesignEditorProps {
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
  initialTemplate?: string;
}

export interface DesignState {
  mainText: string;
  subtitleText: string;
  subtitleEnabled: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  textColorMode: 'solid' | 'gradient';
  textColor: string;
  gradientColors: [string, string];
  gradientAngle: number;
  textOpacity: number;
  textRotation: number;
  posX: number;
  posY: number;

  outlineEnabled: boolean;
  outlineColor: string;
  outlineWidth: number;

  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;

  threeDEnabled: boolean;
  threeDDepth: number;
  threeDColor: string;
  threeDDirection: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  subtitleFontSize: number;
  subtitleFontFamily: string;
  subtitleColor: string;
  subtitleLetterSpacing: number;
  subtitleOffsetY: number;

  canvasWidth: number;
  canvasHeight: number;
  aspectPreset: string;

  bgMode: 'color' | 'gradient' | 'transparent' | 'image';
  bgColor: string;
  bgGradientColors: [string, string];
  bgGradientAngle: number;
  bgImage: string | null;
  bgImageOpacity: number;
  bgImageBlur: number;
  bgImageFit: 'cover' | 'contain';
}

const FONT_OPTIONS = [
  { name: 'Inter', label: 'Inter (Clean Sans)', family: 'Inter, sans-serif' },
  { name: 'Montserrat', label: 'Montserrat (Geometric)', family: 'Montserrat, sans-serif' },
  { name: 'Poppins', label: 'Poppins (Modern Soft)', family: 'Poppins, sans-serif' },
  { name: 'Bebas Neue', label: 'Bebas Neue (Heavy Condensed)', family: '"Bebas Neue", sans-serif' },
  { name: 'Anton', label: 'Anton (Impact Bold)', family: 'Anton, sans-serif' },
  { name: 'Playfair Display', label: 'Playfair Display (Luxury Serif)', family: '"Playfair Display", serif' },
  { name: 'Cinzel', label: 'Cinzel (Classical Elegant)', family: 'Cinzel, serif' },
  { name: 'Orbitron', label: 'Orbitron (Futuristic Sci-Fi)', family: 'Orbitron, sans-serif' },
  { name: 'Righteous', label: 'Righteous (Retro Cyber)', family: 'Righteous, cursive' },
  { name: 'Pacifico', label: 'Pacifico (Smooth Brush)', family: 'Pacifico, cursive' },
  { name: 'Caveat', label: 'Caveat (Handwritten Fun)', family: 'Caveat, cursive' },
  { name: 'Bangers', label: 'Bangers (Comic / Superhero)', family: 'Bangers, cursive' },
  { name: 'Roboto', label: 'Roboto (Standard Sans)', family: 'Roboto, sans-serif' },
  { name: 'JetBrains Mono', label: 'JetBrains Mono (Code / Tech)', family: '"JetBrains Mono", monospace' },
];

const GRADIENT_PRESETS = [
  { name: 'Sunset Orange', colors: ['#FF512F', '#DD2476'], angle: 45 },
  { name: 'Neon Cyberpunk', colors: ['#00F2FE', '#4FACFE'], angle: 90 },
  { name: 'Royal Velvet', colors: ['#8957FF', '#4776FF'], angle: 135 },
  { name: 'Electric Violet', colors: ['#DA22FF', '#9733EE'], angle: 45 },
  { name: 'Golden Luxury', colors: ['#FFE000', '#799F0C'], angle: 120 },
  { name: 'Emerald Glow', colors: ['#11998E', '#38EF7D'], angle: 90 },
  { name: 'Rose Gold', colors: ['#F857A6', '#FF5858'], angle: 45 },
  { name: 'Ice Blizzard', colors: ['#E0EAFC', '#CFDEF3'], angle: 180 },
];

const CANVAS_PRESETS = [
  { id: '1:1', label: '1:1 Square (Instagram / Logo)', w: 1080, h: 1080 },
  { id: '16:9', label: '16:9 Landscape (YouTube Thumbnail)', w: 1280, h: 720 },
  { id: '9:16', label: '9:16 Story / Reel (TikTok / Shorts)', w: 1080, h: 1920 },
  { id: '4:5', label: '4:5 Portrait (Instagram Feed)', w: 1080, h: 1350 },
  { id: '3:1', label: '3:1 Header (Twitter / X Banner)', w: 1500, h: 500 },
  { id: 'facebook', label: '1.91:1 Card (Facebook / OpenGraph)', w: 1200, h: 630 },
  { id: 'poster', label: 'Poster (2:3 Vertical)', w: 1200, h: 1800 },
  { id: 'logo', label: 'Badge / Icon (800x800)', w: 800, h: 800 },
];

const DESIGN_TEMPLATES: Record<string, Partial<DesignState> & { title: string; category: string; description: string }> = {
  modern: {
    title: 'Modern',
    category: 'Minimalist',
    description: 'Ultra-clean dark typography with crisp electric cyan accents.',
    mainText: 'DESIGN STUDIO',
    subtitleText: 'PRECISION DIGITAL CRAFTSMANSHIP',
    subtitleEnabled: true,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 76,
    fontWeight: '800',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 8,
    lineHeight: 1.1,
    textColorMode: 'solid',
    textColor: '#F8FAFF',
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: true,
    shadowColor: 'rgba(71, 118, 255, 0.4)',
    shadowBlur: 20,
    shadowOffsetX: 0,
    shadowOffsetY: 8,
    threeDEnabled: false,
    subtitleFontSize: 18,
    subtitleFontFamily: 'Inter, sans-serif',
    subtitleColor: '#4776FF',
    subtitleLetterSpacing: 6,
    subtitleOffsetY: 35,
    bgMode: 'gradient',
    bgColor: '#070B14',
    bgGradientColors: ['#070B14', '#111A2E'],
    bgGradientAngle: 145,
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  'bold-typography': {
    title: 'Bold Typography',
    category: 'Editorial',
    description: 'Heavy condensed monochrome headline with high impact.',
    mainText: 'LIMITLESS',
    subtitleText: 'BREAK THROUGH THE NOISE',
    subtitleEnabled: true,
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: 130,
    fontWeight: '900',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 4,
    lineHeight: 0.95,
    textColorMode: 'solid',
    textColor: '#FFFFFF',
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: true,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowBlur: 15,
    shadowOffsetX: 0,
    shadowOffsetY: 10,
    threeDEnabled: false,
    subtitleFontSize: 20,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#AAB8D0',
    subtitleLetterSpacing: 10,
    subtitleOffsetY: 30,
    bgMode: 'color',
    bgColor: '#050811',
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  'neon-glow': {
    title: 'Neon Glow',
    category: 'Cyberpunk',
    description: 'Vibrant glowing neon illumination with intense electric bloom.',
    mainText: 'NEON NIGHTS',
    subtitleText: 'CYBERNETIC DREAMS IN HIGH RESOLUTION',
    subtitleEnabled: true,
    fontFamily: 'Righteous, cursive',
    fontSize: 90,
    fontWeight: '700',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 4,
    lineHeight: 1.1,
    textColorMode: 'solid',
    textColor: '#00F2FE',
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: true,
    outlineColor: '#FFFFFF',
    outlineWidth: 2,
    shadowEnabled: true,
    shadowColor: '#00F2FE',
    shadowBlur: 35,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    threeDEnabled: false,
    subtitleFontSize: 18,
    subtitleFontFamily: 'Orbitron, sans-serif',
    subtitleColor: '#DA22FF',
    subtitleLetterSpacing: 5,
    subtitleOffsetY: 35,
    bgMode: 'gradient',
    bgColor: '#03050C',
    bgGradientColors: ['#02040A', '#0D091F'],
    bgGradientAngle: 180,
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  'gradient-text': {
    title: 'Gradient Text',
    category: 'Futuristic',
    description: 'Vibrant multi-stop color transitions with subtle ambient drop shadows.',
    mainText: 'CREATIVE POWER',
    subtitleText: 'SUPERCHARGED WITH NEXT-GEN AI ACCELERATION',
    subtitleEnabled: true,
    fontFamily: 'Poppins, sans-serif',
    fontSize: 82,
    fontWeight: '900',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 1.1,
    textColorMode: 'gradient',
    textColor: '#8957FF',
    gradientColors: ['#4776FF', '#8957FF'],
    gradientAngle: 45,
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: true,
    shadowColor: 'rgba(137, 87, 255, 0.45)',
    shadowBlur: 24,
    shadowOffsetX: 0,
    shadowOffsetY: 12,
    threeDEnabled: false,
    subtitleFontSize: 16,
    subtitleFontFamily: 'Inter, sans-serif',
    subtitleColor: '#F8FAFF',
    subtitleLetterSpacing: 4,
    subtitleOffsetY: 30,
    bgMode: 'gradient',
    bgColor: '#070B14',
    bgGradientColors: ['#070B14', '#13122B'],
    bgGradientAngle: 135,
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  minimal: {
    title: 'Minimal',
    category: 'Clean',
    description: 'Timeless spacious composition with refined breathing room.',
    mainText: 'ESSENCE',
    subtitleText: 'PURITY IN FORM & FUNCTION',
    subtitleEnabled: true,
    fontFamily: 'Inter, sans-serif',
    fontSize: 68,
    fontWeight: '400',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 16,
    lineHeight: 1.2,
    textColorMode: 'solid',
    textColor: '#F8FAFF',
    textOpacity: 0.95,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: false,
    threeDEnabled: false,
    subtitleFontSize: 14,
    subtitleFontFamily: 'Inter, sans-serif',
    subtitleColor: '#7E8B9F',
    subtitleLetterSpacing: 10,
    subtitleOffsetY: 35,
    bgMode: 'color',
    bgColor: '#090D18',
    aspectPreset: '1:1',
    canvasWidth: 1080,
    canvasHeight: 1080,
  },
  elegant: {
    title: 'Elegant',
    category: 'Luxury',
    description: 'High-society serif typography with champagne and gold luster.',
    mainText: 'The Masterpiece',
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
    letterSpacing: 2,
    lineHeight: 1.15,
    textColorMode: 'gradient',
    textColor: '#FDE047',
    gradientColors: ['#FDE047', '#D97706'],
    gradientAngle: 60,
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: true,
    shadowColor: 'rgba(217, 119, 6, 0.4)',
    shadowBlur: 18,
    shadowOffsetX: 0,
    shadowOffsetY: 6,
    threeDEnabled: false,
    subtitleFontSize: 15,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#FDE68A',
    subtitleLetterSpacing: 6,
    subtitleOffsetY: 35,
    bgMode: 'gradient',
    bgColor: '#08080C',
    bgGradientColors: ['#0A0910', '#18120B'],
    bgGradientAngle: 120,
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  '3d-style': {
    title: '3D-Style Text',
    category: 'Dimensional',
    description: 'Multi-layer isometric extruded shadows for maximum depth.',
    mainText: 'UNSTOPPABLE',
    subtitleText: 'BUILT TO BREAK BOUNDARIES',
    subtitleEnabled: true,
    fontFamily: 'Anton, sans-serif',
    fontSize: 105,
    fontWeight: '900',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 3,
    lineHeight: 1.0,
    textColorMode: 'solid',
    textColor: '#FF0055',
    textOpacity: 1,
    textRotation: -3,
    posX: 0,
    posY: 0,
    outlineEnabled: true,
    outlineColor: '#FFFFFF',
    outlineWidth: 3,
    shadowEnabled: true,
    shadowColor: '#000000',
    shadowBlur: 0,
    shadowOffsetX: 12,
    shadowOffsetY: 12,
    threeDEnabled: true,
    threeDDepth: 12,
    threeDColor: '#58001F',
    threeDDirection: 'bottom-right',
    subtitleFontSize: 18,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#FFFFFF',
    subtitleLetterSpacing: 5,
    subtitleOffsetY: 35,
    bgMode: 'gradient',
    bgColor: '#0F172A',
    bgGradientColors: ['#0B0F19', '#1A1325'],
    bgGradientAngle: 135,
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  'social-media': {
    title: 'Social Media Post',
    category: 'Social',
    description: 'High-engagement punchy headline optimized for social feeds.',
    mainText: 'STOP SCROLLING!',
    subtitleText: 'SAVE THIS WORKFLOW TO SAVE 10 HOURS THIS WEEK',
    subtitleEnabled: true,
    fontFamily: 'Poppins, sans-serif',
    fontSize: 88,
    fontWeight: '900',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 1.05,
    textColorMode: 'gradient',
    textColor: '#38EF7D',
    gradientColors: ['#00F2FE', '#4FACFE'],
    gradientAngle: 90,
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: true,
    shadowColor: 'rgba(0, 242, 254, 0.4)',
    shadowBlur: 20,
    shadowOffsetX: 0,
    shadowOffsetY: 8,
    threeDEnabled: false,
    subtitleFontSize: 19,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#F8FAFF',
    subtitleLetterSpacing: 2,
    subtitleOffsetY: 35,
    bgMode: 'gradient',
    bgColor: '#070B14',
    bgGradientColors: ['#050811', '#0F172A'],
    bgGradientAngle: 140,
    aspectPreset: '1:1',
    canvasWidth: 1080,
    canvasHeight: 1080,
  },
  'youtube-thumbnail': {
    title: 'YouTube Thumbnail',
    category: 'YouTube',
    description: 'High-CTR massive text with heavy contrasting outline stroke.',
    mainText: '10X FASTER!',
    subtitleText: 'NOBODY TOLD YOU THIS SECRET',
    subtitleEnabled: true,
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: 140,
    fontWeight: '900',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 0.95,
    textColorMode: 'solid',
    textColor: '#FFDF00',
    textOpacity: 1,
    textRotation: -4,
    posX: 0,
    posY: -20,
    outlineEnabled: true,
    outlineColor: '#000000',
    outlineWidth: 8,
    shadowEnabled: true,
    shadowColor: 'rgba(0,0,0,0.95)',
    shadowBlur: 16,
    shadowOffsetX: 6,
    shadowOffsetY: 8,
    threeDEnabled: false,
    subtitleFontSize: 24,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#FFFFFF',
    subtitleLetterSpacing: 3,
    subtitleOffsetY: 40,
    bgMode: 'gradient',
    bgColor: '#050811',
    bgGradientColors: ['#0B0D17', '#1E1430'],
    bgGradientAngle: 120,
    aspectPreset: '16:9',
    canvasWidth: 1280,
    canvasHeight: 720,
  },
  'promotional-poster': {
    title: 'Promotional Poster',
    category: 'Marketing',
    description: 'Dynamic sale and event flyer typography that commands attention.',
    mainText: 'SUMMER FEST',
    subtitleText: 'LIVE MUSIC · FOOD TRUCKS · FREE ENTRY · JULY 24',
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
    shadowEnabled: true,
    shadowColor: 'rgba(221, 36, 118, 0.45)',
    shadowBlur: 25,
    shadowOffsetX: 0,
    shadowOffsetY: 10,
    threeDEnabled: false,
    subtitleFontSize: 16,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#F8FAFF',
    subtitleLetterSpacing: 4,
    subtitleOffsetY: 35,
    bgMode: 'gradient',
    bgColor: '#080811',
    bgGradientColors: ['#080811', '#1A0C1E'],
    bgGradientAngle: 160,
    aspectPreset: 'poster',
    canvasWidth: 1200,
    canvasHeight: 1800,
  },
  'quote-card': {
    title: 'Quote Card',
    category: 'Inspiration',
    description: 'Artistic quote format with quotation marks and author attribution.',
    mainText: '"Simplicity is the ultimate sophistication."',
    subtitleText: '— LEONARDO DA VINCI',
    subtitleEnabled: true,
    fontFamily: '"Playfair Display", serif',
    fontSize: 54,
    fontWeight: '600',
    isBold: false,
    isItalic: true,
    isUnderline: false,
    textTransform: 'none',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 1.35,
    textColorMode: 'solid',
    textColor: '#F8FAFF',
    textOpacity: 0.95,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: false,
    shadowEnabled: true,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    threeDEnabled: false,
    subtitleFontSize: 15,
    subtitleFontFamily: 'Montserrat, sans-serif',
    subtitleColor: '#AAB8D0',
    subtitleLetterSpacing: 6,
    subtitleOffsetY: 35,
    bgMode: 'color',
    bgColor: '#0B0F19',
    aspectPreset: '1:1',
    canvasWidth: 1080,
    canvasHeight: 1080,
  },
  'gaming-logo': {
    title: 'Gaming Logo',
    category: 'Esports',
    description: 'Futuristic aggressive gamer tag with electric border and aura.',
    mainText: 'APEX FORCE',
    subtitleText: 'CHAMPIONSHIP ESPORTS TEAM',
    subtitleEnabled: true,
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 72,
    fontWeight: '900',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 5,
    lineHeight: 1.1,
    textColorMode: 'gradient',
    textColor: '#00F2FE',
    gradientColors: ['#00F2FE', '#4FACFE'],
    gradientAngle: 90,
    textOpacity: 1,
    textRotation: 0,
    posX: 0,
    posY: 0,
    outlineEnabled: true,
    outlineColor: '#000000',
    outlineWidth: 5,
    shadowEnabled: true,
    shadowColor: '#00F2FE',
    shadowBlur: 30,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    threeDEnabled: true,
    threeDDepth: 8,
    threeDColor: '#003366',
    threeDDirection: 'bottom-right',
    subtitleFontSize: 15,
    subtitleFontFamily: 'Orbitron, sans-serif',
    subtitleColor: '#FFFFFF',
    subtitleLetterSpacing: 6,
    subtitleOffsetY: 32,
    bgMode: 'gradient',
    bgColor: '#040711',
    bgGradientColors: ['#040711', '#0A1226'],
    bgGradientAngle: 135,
    aspectPreset: 'logo',
    canvasWidth: 800,
    canvasHeight: 800,
  },
};

const DEFAULT_STATE: DesignState = {
  mainText: 'DESIGN STUDIO',
  subtitleText: 'PRECISION DIGITAL CRAFTSMANSHIP',
  subtitleEnabled: true,
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 76,
  fontWeight: '800',
  isBold: true,
  isItalic: false,
  isUnderline: false,
  textTransform: 'uppercase',
  textAlign: 'center',
  letterSpacing: 6,
  lineHeight: 1.1,
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
  outlineWidth: 3,

  shadowEnabled: true,
  shadowColor: 'rgba(71, 118, 255, 0.4)',
  shadowBlur: 20,
  shadowOffsetX: 0,
  shadowOffsetY: 8,

  threeDEnabled: false,
  threeDDepth: 8,
  threeDColor: '#1e293b',
  threeDDirection: 'bottom-right',

  subtitleFontSize: 18,
  subtitleFontFamily: 'Inter, sans-serif',
  subtitleColor: '#4776FF',
  subtitleLetterSpacing: 6,
  subtitleOffsetY: 35,

  canvasWidth: 1280,
  canvasHeight: 720,
  aspectPreset: '16:9',

  bgMode: 'gradient',
  bgColor: '#070B14',
  bgGradientColors: ['#070B14', '#111A2E'],
  bgGradientAngle: 145,
  bgImage: null,
  bgImageOpacity: 0.8,
  bgImageBlur: 0,
  bgImageFit: 'cover',
};

export const TextDesignEditor: React.FC<TextDesignEditorProps> = ({
  onShowToast,
  initialTemplate = 'modern',
}) => {
  // Current design state
  const [state, setState] = useState<DesignState>(() => {
    const tmpl = DESIGN_TEMPLATES[initialTemplate];
    return tmpl ? { ...DEFAULT_STATE, ...tmpl } : DEFAULT_STATE;
  });

  // History stack for Undo/Redo
  const [history, setHistory] = useState<DesignState[]>([state]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active Mode: 'design' or 'code'
  const [editorMode, setEditorMode] = useState<'design' | 'code'>('design');

  // Active Control Panel Tab
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'colors' | 'effects' | 'canvas'>('templates');

  // Canvas Refs & drag state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPosX: number; initialPosY: number }>({
    x: 0,
    y: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  // Export resolution multiplier
  const [exportScale, setExportScale] = useState<number>(1);
  const [exportLoading, setExportLoading] = useState(false);
  const [copiedRecently, setCopiedRecently] = useState(false);

  // Background image element cache
  const bgImageElementRef = useRef<HTMLImageElement | null>(null);

  // Update State with History recording
  const updateState = useCallback((updater: Partial<DesignState> | ((prev: DesignState) => DesignState)) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      // Push to history
      setHistory((prevHist) => {
        const sliced = prevHist.slice(0, historyIndex + 1);
        return [...sliced, next];
      });
      setHistoryIndex((prevIdx) => prevIdx + 1);
      return next;
    });
  }, [historyIndex]);

  // Live state change without history push (e.g. while dragging or dragging slider)
  const updateStateTransient = useCallback((updater: Partial<DesignState>) => {
    setState((prev) => ({ ...prev, ...updater }));
  }, []);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setState(history[nextIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setState(history[nextIdx]);
    }
  };

  const handleReset = () => {
    updateState(DEFAULT_STATE);
    if (onShowToast) onShowToast('Reset canvas to default layout.', 'success');
  };

  // Keyboard shortcut listener for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Handle template selection
  const handleSelectTemplate = (templateKey: string) => {
    const tmpl = DESIGN_TEMPLATES[templateKey];
    if (tmpl) {
      updateState((prev) => ({
        ...prev,
        ...tmpl,
      }));
      if (onShowToast) onShowToast(`Applied "${tmpl.title}" template!`, 'success');
    }
  };

  // Handle Aspect Ratio Presets
  const handleAspectPresetChange = (presetId: string) => {
    const preset = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      updateState({
        aspectPreset: preset.id,
        canvasWidth: preset.w,
        canvasHeight: preset.h,
      });
    } else {
      updateState({ aspectPreset: 'custom' });
    }
  };

  // Handle Background Image Upload
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please upload a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        bgImageElementRef.current = img;
        updateState({
          bgMode: 'image',
          bgImage: result,
        });
        if (onShowToast) onShowToast('Background image loaded!', 'success');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Preload background image whenever bgImage state changes
  useEffect(() => {
    if (state.bgImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        bgImageElementRef.current = img;
        renderCanvas();
      };
      img.src = state.bgImage;
    } else {
      bgImageElementRef.current = null;
      renderCanvas();
    }
  }, [state.bgImage]);

  // Main Canvas Rendering Logic
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = state.canvasWidth;
    const height = state.canvasHeight;

    canvas.width = width;
    canvas.height = height;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Render Background
    if (state.bgMode === 'transparent') {
      // Keep clear for PNG transparency
    } else if (state.bgMode === 'image' && bgImageElementRef.current) {
      ctx.save();
      if (state.bgImageBlur > 0) {
        ctx.filter = `blur(${state.bgImageBlur}px)`;
      }
      ctx.globalAlpha = state.bgImageOpacity;

      const img = bgImageElementRef.current;
      if (state.bgImageFit === 'contain') {
        const ratio = Math.min(width / img.width, height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      } else {
        // Cover
        const ratio = Math.max(width / img.width, height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      }
      ctx.restore();
    } else if (state.bgMode === 'gradient') {
      const angleRad = ((state.bgGradientAngle - 90) * Math.PI) / 180;
      const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
      const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
      const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
      const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, state.bgGradientColors[0]);
      grad.addColorStop(1, state.bgGradientColors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Solid Color
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Prepare Main Text & Transformation
    let displayText = state.mainText;
    if (state.textTransform === 'uppercase') displayText = displayText.toUpperCase();
    if (state.textTransform === 'lowercase') displayText = displayText.toLowerCase();
    if (state.textTransform === 'capitalize') {
      displayText = displayText.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Calculate Center Anchor
    const centerX = width / 2 + state.posX;
    const centerY = height / 2 + state.posY;

    ctx.save();
    ctx.translate(centerX, centerY);

    if (state.textRotation !== 0) {
      ctx.rotate((state.textRotation * Math.PI) / 180);
    }

    ctx.globalAlpha = state.textOpacity;

    // Font Spec: e.g. "bold italic 72px 'Montserrat', sans-serif"
    const fontParts = [];
    if (state.isItalic) fontParts.push('italic');
    if (state.isBold || parseInt(state.fontWeight, 10) >= 700) {
      fontParts.push(state.fontWeight || 'bold');
    } else {
      fontParts.push(state.fontWeight || 'normal');
    }
    fontParts.push(`${state.fontSize}px`);
    fontParts.push(state.fontFamily);
    ctx.font = fontParts.join(' ');
    ctx.textAlign = state.textAlign;
    ctx.textBaseline = 'middle';

    // Letter Spacing (modern HTML5 canvas feature with fallback)
    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = `${state.letterSpacing}px`;
    }

    // Split text into multi-lines if present
    const lines = displayText.split('\n');
    const lineHeightPx = state.fontSize * state.lineHeight;
    const totalTextHeight = lines.length * lineHeightPx;
    const startY = -(totalTextHeight / 2) + lineHeightPx / 2;

    // 3. Render 3D Extrusion Effect (Multi-pass shadows behind text)
    if (state.threeDEnabled && state.threeDDepth > 0) {
      ctx.save();
      const dirMap = {
        'bottom-right': { dx: 1, dy: 1 },
        'bottom-left': { dx: -1, dy: 1 },
        'top-right': { dx: 1, dy: -1 },
        'top-left': { dx: -1, dy: -1 },
      };
      const { dx, dy } = dirMap[state.threeDDirection];

      for (let i = state.threeDDepth; i >= 1; i--) {
        ctx.fillStyle = state.threeDColor;
        lines.forEach((line, index) => {
          const y = startY + index * lineHeightPx;
          ctx.fillText(line, i * dx, y + i * dy);
        });
      }
      ctx.restore();
    }

    // 4. Render Outline Stroke Behind Fill if enabled
    if (state.outlineEnabled && state.outlineWidth > 0) {
      ctx.save();
      ctx.strokeStyle = state.outlineColor;
      ctx.lineWidth = state.outlineWidth * 2;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;

      lines.forEach((line, index) => {
        const y = startY + index * lineHeightPx;
        ctx.strokeText(line, 0, y);
      });
      ctx.restore();
    }

    // 5. Setup Shadow / Neon Glow
    if (state.shadowEnabled) {
      ctx.shadowColor = state.shadowColor;
      ctx.shadowBlur = state.shadowBlur;
      ctx.shadowOffsetX = state.shadowOffsetX;
      ctx.shadowOffsetY = state.shadowOffsetY;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // 6. Setup Text Fill (Solid or Linear Gradient)
    if (state.textColorMode === 'gradient') {
      const textMetrics = ctx.measureText(displayText);
      const textWidth = textMetrics.width || width * 0.8;

      const gx1 = -textWidth / 2;
      const gy1 = -state.fontSize / 2;
      const gx2 = textWidth / 2;
      const gy2 = state.fontSize / 2;

      const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
      grad.addColorStop(0, state.gradientColors[0]);
      grad.addColorStop(1, state.gradientColors[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = state.textColor;
    }

    // Draw Main Text Fill
    lines.forEach((line, index) => {
      const y = startY + index * lineHeightPx;
      ctx.fillText(line, 0, y);

      // Underline support if toggled
      if (state.isUnderline) {
        ctx.save();
        const metrics = ctx.measureText(line);
        const w = metrics.width;
        let lineStartX = -w / 2;
        if (state.textAlign === 'left') lineStartX = 0;
        if (state.textAlign === 'right') lineStartX = -w;

        ctx.strokeStyle = state.textColor;
        ctx.lineWidth = Math.max(2, state.fontSize * 0.05);
        ctx.beginPath();
        ctx.moveTo(lineStartX, y + state.fontSize * 0.45);
        ctx.lineTo(lineStartX + w, y + state.fontSize * 0.45);
        ctx.stroke();
        ctx.restore();
      }
    });

    // 7. Subtitle Layer (if enabled)
    if (state.subtitleEnabled && state.subtitleText.trim()) {
      ctx.save();
      // Clear main shadow so subtitle stays crisp
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const subFontParts = ['normal', `${state.subtitleFontSize}px`, state.subtitleFontFamily];
      ctx.font = subFontParts.join(' ');
      ctx.fillStyle = state.subtitleColor;
      ctx.textAlign = state.textAlign;
      ctx.textBaseline = 'middle';

      if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = `${state.subtitleLetterSpacing}px`;
      }

      const subY = startY + lines.length * lineHeightPx + state.subtitleOffsetY;
      ctx.fillText(state.subtitleText, 0, subY);
      ctx.restore();
    }

    ctx.restore();
  }, [state]);

  // Re-render whenever state changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Canvas Drag & Drop Text Positioning
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPosX: state.posX,
      initialPosY: state.posY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate scale between display canvas and native canvas resolution
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const deltaX = (e.clientX - dragStartRef.current.x) * scaleX;
    const deltaY = (e.clientY - dragStartRef.current.y) * scaleY;

    updateStateTransient({
      posX: Math.round(dragStartRef.current.initialPosX + deltaX),
      posY: Math.round(dragStartRef.current.initialPosY + deltaY),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    // Push the final dragged position into history
    updateState({ posX: state.posX, posY: state.posY });
  };

  // Center Text Horizontally or Vertically
  const handleCenterAlign = (axis: 'both' | 'x' | 'y') => {
    if (axis === 'both') updateState({ posX: 0, posY: 0 });
    if (axis === 'x') updateState({ posX: 0 });
    if (axis === 'y') updateState({ posY: 0 });
    if (onShowToast) onShowToast('Centered text positioning.', 'success');
  };

  // Export as PNG
  const handleDownloadPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExportLoading(true);

    try {
      if (exportScale > 1) {
        // High-res render on temporary offscreen canvas
        const offCanvas = document.createElement('canvas');
        offCanvas.width = state.canvasWidth * exportScale;
        offCanvas.height = state.canvasHeight * exportScale;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.scale(exportScale, exportScale);
          // Draw using standard render pass
          const origCanvas = canvasRef.current;
          if (origCanvas) {
            offCtx.drawImage(origCanvas, 0, 0);
          }
        }
        const dataUrl = offCanvas.toDataURL('image/png');
        downloadUrl(dataUrl, `text-design-${state.aspectPreset}-${Date.now()}.png`);
      } else {
        const dataUrl = canvas.toDataURL('image/png');
        downloadUrl(dataUrl, `text-design-${state.aspectPreset}-${Date.now()}.png`);
      }
      if (onShowToast) onShowToast('Downloaded high-resolution PNG image!', 'success');
    } catch (err) {
      if (onShowToast) onShowToast('Failed to export PNG image.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Export as JPG
  const handleDownloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExportLoading(true);

    try {
      // JPG requires a solid background, if transparent default to dark studio
      let dataUrl: string;
      if (state.bgMode === 'transparent') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tctx = tempCanvas.getContext('2d');
        if (tctx) {
          tctx.fillStyle = '#070B14';
          tctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tctx.drawImage(canvas, 0, 0);
        }
        dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
      } else {
        dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      }
      downloadUrl(dataUrl, `text-design-${state.aspectPreset}-${Date.now()}.jpg`);
      if (onShowToast) onShowToast('Downloaded high-resolution JPG image!', 'success');
    } catch (err) {
      if (onShowToast) onShowToast('Failed to export JPG image.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Export as SVG
  const handleDownloadSvg = () => {
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    const cx = w / 2 + state.posX;
    const cy = h / 2 + state.posY;

    let bgMarkup = '';
    if (state.bgMode === 'color') {
      bgMarkup = `<rect width="${w}" height="${h}" fill="${state.bgColor}" />`;
    } else if (state.bgMode === 'gradient') {
      bgMarkup = `
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${state.bgGradientColors[0]}" />
            <stop offset="100%" stop-color="${state.bgGradientColors[1]}" />
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bgGrad)" />
      `;
    }

    const lines = state.mainText.split('\n');
    const lineHeight = state.fontSize * state.lineHeight;
    const textStart = cy - (lines.length * lineHeight) / 2 + lineHeight / 2;

    const textElements = lines
      .map(
        (line, idx) => `
        <text 
          x="${cx}" 
          y="${textStart + idx * lineHeight}" 
          font-family="${state.fontFamily.replace(/"/g, '')}" 
          font-size="${state.fontSize}" 
          font-weight="${state.fontWeight}" 
          text-anchor="${state.textAlign === 'center' ? 'middle' : state.textAlign}" 
          fill="${state.textColorMode === 'solid' ? state.textColor : state.gradientColors[0]}"
          letter-spacing="${state.letterSpacing}px"
          ${state.outlineEnabled ? `stroke="${state.outlineColor}" stroke-width="${state.outlineWidth}"` : ''}
        >${escapeXml(line)}</text>
      `
      )
      .join('\n');

    let subtitleElement = '';
    if (state.subtitleEnabled && state.subtitleText) {
      const subY = textStart + lines.length * lineHeight + state.subtitleOffsetY;
      subtitleElement = `
        <text 
          x="${cx}" 
          y="${subY}" 
          font-family="${state.subtitleFontFamily.replace(/"/g, '')}" 
          font-size="${state.subtitleFontSize}" 
          text-anchor="${state.textAlign === 'center' ? 'middle' : state.textAlign}" 
          fill="${state.subtitleColor}"
          letter-spacing="${state.subtitleLetterSpacing}px"
        >${escapeXml(state.subtitleText)}</text>
      `;
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  ${bgMarkup}
  ${textElements}
  ${subtitleElement}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, `text-design-${Date.now()}.svg`);
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('Downloaded scalable vector SVG!', 'success');
  };

  // Helper download trigger
  const downloadUrl = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '\'':
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });
  };

  // Copy Image to Clipboard
  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedRecently(true);
          setTimeout(() => setCopiedRecently(false), 2500);
          if (onShowToast) onShowToast('Image copied to clipboard! Paste anywhere (Ctrl+V).', 'success');
        } catch (err) {
          if (onShowToast) onShowToast('Clipboard write permission denied.', 'error');
        }
      }, 'image/png');
    } catch (e) {
      if (onShowToast) onShowToast('Copy to clipboard is not supported on this browser.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. Primary Mode Selector Bar: Design Mode vs Code Mode */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="inline-flex p-1 rounded-2xl bg-[#090F1D] border border-[#263653] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setEditorMode('design')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                editorMode === 'design'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-lg shadow-[#4776FF]/25'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Design Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setEditorMode('code')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                editorMode === 'code'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-lg shadow-[#4776FF]/25'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <FileCode className="w-4 h-4 text-[#4776FF]" />
              <span>Code Mode</span>
              <span className="hidden md:inline px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-[#263653] text-[#7095FF]">
                HTML · CSS · React · Tailwind · SVG
              </span>
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-[#AAB8D0]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">
            {editorMode === 'design'
              ? 'Real-time Canvas Editor & Preset Studio'
              : 'Production Code Generator with Live DOM Preview'}
          </span>
        </div>
      </div>

      {editorMode === 'code' ? (
        <TextDesignCodePanel
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onSwitchToDesignMode={() => setEditorMode('design')}
        />
      ) : (
        <div className="space-y-6">
          {/* Natural Language AI Prompt Card */}
          <TextDesignAiPromptCard
            onApplyDesign={(designUpdates) => updateState(designUpdates)}
            onShowToast={onShowToast}
            onSwitchToCodeMode={() => setEditorMode('code')}
          />

          {/* Top Workspace Header & Action Controls */}
          <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Quick Undo / Redo / Reset */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-xl border border-[#263653] text-xs font-medium flex items-center gap-1.5 transition-colors ${
              historyIndex > 0
                ? 'bg-[#111B30] text-[#F8FAFF] hover:bg-[#1A2846]'
                : 'bg-[#090F1D] text-[#AAB8D0]/40 cursor-not-allowed border-transparent'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-xl border border-[#263653] text-xs font-medium flex items-center gap-1.5 transition-colors ${
              historyIndex < history.length - 1
                ? 'bg-[#111B30] text-[#F8FAFF] hover:bg-[#1A2846]'
                : 'bg-[#090F1D] text-[#AAB8D0]/40 cursor-not-allowed border-transparent'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Redo</span>
          </button>

          <div className="h-5 w-px bg-[#263653] mx-1" />

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#111B30] hover:bg-[#1A2846] border border-[#263653] text-xs font-medium text-[#AAB8D0] hover:text-[#F8FAFF] flex items-center gap-1.5 transition-colors"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => handleCenterAlign('both')}
            className="p-2 rounded-xl bg-[#111B30] hover:bg-[#1A2846] border border-[#263653] text-xs font-medium text-[#4776FF] flex items-center gap-1.5 transition-colors"
            title="Center text positioning on canvas"
          >
            <Move className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Center Text</span>
          </button>
        </div>

        {/* Right: Export Multipliers & Download Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#090F1D] border border-[#263653] rounded-xl p-1 text-xs text-[#AAB8D0]">
            <span className="px-2 text-[10px] uppercase font-bold text-[#AAB8D0]">Scale</span>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setExportScale(s)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                  exportScale === s
                    ? 'bg-[#4776FF] text-white'
                    : 'hover:text-[#F8FAFF] text-[#AAB8D0]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="px-3.5 py-2 text-xs font-semibold text-[#F8FAFF] bg-[#111B30] hover:bg-[#1B2945] border border-[#263653] rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            {copiedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#4776FF]" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          {/* Download Dropdown / Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={exportLoading}
              onClick={handleDownloadPng}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>

            <button
              type="button"
              disabled={exportLoading}
              onClick={handleDownloadJpg}
              className="px-3 py-2 text-xs font-semibold text-[#F8FAFF] bg-[#111B30] hover:bg-[#1B2945] border border-[#263653] rounded-xl transition-colors"
              title="Download JPG (compressed)"
            >
              JPG
            </button>

            <button
              type="button"
              disabled={exportLoading}
              onClick={handleDownloadSvg}
              className="px-3 py-2 text-xs font-semibold text-[#F8FAFF] bg-[#111B30] hover:bg-[#1B2945] border border-[#263653] rounded-xl transition-colors"
              title="Download Scalable Vector SVG"
            >
              SVG
            </button>

            <button
              type="button"
              onClick={() => setEditorMode('code')}
              className="px-3.5 py-2 text-xs font-bold text-[#7095FF] bg-[#111A2E] hover:bg-[#1A2846] border border-[#4776FF]/40 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              title="Generate HTML, CSS, React, Tailwind, SVG, JS code"
            >
              <FileCode className="w-3.5 h-3.5 text-[#4776FF]" />
              <span className="hidden sm:inline">Get Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Control Panel (Tabs) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0D1426] border border-[#263653] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'templates'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('colors')}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'colors'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('effects')}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'effects'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Effects</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'canvas'
                  ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                  : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
          </div>

          {/* Tab 1: Design Templates */}
          {activeTab === 'templates' && (
            <div className="p-5 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">
                  Selectable Design Templates ({Object.keys(DESIGN_TEMPLATES).length})
                </span>
                <span className="text-[10px] text-[#AAB8D0]">Click to apply</span>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
                {Object.entries(DESIGN_TEMPLATES).map(([key, tmpl]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectTemplate(key)}
                    className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] text-left transition-all duration-200 hover:-translate-y-0.5 group space-y-1.5 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors">
                        {tmpl.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#111B30] text-[#AAB8D0] font-mono">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#AAB8D0] line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Typography & Content */}
          {activeTab === 'text' && (
            <div className="p-5 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-5 shadow-xl">
              {/* Main Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F8FAFF]">Main Headline Text</label>
                <textarea
                  value={state.mainText}
                  onChange={(e) => updateState({ mainText: e.target.value })}
                  placeholder="Type your main text here..."
                  rows={2}
                  className="w-full p-3 text-sm rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                />
              </div>

              {/* Subtitle Input */}
              <div className="space-y-2 pt-2 border-t border-[#263653]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#F8FAFF]">Subtitle / Tagline</label>
                  <label className="flex items-center gap-1.5 text-xs text-[#AAB8D0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.subtitleEnabled}
                      onChange={(e) => updateState({ subtitleEnabled: e.target.checked })}
                      className="rounded bg-[#090F1D] border-[#263653] text-[#4776FF] focus:ring-0"
                    />
                    <span>Enable</span>
                  </label>
                </div>
                {state.subtitleEnabled && (
                  <input
                    type="text"
                    value={state.subtitleText}
                    onChange={(e) => updateState({ subtitleText: e.target.value })}
                    placeholder="Enter catchy subtitle..."
                    className="w-full p-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                  />
                )}
              </div>

              {/* Font Family Selection */}
              <div className="space-y-1.5 pt-2 border-t border-[#263653]">
                <label className="text-xs font-semibold text-[#F8FAFF]">Font Family</label>
                <select
                  value={state.fontFamily}
                  onChange={(e) => updateState({ fontFamily: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.name} value={f.family} className="bg-[#0D1424] text-[#F8FAFF]">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F8FAFF]">Size</span>
                    <span className="font-mono text-[#AAB8D0]">{state.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="220"
                    value={state.fontSize}
                    onChange={(e) => updateStateTransient({ fontSize: Number(e.target.value) })}
                    onMouseUp={() => updateState({ fontSize: state.fontSize })}
                    className="w-full accent-[#4776FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#F8FAFF] block">Weight</span>
                  <select
                    value={state.fontWeight}
                    onChange={(e) => updateState({ fontWeight: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>
              </div>

              {/* Text Styles & Alignments */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#263653]">
                <div className="flex items-center bg-[#090F1D] border border-[#263653] rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => updateState({ isBold: !state.isBold })}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      state.isBold ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ isItalic: !state.isItalic })}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      state.isItalic ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ isUnderline: !state.isUnderline })}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      state.isUnderline ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center bg-[#090F1D] border border-[#263653] rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => updateState({ textAlign: 'left' })}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      state.textAlign === 'left' ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ textAlign: 'center' })}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      state.textAlign === 'center' ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ textAlign: 'right' })}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      state.textAlign === 'right' ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center bg-[#090F1D] border border-[#263653] rounded-xl p-1 gap-1 text-[11px] font-mono">
                  {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateState({ textTransform: t })}
                      className={`px-1.5 py-1 rounded text-[10px] uppercase font-bold transition-colors ${
                        state.textTransform === t ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                      }`}
                    >
                      {t === 'none' ? 'Aa' : t === 'uppercase' ? 'AA' : t === 'lowercase' ? 'aa' : 'Ab'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing & Line Height */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#263653]">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F8FAFF]">Letter Spacing</span>
                    <span className="font-mono text-[#AAB8D0]">{state.letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="24"
                    value={state.letterSpacing}
                    onChange={(e) => updateStateTransient({ letterSpacing: Number(e.target.value) })}
                    onMouseUp={() => updateState({ letterSpacing: state.letterSpacing })}
                    className="w-full accent-[#4776FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F8FAFF]">Line Spacing</span>
                    <span className="font-mono text-[#AAB8D0]">{state.lineHeight.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.2"
                    step="0.05"
                    value={state.lineHeight}
                    onChange={(e) => updateStateTransient({ lineHeight: Number(e.target.value) })}
                    onMouseUp={() => updateState({ lineHeight: state.lineHeight })}
                    className="w-full accent-[#4776FF]"
                  />
                </div>
              </div>

              {/* Text Rotation & Opacity */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#263653]">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F8FAFF]">Rotation</span>
                    <span className="font-mono text-[#AAB8D0]">{state.textRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={state.textRotation}
                    onChange={(e) => updateStateTransient({ textRotation: Number(e.target.value) })}
                    onMouseUp={() => updateState({ textRotation: state.textRotation })}
                    className="w-full accent-[#4776FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F8FAFF]">Opacity</span>
                    <span className="font-mono text-[#AAB8D0]">{Math.round(state.textOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={state.textOpacity}
                    onChange={(e) => updateStateTransient({ textOpacity: Number(e.target.value) })}
                    onMouseUp={() => updateState({ textOpacity: state.textOpacity })}
                    className="w-full accent-[#4776FF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Colors & Gradient */}
          {activeTab === 'colors' && (
            <div className="p-5 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-5 shadow-xl">
              {/* Solid vs Gradient Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F8FAFF]">Text Fill Type</span>
                <div className="flex items-center bg-[#090F1D] border border-[#263653] rounded-xl p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => updateState({ textColorMode: 'solid' })}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      state.textColorMode === 'solid'
                        ? 'bg-[#4776FF] text-white shadow'
                        : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ textColorMode: 'gradient' })}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      state.textColorMode === 'gradient'
                        ? 'bg-[#4776FF] text-white shadow'
                        : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                  >
                    Gradient
                  </button>
                </div>
              </div>

              {state.textColorMode === 'solid' ? (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#F8FAFF]">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={state.textColor}
                      onChange={(e) => updateState({ textColor: e.target.value })}
                      className="w-12 h-10 rounded-xl bg-transparent border border-[#263653] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={state.textColor}
                      onChange={(e) => updateState({ textColor: e.target.value })}
                      className="flex-1 p-2 text-xs font-mono rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                    />
                  </div>

                  {/* Quick Color Swatches */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-[#AAB8D0] block mb-2">Popular Swatches</span>
                    <div className="flex flex-wrap gap-2">
                      {['#FFFFFF', '#00F2FE', '#4776FF', '#8957FF', '#FF0055', '#FFDF00', '#38EF7D', '#FF512F'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateState({ textColor: c })}
                          style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${
                            state.textColor.toUpperCase() === c.toUpperCase() ? 'border-white scale-110 shadow-lg' : 'border-black/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-[#F8FAFF] block">Curated Gradient Presets</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {GRADIENT_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() =>
                          updateState({
                            gradientColors: [p.colors[0], p.colors[1]],
                            gradientAngle: p.angle,
                          })
                        }
                        className="p-2.5 rounded-xl border border-[#263653] hover:border-[#4776FF] flex items-center gap-2 text-left bg-[#090F1D] transition-colors"
                      >
                        <span
                          className="w-6 h-6 rounded-lg shrink-0 shadow-sm"
                          style={{
                            background: `linear-gradient(${p.angle}deg, ${p.colors[0]}, ${p.colors[1]})`,
                          }}
                        />
                        <span className="text-[11px] font-semibold text-[#F8FAFF] truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Gradient Stops */}
                  <div className="space-y-3 pt-3 border-t border-[#263653]">
                    <span className="text-xs font-semibold text-[#F8FAFF] block">Custom Gradient Colors</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={state.gradientColors[0]}
                          onChange={(e) =>
                            updateState({
                              gradientColors: [e.target.value, state.gradientColors[1]],
                            })
                          }
                          className="w-10 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                        />
                        <span className="text-xs font-mono text-[#AAB8D0]">{state.gradientColors[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={state.gradientColors[1]}
                          onChange={(e) =>
                            updateState({
                              gradientColors: [state.gradientColors[0], e.target.value],
                            })
                          }
                          className="w-10 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                        />
                        <span className="text-xs font-mono text-[#AAB8D0]">{state.gradientColors[1]}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#F8FAFF]">Angle</span>
                        <span className="font-mono text-[#AAB8D0]">{state.gradientAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={state.gradientAngle}
                        onChange={(e) => updateStateTransient({ gradientAngle: Number(e.target.value) })}
                        onMouseUp={() => updateState({ gradientAngle: state.gradientAngle })}
                        className="w-full accent-[#4776FF]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Effects (Outline, Neon Shadow, 3D) */}
          {activeTab === 'effects' && (
            <div className="p-5 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-6 shadow-xl">
              {/* Section 1: Outline / Stroke */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">Text Outline / Stroke</span>
                  <label className="flex items-center gap-1.5 text-xs text-[#AAB8D0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.outlineEnabled}
                      onChange={(e) => updateState({ outlineEnabled: e.target.checked })}
                      className="rounded bg-[#090F1D] border-[#263653] text-[#4776FF]"
                    />
                    <span>Enable</span>
                  </label>
                </div>

                {state.outlineEnabled && (
                  <div className="space-y-3 pl-3 border-l-2 border-[#4776FF]">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={state.outlineColor}
                        onChange={(e) => updateState({ outlineColor: e.target.value })}
                        className="w-10 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={state.outlineColor}
                        onChange={(e) => updateState({ outlineColor: e.target.value })}
                        className="flex-1 p-2 text-xs font-mono rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#AAB8D0]">Width</span>
                        <span className="font-mono text-[#F8FAFF]">{state.outlineWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={state.outlineWidth}
                        onChange={(e) => updateStateTransient({ outlineWidth: Number(e.target.value) })}
                        onMouseUp={() => updateState({ outlineWidth: state.outlineWidth })}
                        className="w-full accent-[#4776FF]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Shadow / Neon Glow */}
              <div className="space-y-3 pt-3 border-t border-[#263653]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">Shadow & Neon Glow</span>
                  <label className="flex items-center gap-1.5 text-xs text-[#AAB8D0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.shadowEnabled}
                      onChange={(e) => updateState({ shadowEnabled: e.target.checked })}
                      className="rounded bg-[#090F1D] border-[#263653] text-[#4776FF]"
                    />
                    <span>Enable</span>
                  </label>
                </div>

                {state.shadowEnabled && (
                  <div className="space-y-3 pl-3 border-l-2 border-[#4776FF]">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={state.shadowColor.startsWith('#') ? state.shadowColor : '#4776FF'}
                        onChange={(e) => updateState({ shadowColor: e.target.value })}
                        className="w-10 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={state.shadowColor}
                        onChange={(e) => updateState({ shadowColor: e.target.value })}
                        placeholder="#HEX or rgba(...)"
                        className="flex-1 p-2 text-xs font-mono rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#AAB8D0]">Blur Radius / Glow Intensity</span>
                        <span className="font-mono text-[#F8FAFF]">{state.shadowBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={state.shadowBlur}
                        onChange={(e) => updateStateTransient({ shadowBlur: Number(e.target.value) })}
                        onMouseUp={() => updateState({ shadowBlur: state.shadowBlur })}
                        className="w-full accent-[#4776FF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#AAB8D0]">Offset X</span>
                          <span className="font-mono text-[#F8FAFF]">{state.shadowOffsetX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          value={state.shadowOffsetX}
                          onChange={(e) => updateStateTransient({ shadowOffsetX: Number(e.target.value) })}
                          onMouseUp={() => updateState({ shadowOffsetX: state.shadowOffsetX })}
                          className="w-full accent-[#4776FF]"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#AAB8D0]">Offset Y</span>
                          <span className="font-mono text-[#F8FAFF]">{state.shadowOffsetY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          value={state.shadowOffsetY}
                          onChange={(e) => updateStateTransient({ shadowOffsetY: Number(e.target.value) })}
                          onMouseUp={() => updateState({ shadowOffsetY: state.shadowOffsetY })}
                          className="w-full accent-[#4776FF]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: 3D Isometric Extrusion */}
              <div className="space-y-3 pt-3 border-t border-[#263653]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">3D Layer Extrusion</span>
                  <label className="flex items-center gap-1.5 text-xs text-[#AAB8D0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.threeDEnabled}
                      onChange={(e) => updateState({ threeDEnabled: e.target.checked })}
                      className="rounded bg-[#090F1D] border-[#263653] text-[#4776FF]"
                    />
                    <span>Enable</span>
                  </label>
                </div>

                {state.threeDEnabled && (
                  <div className="space-y-3 pl-3 border-l-2 border-[#4776FF]">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] text-[#AAB8D0] block">3D Shadow Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={state.threeDColor}
                            onChange={(e) => updateState({ threeDColor: e.target.value })}
                            className="w-8 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                          />
                          <span className="text-xs font-mono text-[#F8FAFF]">{state.threeDColor}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-[#AAB8D0] block">Direction</span>
                        <select
                          value={state.threeDDirection}
                          onChange={(e) => updateState({ threeDDirection: e.target.value as any })}
                          className="w-full p-2 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                        >
                          <option value="bottom-right">Bottom-Right ↘</option>
                          <option value="bottom-left">Bottom-Left ↙</option>
                          <option value="top-right">Top-Right ↗</option>
                          <option value="top-left">Top-Left ↖</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#AAB8D0]">Depth Extrusion</span>
                        <span className="font-mono text-[#F8FAFF]">{state.threeDDepth} layers</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="24"
                        value={state.threeDDepth}
                        onChange={(e) => updateStateTransient({ threeDDepth: Number(e.target.value) })}
                        onMouseUp={() => updateState({ threeDDepth: state.threeDDepth })}
                        className="w-full accent-[#4776FF]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Canvas Dimensions & Background */}
          {activeTab === 'canvas' && (
            <div className="p-5 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-5 shadow-xl">
              {/* Preset Aspect Ratios */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider block">
                  Canvas Aspect Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CANVAS_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleAspectPresetChange(p.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                        state.aspectPreset === p.id
                          ? 'bg-[#4776FF]/15 border-[#4776FF] text-[#4776FF] font-semibold'
                          : 'bg-[#090F1D] border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF]'
                      }`}
                    >
                      <div className="font-semibold text-[#F8FAFF] truncate">{p.label.split('(')[0]}</div>
                      <div className="text-[10px] text-[#AAB8D0] font-mono">
                        {p.w} × {p.h}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Width & Height */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#263653]">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#F8FAFF]">Width (px)</span>
                  <input
                    type="number"
                    min="200"
                    max="4000"
                    value={state.canvasWidth}
                    onChange={(e) =>
                      updateState({
                        canvasWidth: Number(e.target.value),
                        aspectPreset: 'custom',
                      })
                    }
                    className="w-full p-2 text-xs font-mono rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#F8FAFF]">Height (px)</span>
                  <input
                    type="number"
                    min="200"
                    max="4000"
                    value={state.canvasHeight}
                    onChange={(e) =>
                      updateState({
                        canvasHeight: Number(e.target.value),
                        aspectPreset: 'custom',
                      })
                    }
                    className="w-full p-2 text-xs font-mono rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                  />
                </div>
              </div>

              {/* Background Mode Selector */}
              <div className="space-y-3 pt-2 border-t border-[#263653]">
                <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider block">
                  Background Style
                </span>
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#090F1D] border border-[#263653]">
                  {(['transparent', 'color', 'gradient', 'image'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateState({ bgMode: mode })}
                      className={`py-1.5 text-xs font-bold capitalize rounded-lg transition-colors ${
                        state.bgMode === mode
                          ? 'bg-[#4776FF] text-white shadow'
                          : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {state.bgMode === 'transparent' && (
                  <p className="text-xs text-[#AAB8D0] bg-[#111B30] p-3 rounded-xl border border-[#263653]">
                    ✨ Canvas has an alpha channel. Exported PNGs will be 100% transparent stickers / overlays.
                  </p>
                )}

                {state.bgMode === 'color' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={state.bgColor}
                      onChange={(e) => updateState({ bgColor: e.target.value })}
                      className="w-12 h-10 rounded-xl bg-transparent border border-[#263653] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={state.bgColor}
                      onChange={(e) => updateState({ bgColor: e.target.value })}
                      className="flex-1 p-2 text-xs font-mono rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF]"
                    />
                  </div>
                )}

                {state.bgMode === 'gradient' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={state.bgGradientColors[0]}
                          onChange={(e) =>
                            updateState({
                              bgGradientColors: [e.target.value, state.bgGradientColors[1]],
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                        />
                        <span className="text-xs font-mono text-[#AAB8D0]">{state.bgGradientColors[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={state.bgGradientColors[1]}
                          onChange={(e) =>
                            updateState({
                              bgGradientColors: [state.bgGradientColors[0], e.target.value],
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-transparent border border-[#263653] cursor-pointer"
                        />
                        <span className="text-xs font-mono text-[#AAB8D0]">{state.bgGradientColors[1]}</span>
                      </div>
                    </div>
                  </div>
                )}

                {state.bgMode === 'image' && (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#263653] hover:border-[#4776FF] rounded-2xl cursor-pointer bg-[#090F1D] transition-colors">
                      <Upload className="w-6 h-6 text-[#4776FF] mb-1" />
                      <span className="text-xs font-semibold text-[#F8FAFF]">
                        {state.bgImage ? 'Change Image' : 'Upload Background Image'}
                      </span>
                      <span className="text-[10px] text-[#AAB8D0]">PNG, JPG, WebP supported</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f);
                        }}
                      />
                    </label>

                    {state.bgImage && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#AAB8D0]">Opacity</span>
                            <span className="font-mono text-[#F8FAFF]">{Math.round(state.bgImageOpacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={state.bgImageOpacity}
                            onChange={(e) => updateStateTransient({ bgImageOpacity: Number(e.target.value) })}
                            onMouseUp={() => updateState({ bgImageOpacity: state.bgImageOpacity })}
                            className="w-full accent-[#4776FF]"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#AAB8D0]">Blur Filter</span>
                            <span className="font-mono text-[#F8FAFF]">{state.bgImageBlur}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={state.bgImageBlur}
                            onChange={(e) => updateStateTransient({ bgImageBlur: Number(e.target.value) })}
                            onMouseUp={() => updateState({ bgImageBlur: state.bgImageBlur })}
                            className="w-full accent-[#4776FF]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Design Preview Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-[#F8FAFF] uppercase tracking-wider">
                  Live Design Preview
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#AAB8D0]">
                {state.canvasWidth} × {state.canvasHeight} px · Click & Drag to reposition
              </div>
            </div>

            {/* Canvas Container with Checkerboard Background for Transparency Preview */}
            <div
              ref={containerRef}
              className="relative rounded-xl overflow-hidden border border-[#263653] flex items-center justify-center p-3 select-none"
              style={{
                backgroundImage:
                  state.bgMode === 'transparent'
                    ? 'linear-gradient(45deg, #111B30 25%, transparent 25%), linear-gradient(-45deg, #111B30 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111B30 75%), linear-gradient(-45deg, transparent 75%, #111B30 75%)'
                    : 'none',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                backgroundColor: '#070B14',
              }}
            >
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`max-w-full max-h-[580px] object-contain shadow-2xl rounded-lg touch-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  aspectRatio: `${state.canvasWidth} / ${state.canvasHeight}`,
                }}
              />
            </div>

            {/* Quick Canvas Helper Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#AAB8D0]">
              <div className="flex items-center gap-2">
                <span>Coordinates:</span>
                <span className="font-mono text-[#F8FAFF]">
                  X: {state.posX > 0 ? `+${state.posX}` : state.posX}px, Y: {state.posY > 0 ? `+${state.posY}` : state.posY}px
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateState({ posX: 0 })}
                  className="px-2.5 py-1 rounded bg-[#090F1D] border border-[#263653] text-[11px] hover:text-[#F8FAFF]"
                >
                  Align X-Center
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ posY: 0 })}
                  className="px-2.5 py-1 rounded bg-[#090F1D] border border-[#263653] text-[11px] hover:text-[#F8FAFF]"
                >
                  Align Y-Center
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
)}
</div>
);
};
