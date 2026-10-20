import React, { useState, useMemo, useRef } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Layout,
  Palette,
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  FileCode,
  Globe,
  CheckCircle2,
  Settings2,
  Image as ImageIcon,
  Eye,
  FolderZip,
} from 'lucide-react';

interface WebsiteDesignStudioProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export interface WebsiteTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  sections: { id: string; type: string; title: string; content: string }[];
}

const WEBSITE_CATEGORIES = [
  'Business',
  'Portfolio',
  'E-commerce',
  'SaaS',
  'AI Product',
  'Agency',
  'Education',
  'University',
  'Blog & Magazine',
  'Restaurant',
  'Travel',
  'Real Estate',
  'Healthcare',
  'Fitness',
  'Gaming',
  'Anime',
  'Photography',
  'Personal Branding',
  'Event & Wedding',
  'Nonprofit',
];

const TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'biz-nexus',
    title: 'Nexus Enterprise',
    category: 'Business',
    description: 'Modern corporate business template with high conversion layout.',
    heroTitle: 'Scale Your Business With Intelligent Automation',
    heroSubtitle: 'Empower your global teams with secure, enterprise-grade cloud solutions.',
    primaryColor: '#4776FF',
    secondaryColor: '#8957FF',
    backgroundColor: '#070B14',
    fontFamily: 'Montserrat, sans-serif',
    sections: [
      { id: 's1', type: 'hero', title: 'Enterprise Hero', content: 'Transform your digital workflows.' },
      { id: 's2', type: 'features', title: 'Core Capabilities', content: 'Analytics, Security, Scale.' },
      { id: 's3', type: 'pricing', title: 'Enterprise Pricing', content: 'Starter, Pro, Elite tiers.' },
      { id: 's4', type: 'cta', title: 'Get Started', content: 'Schedule a discovery call.' },
    ],
  },
  {
    id: 'saas-cloudpulse',
    title: 'CloudPulse AI',
    category: 'SaaS',
    description: 'Sleek SaaS landing page with dark futuristic aesthetic.',
    heroTitle: 'Next-Gen AI Analytics For Modern Teams',
    heroSubtitle: 'Real-time telemetry and predictive insights powered by neural models.',
    primaryColor: '#00F2FE',
    secondaryColor: '#4FACFE',
    backgroundColor: '#050B14',
    fontFamily: 'Inter, sans-serif',
    sections: [
      { id: 's1', type: 'hero', title: 'AI SaaS Hero', content: 'Predictive analytics in real time.' },
      { id: 's2', type: 'features', title: 'Neural Features', content: 'Automated telemetry & insights.' },
      { id: 's3', type: 'testimonials', title: 'Customer Stories', content: 'Trusted by 10,000+ engineers.' },
    ],
  },
  {
    id: 'port-alex',
    title: 'Alex Vance Portfolio',
    category: 'Portfolio',
    description: 'Minimalist creative portfolio for designers and developers.',
    heroTitle: 'Designing Digital Experiences That Inspire',
    heroSubtitle: 'Senior Product Designer crafting intuitive interfaces and immersive web apps.',
    primaryColor: '#FF5722',
    secondaryColor: '#FF9800',
    backgroundColor: '#0D0D0D',
    fontFamily: '"Playfair Display", serif',
    sections: [
      { id: 's1', type: 'hero', title: 'Creative Intro', content: 'Crafting digital experiences.' },
      { id: 's2', type: 'gallery', title: 'Selected Works', content: 'Case studies & live apps.' },
      { id: 's3', type: 'contact', title: 'Let’s Connect', content: 'Available for freelance & advisory.' },
    ],
  },
  {
    id: 'ecom-velour',
    title: 'Velour Boutique',
    category: 'E-commerce',
    description: 'High-end luxury fashion store front template.',
    heroTitle: 'Timeless Elegance For The Modern Wardrobe',
    heroSubtitle: 'Discover our autumn/winter collection crafted with sustainable fabrics.',
    primaryColor: '#D4AF37',
    secondaryColor: '#FFF8DC',
    backgroundColor: '#0F0F0F',
    fontFamily: 'Cinzel, serif',
    sections: [
      { id: 's1', type: 'hero', title: 'Luxury Banner', content: 'Autumn / Winter Collection 2026.' },
      { id: 's2', type: 'products', title: 'Featured Products', content: 'Curated apparel & accessories.' },
      { id: 's3', type: 'newsletter', title: 'Join The Club', content: 'Receive 15% off your first order.' },
    ],
  },
  {
    id: 'rest-gourmet',
    title: 'Le Gourmet Bistro',
    category: 'Restaurant',
    description: 'Warm and sophisticated fine dining website.',
    heroTitle: 'Culinary Artistry Crafted With Passion',
    heroSubtitle: 'Experience Michelin-starred gastronomy in an intimate downtown setting.',
    primaryColor: '#E0A96D',
    secondaryColor: '#F4E1D2',
    backgroundColor: '#12100E',
    fontFamily: '"Playfair Display", serif',
    sections: [
      { id: 's1', type: 'hero', title: 'Restaurant Hero', content: 'Reserve your dining experience.' },
      { id: 's2', type: 'menu', title: 'Tasting Menu', content: 'Seasonal courses & wine pairings.' },
      { id: 's3', type: 'reservation', title: 'Book A Table', content: 'Instant online table reservations.' },
    ],
  },
  {
    id: 'game-nexus',
    title: 'CyberStorm Gaming',
    category: 'Gaming',
    description: 'Immersive esports and gaming community portal.',
    heroTitle: 'Unleash Your Ultimate Gaming Potential',
    heroSubtitle: 'Join elite tournaments, competitive leagues, and global esports squads.',
    primaryColor: '#FF0055',
    secondaryColor: '#00F0FF',
    backgroundColor: '#040711',
    fontFamily: 'Orbitron, sans-serif',
    sections: [
      { id: 's1', type: 'hero', title: 'Esports Hero', content: 'Compete. Win. Dominate.' },
      { id: 's2', type: 'tournaments', title: 'Active Tournaments', content: '$50,000 prize pool championship.' },
      { id: 's3', type: 'roster', title: 'Pro Teams', content: 'Meet our global championship rosters.' },
    ],
  },
  {
    id: 'edu-academy',
    title: 'Nova Academy',
    category: 'Education',
    description: 'Interactive online learning and bootcamp platform.',
    heroTitle: 'Master In-Demand Tech Skills For The Future',
    heroSubtitle: 'Expert-led bootcamps in AI engineering, full-stack development, and UX design.',
    primaryColor: '#10B981',
    secondaryColor: '#3B82F6',
    backgroundColor: '#070B14',
    fontFamily: 'Poppins, sans-serif',
    sections: [
      { id: 's1', type: 'hero', title: 'Academy Hero', content: 'Learn from industry veterans.' },
      { id: 's2', type: 'courses', title: 'Popular Bootcamps', content: 'AI, React, Cloud Architecture.' },
      { id: 's3', type: 'faq', title: 'Frequently Asked Questions', content: 'Tuition, schedules, and career placement.' },
    ],
  },
  {
    id: 'ai-synthetix',
    title: 'Synthetix AI Studio',
    category: 'AI Product',
    description: 'Generative AI product landing page and studio portal.',
    heroTitle: 'Generate Production-Ready Code & Media Instantly',
    heroSubtitle: 'The all-in-one generative intelligence workspace for creators and enterprises.',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    backgroundColor: '#0A0612',
    fontFamily: 'Inter, sans-serif',
    sections: [
      { id: 's1', type: 'hero', title: 'AI Studio Hero', content: 'Supercharge your creative output.' },
      { id: 's2', type: 'playground', title: 'Live AI Playground', content: 'Test text, image, and code models.' },
      { id: 's3', type: 'pricing', title: 'Flexible Plans', content: 'Free tier and enterprise tokens.' },
    ],
  },
];

// Generate additional mock templates to ensure 100+ templates across categories
const FULL_TEMPLATES: WebsiteTemplate[] = (() => {
  const list = [...TEMPLATES];
  let counter = list.length + 1;
  WEBSITE_CATEGORIES.forEach((cat) => {
    for (let i = 1; i <= 5; i++) {
      if (list.some((t) => t.category === cat && t.title.includes(`${i}`))) continue;
      list.push({
        id: `${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`,
        title: `${cat} Studio ${i}`,
        category: cat,
        description: `Professional ${cat.toLowerCase()} template edition ${i} with responsive layout and clean typography.`,
        heroTitle: `Build Your Dream ${cat} Experience Today`,
        heroSubtitle: `Optimized conversion flow and stunning aesthetics designed for modern audiences.`,
        primaryColor: i % 2 === 0 ? '#4776FF' : '#10B981',
        secondaryColor: '#8957FF',
        backgroundColor: '#070B14',
        fontFamily: 'Montserrat, sans-serif',
        sections: [
          { id: 's1', type: 'hero', title: `${cat} Hero`, content: 'Welcome to our platform.' },
          { id: 's2', type: 'features', title: 'Key Features', content: 'Performance, Security, Design.' },
          { id: 's3', type: 'cta', title: 'Get Started', content: 'Join thousands of satisfied users.' },
        ],
      });
      counter++;
    }
  });
  return list;
})();

export const WebsiteDesignStudio: React.FC<WebsiteDesignStudioProps> = ({ onShowToast }) => {
  const [mode, setMode] = useState<'design' | 'code'>('design');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate>(FULL_TEMPLATES[0]);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [codeLanguage, setCodeLanguage] = useState<'html-css' | 'react' | 'tailwind' | 'svg'>('html-css');
  const [copied, setCopied] = useState(false);

  // Editable website state
  const [siteState, setSiteState] = useState({
    siteName: selectedTemplate.title,
    heroTitle: selectedTemplate.heroTitle,
    heroSubtitle: selectedTemplate.heroSubtitle,
    primaryColor: selectedTemplate.primaryColor,
    backgroundColor: selectedTemplate.backgroundColor,
    fontFamily: selectedTemplate.fontFamily,
    sections: [...selectedTemplate.sections],
  });

  const handleSelectTemplate = (tmpl: WebsiteTemplate) => {
    setSelectedTemplate(tmpl);
    setSiteState({
      siteName: tmpl.title,
      heroTitle: tmpl.heroTitle,
      heroSubtitle: tmpl.heroSubtitle,
      primaryColor: tmpl.primaryColor,
      backgroundColor: tmpl.backgroundColor,
      fontFamily: tmpl.fontFamily,
      sections: [...tmpl.sections],
    });
    onShowToast(`Loaded template: ${tmpl.title}`, 'success');
  };

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return FULL_TEMPLATES;
    return FULL_TEMPLATES.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddSection = (type: string) => {
    const newSec = {
      id: `sec-${Date.now()}`,
      type,
      title: `${type.toUpperCase()} Section`,
      content: 'Customizable section block added from library.',
    };
    setSiteState((prev) => ({ ...prev, sections: [...prev.sections, newSec] }));
    onShowToast('Added new section block!', 'success');
  };

  const handleDeleteSection = (id: string) => {
    setSiteState((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
    onShowToast('Section removed.', 'success');
  };

  // Generated Code based on siteState and codeLanguage
  const generatedCode = useMemo(() => {
    if (codeLanguage === 'html-css') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteState.siteName}</title>
  <link href="https://fonts.googleapis.com/css2?family=${siteState.fontFamily.replace(/,.*/, '')}&display=swap" rel="stylesheet">
  <style>
    body { background: ${siteState.backgroundColor}; color: #F8FAFF; font-family: ${siteState.fontFamily}; margin: 0; padding: 0; }
    header { padding: 24px 48px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { font-weight: 800; font-size: 20px; color: ${siteState.primaryColor}; }
    .hero { padding: 120px 24px; text-align: center; max-width: 900px; margin: 0 auto; }
    h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 900; line-height: 1.1; margin-bottom: 24px; }
    p { font-size: 18px; color: #AAB8D0; margin-bottom: 36px; line-height: 1.6; }
    .btn { background: ${siteState.primaryColor}; color: #FFFFFF; padding: 14px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 10px 25px rgba(71,118,255,0.3); }
    .sections { padding: 64px 24px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px; }
  </style>
</head>
<body>
  <header>
    <div class="logo">${siteState.siteName}</div>
    <nav><a href="#features" style="color: #AAB8D0; text-decoration: none; font-weight: 600;">Features</a></nav>
  </header>
  <main>
    <section class="hero">
      <h1>${siteState.heroTitle}</h1>
      <p>${siteState.heroSubtitle}</p>
      <a href="#cta" class="btn">Get Started Now</a>
    </section>
    <div class="sections">
      ${siteState.sections
        .map(
          (s) => `
      <div class="card">
        <h3>${s.title}</h3>
        <p>${s.content}</p>
      </div>`
        )
        .join('')}
    </div>
  </main>
</body>
</html>`;
    }

    if (codeLanguage === 'react') {
      return `import React from 'react';

export default function ${siteState.siteName.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <div className="min-h-screen bg-[${siteState.backgroundColor}] text-[#F8FAFF] font-sans">
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/10">
        <div className="text-xl font-extrabold text-[${siteState.primaryColor}]">${siteState.siteName}</div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-24 text-center space-y-8">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight">${siteState.heroTitle}</h1>
        <p className="text-lg text-[#AAB8D0] max-w-2xl mx-auto">${siteState.heroSubtitle}</p>
        <button className="px-8 py-4 bg-[${siteState.primaryColor}] text-white font-bold rounded-2xl shadow-xl">
          Get Started
        </button>
      </main>
    </div>
  );
}`;
    }

    return `<!-- Tailwind CSS / SVG Output for ${siteState.siteName} -->\n<div className="bg-[${siteState.backgroundColor}] text-white p-12 rounded-3xl">\n  <h1 className="text-4xl font-extrabold">${siteState.heroTitle}</h1>\n  <p className="text-slate-400 mt-4">${siteState.heroSubtitle}</p>\n</div>`;
  }, [siteState, codeLanguage]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      onShowToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Failed to copy code.', 'error');
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${siteState.siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${codeLanguage === 'react' ? 'tsx' : 'html'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Source code downloaded successfully!', 'success');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header & Mode Switcher */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#4776FF]/20 text-[#4776FF] border border-[#4776FF]/30">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#F8FAFF]">Website Design Studio</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              100+ Templates
            </span>
          </div>
          <p className="text-xs text-[#AAB8D0] mt-1">
            Build professional websites, customize layouts visually, and export production-ready HTML, CSS, and React code.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#090F1D] p-1.5 rounded-2xl border border-[#263653]">
          <button
            type="button"
            onClick={() => setMode('design')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'design'
                ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-lg'
                : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Design Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'code'
                ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-lg'
                : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code Mode</span>
          </button>
        </div>
      </div>

      {mode === 'design' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Templates & Library */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFF]">Website Templates</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#111B30] text-[#4776FF]">100+ Available</span>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'All' ? 'bg-[#4776FF] text-white' : 'bg-[#111B30] text-[#AAB8D0] hover:text-[#F8FAFF]'
                  }`}
                >
                  All ({FULL_TEMPLATES.length})
                </button>
                {WEBSITE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                      selectedCategory === cat ? 'bg-[#4776FF] text-white' : 'bg-[#111B30] text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredTemplates.slice(0, 15).map((tmpl) => {
                  const isSelected = selectedTemplate.id === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#4776FF]/20 border-[#4776FF] text-[#F8FAFF]'
                          : 'bg-[#111B30] border-[#263653] text-[#AAB8D0] hover:border-[#4776FF]/50 hover:text-[#F8FAFF]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{tmpl.title}</div>
                        <div className="text-[10px] text-[#AAB8D0]">{tmpl.category}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#4776FF]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Component Library */}
            <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-3 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFF]">Add Section Blocks</h3>
              <div className="grid grid-cols-2 gap-2">
                {['hero', 'features', 'pricing', 'testimonials', 'cta', 'gallery', 'faq', 'contact'].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleAddSection(sec)}
                    className="p-2 text-xs font-semibold bg-[#111B30] hover:bg-[#1B2945] border border-[#263653] text-[#F8FAFF] rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#4776FF]" />
                    <span className="capitalize">{sec}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Preview & Visual Editor Area */}
          <div className="lg:col-span-6 space-y-4">
            {/* Toolbar */}
            <div className="p-3 rounded-2xl bg-[#0D1426] border border-[#263653] flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`p-2 rounded-xl transition-colors ${deviceView === 'desktop' ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('tablet')}
                  className={`p-2 rounded-xl transition-colors ${deviceView === 'tablet' ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'}`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`p-2 rounded-xl transition-colors ${deviceView === 'mobile' ? 'bg-[#4776FF] text-white' : 'text-[#AAB8D0] hover:text-[#F8FAFF]'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('code')}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] rounded-xl hover:opacity-90 shadow-md flex items-center gap-1.5"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Generate Code</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Preview Canvas */}
            <div
              className={`mx-auto bg-[#050B14] rounded-2xl border border-[#263653] shadow-2xl overflow-hidden transition-all duration-300 ${
                deviceView === 'desktop' ? 'w-full' : deviceView === 'tablet' ? 'max-w-2xl' : 'max-w-sm'
              }`}
              style={{ minHeight: '600px', backgroundColor: siteState.backgroundColor }}
            >
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="font-extrabold text-sm" style={{ color: siteState.primaryColor }}>
                  {siteState.siteName}
                </div>
                <div className="text-xs text-[#AAB8D0] hidden sm:block">Live Preview</div>
              </div>

              {/* Preview Hero */}
              <div className="px-6 py-16 text-center space-y-6">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">{siteState.heroTitle}</h1>
                <p className="text-sm sm:text-base text-[#AAB8D0] max-w-xl mx-auto">{siteState.heroSubtitle}</p>
                <div>
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: siteState.primaryColor }}
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* Preview Sections */}
              <div className="p-6 space-y-4 max-w-3xl mx-auto pb-16">
                {siteState.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#4776FF]">Section {idx + 1}: {sec.type}</div>
                      <h4 className="font-bold text-sm text-[#F8FAFF] mt-1">{sec.title}</h4>
                      <p className="text-xs text-[#AAB8D0] mt-0.5">{sec.content}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Customization Controls */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFF]">Website Customization</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#AAB8D0] mb-1">Site Title / Logo</label>
                  <input
                    type="text"
                    value={siteState.siteName}
                    onChange={(e) => setSiteState({ ...siteState, siteName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090F1D] border border-[#263653] rounded-xl text-xs text-[#F8FAFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#AAB8D0] mb-1">Hero Heading</label>
                  <textarea
                    rows={2}
                    value={siteState.heroTitle}
                    onChange={(e) => setSiteState({ ...siteState, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090F1D] border border-[#263653] rounded-xl text-xs text-[#F8FAFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#AAB8D0] mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={siteState.heroSubtitle}
                    onChange={(e) => setSiteState({ ...siteState, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090F1D] border border-[#263653] rounded-xl text-xs text-[#F8FAFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#AAB8D0] mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteState.primaryColor}
                      onChange={(e) => setSiteState({ ...siteState, primaryColor: e.target.value })}
                      className="w-10 h-8 rounded bg-[#090F1D] border border-[#263653] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={siteState.primaryColor}
                      onChange={(e) => setSiteState({ ...siteState, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[#090F1D] border border-[#263653] rounded-xl text-xs text-[#F8FAFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#AAB8D0] mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteState.backgroundColor}
                      onChange={(e) => setSiteState({ ...siteState, backgroundColor: e.target.value })}
                      className="w-10 h-8 rounded bg-[#090F1D] border border-[#263653] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={siteState.backgroundColor}
                      onChange={(e) => setSiteState({ ...siteState, backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-[#090F1D] border border-[#263653] rounded-xl text-xs text-[#F8FAFF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Code Mode View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] space-y-3 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFF]">Code Formats</h3>
              <div className="space-y-1">
                {[
                  { id: 'html-css', name: 'HTML + CSS Standalone' },
                  { id: 'react', name: 'React Component (JSX/TSX)' },
                  { id: 'tailwind', name: 'Tailwind CSS snippet' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setCodeLanguage(fmt.id as any)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      codeLanguage === fmt.id ? 'bg-[#4776FF] text-white' : 'bg-[#111B30] text-[#AAB8D0] hover:text-[#F8FAFF]'
                    }`}
                  >
                    <span>{fmt.name}</span>
                    <FileCode className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#263653] space-y-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full px-4 py-2.5 bg-[#111B30] hover:bg-[#1B2945] border border-[#263653] text-[#F8FAFF] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCode}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Source File</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="p-5 rounded-2xl bg-[#090F1D] border border-[#263653] shadow-2xl space-y-3 font-mono text-xs text-[#AAB8D0]">
              <div className="flex items-center justify-between pb-3 border-b border-[#263653]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[#F8FAFF] font-bold ml-2">
                    {siteState.siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.
                    {codeLanguage === 'react' ? 'tsx' : 'html'}
                  </span>
                </div>
                <div className="text-[10px] text-[#4776FF] uppercase font-bold tracking-wider">{codeLanguage} Mode</div>
              </div>
              <pre className="overflow-x-auto p-4 bg-[#050B14] rounded-xl border border-[#263653] max-h-[600px] text-emerald-400 leading-relaxed">
                {generatedCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
