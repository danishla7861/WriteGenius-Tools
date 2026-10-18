import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  PenTool,
  FileText,
  Image as ImageIcon,
  GraduationCap,
  Share2,
  Check,
  Cpu,
  Layers,
  Compass,
  Flame,
} from 'lucide-react';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../data/toolsData';
import { ToolCard } from '../components/tools/ToolCard';
import { RecentToolsSection } from '../components/home/RecentToolsSection';
import { updateDocumentSeo } from '../utils/seoUtils';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    updateDocumentSeo({
      title: 'WriteGenius Tools – 60 Free Online AI Writing, PDF, Image & Student Tools',
      description: 'Access 60 free online tools: AI paragraph writers, essay outlines, in-browser PDF mergers, image compressors, GPA calculators, and social media tools.',
      canonicalPath: '/',
      keywords: [
        'free online tools',
        'AI writing toolkit',
        'merge PDF online free',
        'compress image online',
        'GPA calculator college',
        'free grammar checker',
        'social media caption generator',
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'WriteGenius Tools',
        url: 'https://writegenius.tools/',
        description: 'Comprehensive platform of 60 free online tools: AI Writing Toolkit, PDF Tools, Image Tools, AI Social Media Toolkit, and Student Utilities.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://writegenius.tools/tools?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularTools = ALL_TOOLS.filter(t =>
    [
      'ai-image-generator',
      'merge-pdf',
      'image-compressor',
      'ai-essay-writer',
      'gpa-calculator',
      'word-counter',
      'split-pdf',
      'crop-image',
      'ai-paragraph-writer',
    ].includes(t.slug)
  );

  return (
    <div className="space-y-16 pb-24 bg-[#050811] text-[#F8FAFF]">
      {/* ---------------------------------------------------------------- */}
      {/* Modern High-End Neon AI Studio Hero */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Abstract Gradient Mesh Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#4776FF]/25 to-[#8957FF]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#4776FF]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-8 relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#0D1426] border border-[#233554] text-xs font-semibold text-[#AAB8D0] shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#4776FF] animate-pulse" />
            <span className="text-[#F8FAFF]">WriteGenius Studio v2.5</span>
            <span className="text-[#233554]">|</span>
            <span className="text-[#4776FF] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 60 Professional Tools
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F8FAFF] tracking-tight leading-[1.08] text-balance">
            Supercharge Your Workflow With <br />
            <span className="bg-gradient-to-r from-[#4776FF] via-[#7095FF] to-[#8957FF] bg-clip-text text-transparent">
              Next-Gen AI & Utility Tools
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#AAB8D0] max-w-2xl mx-auto leading-relaxed text-balance">
            Instant client-side PDF editing, image optimization, academic calculators, and state-of-the-art Gemini AI writing assistants in one unified command center.
          </p>

          {/* Massive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl mx-auto flex items-center shadow-2xl rounded-2xl overflow-hidden border border-[#233554] bg-[#0D1426]/90 backdrop-blur-xl p-1.5 focus-within:border-[#4776FF] transition-all"
          >
            <div className="pl-4 text-[#AAB8D0]">
              <Search className="w-5 h-5 text-[#4776FF]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search any of the 60 tools (e.g. Merge PDF, AI Essay Writer, GPA)..."
              className="w-full py-3 pl-3 pr-32 text-sm bg-transparent text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-95 rounded-xl transition-all shadow-lg flex items-center gap-1.5 shrink-0"
            >
              <span>Search Tool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {TOOL_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="px-4 py-2 rounded-xl bg-[#0D1426] hover:bg-[#131E38] border border-[#233554] text-xs font-semibold text-[#F8FAFF] hover:text-[#4776FF] transition-all shadow-md flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-[#4776FF] group-hover:scale-125 transition-transform" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* User's Recent Tools (Tracked via localStorage) */}
      {/* ---------------------------------------------------------------- */}
      <RecentToolsSection />

      {/* ---------------------------------------------------------------- */}
      {/* Five Core Categories Showcase Grid with Rich Previews */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4776FF] uppercase tracking-wider font-mono">
              <Compass className="w-3.5 h-3.5" /> Curated Suites
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFF]">
              Explore Tool Categories
            </h2>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-[#4776FF] hover:text-blue-400 flex items-center gap-1.5"
          >
            <span>View All 60 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOL_CATEGORIES.map(cat => {
            const count = ALL_TOOLS.filter(t => t.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group bg-[#0D1426] border border-[#233554] hover:border-[#4776FF] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {cat.imageUrl && (
                  <div className="h-52 w-full overflow-hidden relative">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1426] via-[#0D1426]/40 to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#050811]/80 backdrop-blur-md border border-[#233554] text-[10px] font-mono font-bold text-[#4776FF]">
                      {count} Tools
                    </div>
                  </div>
                )}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#AAB8D0] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4776FF] pt-2">
                    <span>Explore Suite</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Popular Utilities & Tool Cards Grid */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8957FF] uppercase tracking-wider font-mono">
              <Flame className="w-3.5 h-3.5" /> Trending
            </div>
            <h2 className="text-2xl font-bold text-[#F8FAFF]">Most Popular Tools</h2>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-[#4776FF] hover:text-blue-400 flex items-center gap-1.5"
          >
            <span>Browse All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.slice(0, 6).map(tool => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why Choose WriteGenius Tools? */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#0D1426] via-[#131E38] to-[#0D1426] border border-[#233554] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFF]">Why Choose WriteGenius Studio?</h2>
            <p className="text-xs sm:text-sm text-[#AAB8D0]">Engineered for uncompromising speed, security, and absolute privacy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-[#050811] border border-[#233554]">
              <div className="w-10 h-10 rounded-xl bg-[#0D1426] border border-[#233554] flex items-center justify-center text-[#4776FF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFF]">100% Client-Side Privacy</h3>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                PDF merging, image compression, and academic calculations execute entirely inside your browser memory via WebAssembly. Your documents never touch a cloud server.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#050811] border border-[#233554]">
              <div className="w-10 h-10 rounded-xl bg-[#0D1426] border border-[#233554] flex items-center justify-center text-[#8957FF]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFF]">Advanced Gemini AI</h3>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                Powered by state-of-the-art Google Gemini models for essays, social media posts, email composition, and text summarization.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#050811] border border-[#263653]">
              <div className="w-10 h-10 rounded-xl bg-[#0D1426] border border-[#233554] flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFF]">Lightning Fast & Free</h3>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                No software downloads, no forced subscriptions, and no paywalls for core utility tools. Ready instantly on desktop, tablet, and mobile.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
