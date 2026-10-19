import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Type,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Home,
  CheckCircle2,
  HelpCircle,
  FileText,
  UserCheck,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Layers,
  Palette,
  Download,
  Copy,
  Zap,
} from 'lucide-react';
import { TextDesignEditor } from '../components/tools/TextDesignEditor';
import { updateDocumentSeo } from '../utils/seoUtils';
import { TOOL_MAP, ALL_TOOLS } from '../data/toolsData';
import { getToolSeoData } from '../data/toolSeoContent';
import { addRecentTool } from '../utils/recentToolsUtils';
import { SEOHead } from '../components/common/SEOHead';

interface TextDesignToolPageProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const TextDesignToolPage: React.FC<TextDesignToolPageProps> = ({ onShowToast }) => {
  const tool = TOOL_MAP['text-design-tool'] || {
    slug: 'text-design-tool',
    title: 'Text Design Tool',
    category: 'text-design',
    toolType: 'text-design',
    shortDescription: 'Design stunning text graphics, 3D typography, neon glow titles, and social media banners.',
    fullDescription: 'Professional text design and typography editor with live preview. Customize fonts, gradients, neon glows, 3D extrusion shadows, background images, and export crisp PNG, JPG, or SVG graphics.',
    icon: 'Type',
    isAi: false,
    isFreeClientSide: true,
    badge: 'Pro Editor',
    examples: [],
    instructions: [],
    faqs: [],
    relatedSlugs: ['add-text-to-image', 'online-text-editor', 'image-resizer', 'ai-image-generator'],
  };

  const seoData = getToolSeoData(tool);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    addRecentTool('text-design-tool');

    // Update document title, meta tags, and structured data schemas
    updateDocumentSeo({
      title: 'Text Design Tool – Free Online Typography & 3D Text Graphics Editor',
      description:
        'Design stunning text graphics, 3D typography, neon glows, gradient titles, and social media banners online for free. Export transparent PNG, JPG, or SVG instantly.',
      canonicalUrl: 'https://writegenius.tools/text-design-tool',
      keywords: [
        'text design tool online',
        'free text graphics maker',
        'online typography designer',
        '3D text generator',
        'neon text editor',
        'gradient text maker',
        'YouTube thumbnail text creator',
        'transparent PNG text maker',
      ],
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'WriteGenius Text Design Tool',
          url: 'https://writegenius.tools/text-design-tool',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'All',
          description:
            'Online text design editor for creating 3D typography, neon text, gradient titles, and social media post graphics with transparent PNG and vector SVG export.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://writegenius.tools/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Text Design Tools',
              item: 'https://writegenius.tools/category/text-design',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Text Design Tool',
              item: 'https://writegenius.tools/text-design-tool',
            },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: seoData.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    });
  }, []);

  const relatedTools = [
    TOOL_MAP['add-text-to-image'],
    TOOL_MAP['online-text-editor'],
    TOOL_MAP['ai-image-generator'],
    TOOL_MAP['image-resizer'],
  ].filter(Boolean);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <SEOHead
        title="Text Design Tool – Free Online Typography & 3D Text Graphics Editor"
        description="Design stunning text graphics, 3D typography, neon glows, gradient titles, and social media banners online for free. Export transparent PNG, JPG, or SVG instantly."
        canonicalPath="/text-design-tool"
        keywords={[
          'text design tool online',
          'free text graphics maker',
          'online typography designer',
          '3D text generator',
          'neon text editor',
          'gradient text maker',
          'YouTube thumbnail text creator',
          'transparent PNG text maker',
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Text Design Tools', url: '/category/text-design' },
          { name: 'Text Design Tool', url: '/text-design-tool' },
        ]}
        faqs={seoData.faqs}
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'WriteGenius Text Design Tool',
            url: 'https://writegenius.tools/text-design-tool',
            applicationCategory: 'DesignApplication',
            operatingSystem: 'All',
            description:
              'Online text design editor for creating 3D typography, neon text, gradient titles, and social media post graphics with transparent PNG and vector SVG export.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        ]}
      />
      {/* 1. Header & Breadcrumbs Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-2xl space-y-5 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#4776FF]/15 via-[#8957FF]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0] flex-wrap">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to="/category/text-design" className="hover:text-[#F8FAFF] transition-colors">
            Text Design Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            Text Design Tool
          </span>
        </nav>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="px-3 py-1 rounded-full bg-[#111A2E] border border-[#263653] text-[#4776FF] font-semibold flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side Privacy</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#4776FF]/20 text-[#4776FF] border border-[#4776FF]/40 font-bold">
            Visual Design Mode
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
            <span>Code Generator</span>
            <span className="text-[10px] text-emerald-400 font-mono">(HTML·CSS·JSX·Tailwind·SVG·JS)</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#8957FF]/20 text-[#8957FF] border border-[#8957FF]/40 font-bold">
            12 Designer Templates
          </span>
          <span className="px-3 py-1 rounded-full bg-[#090F1D] text-[#AAB8D0] border border-[#263653]">
            100% Free & Client-Side
          </span>
        </div>

        {/* H1 Heading & Description */}
        <div className="space-y-2 max-w-4xl relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFF] tracking-tight">
            Text Design Tool –{' '}
            <span className="bg-gradient-to-r from-[#4776FF] via-[#7095FF] to-[#8957FF] bg-clip-text text-transparent">
              Visual Typography & Code Generator
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] leading-relaxed">
            Create high-impact typography, glowing neon titles, 3D extruded lettering, YouTube thumbnail headlines, and aesthetic quote cards with real-time live preview. Switch instantly to Code Mode to generate production-ready HTML, CSS, React JSX, Tailwind CSS, SVG, or JavaScript code. Export transparent PNGs, JPGs, or vector SVGs with zero watermark.
          </p>
        </div>
      </section>

      {/* 2. Interactive Text Design Editor */}
      <section className="space-y-4">
        <TextDesignEditor onShowToast={onShowToast} initialTemplate="modern" />
      </section>

      {/* 3. Deep SEO & Educational Content Section */}
      <div className="space-y-8 pt-8 border-t border-[#263653]/80">
        {/* Section A: What is the Text Design Tool */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#4776FF] uppercase tracking-wider font-mono">
            <BookOpen className="w-4 h-4" /> Comprehensive Overview
          </div>
          <h2 className="text-2xl font-extrabold text-[#F8FAFF]">
            What is the WriteGenius Text Design Tool?
          </h2>
          <div className="space-y-3 text-sm text-[#AAB8D0] leading-relaxed">
            {seoData.whatIs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Section B: Core Capabilities & Feature Highlights */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8957FF] uppercase tracking-wider font-mono">
              <Zap className="w-4 h-4" /> Studio Features
            </div>
            <h2 className="text-2xl font-extrabold text-[#F8FAFF]">
              Professional Design Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoData.capabilities.map((cap, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-[#4776FF]/15 text-[#4776FF] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-[#F8FAFF] leading-relaxed">{cap}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section C: Step-by-Step How to Use Guide */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              <FileText className="w-4 h-4" /> User Guide
            </div>
            <h2 className="text-2xl font-extrabold text-[#F8FAFF]">
              How to Create Text Graphics in 5 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {seoData.stepByStep.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#090F1D] border border-[#263653] space-y-2 relative"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-bold text-[#F8FAFF]">{s.step}</h3>
                <p className="text-xs text-[#AAB8D0] leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section D: Real-World Use Cases */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              <UserCheck className="w-4 h-4" /> Practical Applications
            </div>
            <h2 className="text-2xl font-extrabold text-[#F8FAFF]">
              Real-World Use Cases & Scenarios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoData.realUseCases.map((useCase, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#090F1D] border border-[#263653] space-y-2.5"
              >
                <h3 className="text-sm font-bold text-[#F8FAFF] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4776FF]" />
                  <span>{useCase.title}</span>
                </h3>
                <div className="text-xs text-[#AAB8D0] space-y-1 leading-relaxed">
                  <p>
                    <strong className="text-[#F8FAFF]">Scenario:</strong> {useCase.scenario}
                  </p>
                  <p>
                    <strong className="text-emerald-400">Result:</strong> {useCase.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section E: Supported Formats & Privacy Assurance */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFF] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#4776FF]" />
              <span>Supported Export Formats & Resolution</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#AAB8D0]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>PNG:</strong> Lossless 32-bit with full alpha transparency support.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>JPG:</strong> Web-optimized 95% quality JPEG compression.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>SVG:</strong> Vector format with embedded fonts & linear gradients.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>Resolution:</strong> 1x (Standard), 2x (Retina/4K), and 3x (Print Ultra-HD).</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFF] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Privacy Guarantee</span>
            </h3>
            <p className="text-xs text-[#AAB8D0] leading-relaxed">
              Every graphic is processed and synthesized entirely in your local browser memory via HTML5 Canvas. Your text, uploaded images, and design creations are never uploaded to any cloud server or database.
            </p>
            <div className="p-3 rounded-xl bg-[#090F1D] border border-[#263653] text-[11px] text-emerald-400 font-mono">
              ✓ Zero Server Uploads · Offline Compatible · Commercial Use Allowed
            </div>
          </div>
        </section>

        {/* Section F: Comprehensive FAQs Accordion */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0D1426] border border-[#263653] shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4776FF] uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-extrabold text-[#F8FAFF]">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {seoData.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#090F1D] border border-[#263653] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#F8FAFF] hover:text-[#4776FF] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#AAB8D0] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#4776FF]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#AAB8D0] leading-relaxed border-t border-[#263653]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section G: Internal Related Tools Navigation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F8FAFF]">Related Creative & Utility Tools</h3>
            <Link
              to="/tools"
              className="text-xs font-semibold text-[#4776FF] hover:text-blue-400 flex items-center gap-1"
            >
              <span>Explore All 60 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((t) => (
              <Link
                key={t.slug}
                to={`/tools/${t.slug}`}
                className="p-4 rounded-2xl bg-[#0D1426] border border-[#263653] hover:border-[#4776FF] transition-all hover:-translate-y-0.5 space-y-2 group shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-[#111B30] border border-[#263653] flex items-center justify-center text-[#4776FF] group-hover:scale-110 transition-transform">
                  <Type className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors">
                  {t.title}
                </h4>
                <p className="text-[11px] text-[#AAB8D0] line-clamp-2 leading-relaxed">
                  {t.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
