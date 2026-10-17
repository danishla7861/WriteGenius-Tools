import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  HelpCircle,
  PenTool,
  Layers,
  Image as ImageIcon,
  GraduationCap,
  Share2,
  Check,
  Cpu,
} from 'lucide-react';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../data/toolsData';
import { ToolCard } from '../components/tools/ToolCard';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    <div className="space-y-20 pb-20 bg-[#070B14] text-[#F8FAFF]">
      {/* ---------------------------------------------------------------- */}
      {/* Hero Section */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 text-center max-w-5xl mx-auto px-4 space-y-8">
        {/* Glow effect */}
        <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-96 h-96 bg-[#4776FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0D1424] border border-[#263653] text-xs font-medium text-[#AAB8D0] shadow-lg relative z-10">
          <span className="flex items-center gap-1.5 text-[#4776FF] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 60 Professional Tools
          </span>
          <span className="text-[#263653]">·</span>
          <span>No Account Required</span>
          <span className="text-[#263653]">·</span>
          <span>100% Client-Side Privacy</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F8FAFF] tracking-tight text-balance leading-[1.1] relative z-10">
          All Your Creative Tools <br />
          <span className="bg-gradient-to-r from-[#4776FF] to-[#8957FF] bg-clip-text text-transparent">
            in One Dark Studio
          </span>
        </h1>

        <p className="text-base sm:text-xl text-[#AAB8D0] max-w-3xl mx-auto leading-relaxed text-balance relative z-10">
          Access professional AI writing assistants, generate stunning AI images, edit PDFs, optimize images, and calculate academic metrics instantly in one unified workspace.
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto flex items-center shadow-2xl rounded-2xl overflow-hidden border border-[#263653] bg-[#0D1424] z-10"
        >
          <Search className="w-5 h-5 text-[#AAB8D0] ml-5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search all 60 tools (e.g. AI Image Generator, Merge PDF, GPA Calculator)..."
            className="w-full py-4 pl-4 pr-32 text-sm bg-transparent text-[#F8FAFF] placeholder-[#AAB8D0]/60 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-md whitespace-nowrap"
          >
            Find Tool
          </button>
        </form>

        {/* Two Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
          <Link
            to="/tools"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
          >
            <span>Explore Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/tools/ai-image-generator"
            className="px-6 py-3 rounded-xl bg-[#0D1424] hover:bg-[#111B30] text-[#F8FAFF] font-semibold text-sm transition-all border border-[#263653] flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#8957FF]" />
            <span>Generate Image</span>
          </Link>
          <Link
            to="/guides/image-formats"
            className="px-6 py-3 rounded-xl bg-[#0D1424] hover:bg-[#111B30] text-[#AAB8D0] font-semibold text-sm transition-all border border-[#263653] flex items-center gap-2"
          >
            <span>Image Format Guide</span>
          </Link>
        </div>

        {/* Quick Suggestion Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#AAB8D0] pt-2 relative z-10">
          <span>Popular searches:</span>
          {['AI Image Generator', 'Merge PDF', 'Image Compressor', 'GPA Calculator', 'AI Essay Writer', 'WebP Converter'].map(item => {
            const tool = ALL_TOOLS.find(t => t.title.toLowerCase().includes(item.toLowerCase()));
            return tool ? (
              <Link
                key={tool.slug}
                to={`/${tool.slug}`}
                className="text-[#F8FAFF] hover:text-[#4776FF] underline underline-offset-4 transition-colors"
              >
                {item}
              </Link>
            ) : null;
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured AI Image Generator Spotlight Banner */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#0D1424] via-[#111B30] to-[#0D1424] border border-[#263653] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#4776FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4776FF]/20 text-[#4776FF] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen AI Image Creator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
                Text-to-Image AI Generator & Studio
              </h2>
              <p className="text-sm sm:text-base text-[#AAB8D0] leading-relaxed">
                Transform text prompts into photorealistic masterpieces, digital illustrations, and 3D artwork instantly. Seamlessly send outputs to our browser-based resizers and compressors.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools/ai-image-generator"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>Launch AI Image Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/guides/image-formats"
                  className="px-6 py-3 rounded-xl bg-[#0D1424] border border-[#263653] text-[#AAB8D0] font-semibold text-xs sm:text-sm hover:bg-[#111B30] transition-colors"
                >
                  <span>Image Format Guide</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-[#0D1424] border border-[#263653] rounded-2xl overflow-hidden relative group shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="AI Art Preview 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white">Cyberpunk City</span>
              </div>
              <div className="aspect-square bg-[#0D1424] border border-[#263653] rounded-2xl overflow-hidden relative group shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=600&q=80"
                  alt="AI Art Preview 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white">Digital Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Five Core Categories Showcase Cards with Relevant Images */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFF]">
            Five Specialized Tool Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#AAB8D0]">
            Explore our curated tool suites designed for writing, documents, media, marketing, and academics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOL_CATEGORIES.map(cat => {
            const count = ALL_TOOLS.filter(t => t.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-[#0D1424] border border-[#263653] rounded-2xl overflow-hidden shadow-xl hover:border-[#4776FF] transition-all group flex flex-col justify-between"
              >
                {cat.imageUrl && (
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/40 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#070B14]/80 backdrop-blur-md border border-[#263653] text-[10px] font-bold text-[#4776FF]">
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
                  <Link
                    to={`/tools?category=${cat.id}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#4776FF] hover:text-blue-400 pt-2"
                  >
                    <span>Browse {cat.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Popular Tools Section */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#F8FAFF]">Popular Utilities & AI Tools</h2>
            <p className="text-xs sm:text-sm text-[#AAB8D0]">Most frequently used tools across our global community</p>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-[#4776FF] hover:text-blue-400 flex items-center gap-1.5"
          >
            <span>View All 60 Tools</span>
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
      {/* Pricing Section */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFF]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-[#AAB8D0]">
            Free core utilities forever. Upgrade for unlimited AI generation and advanced cloud workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-[#0D1424] border border-[#263653] rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#F8FAFF]">Free Forever</h3>
                <p className="text-xs text-[#AAB8D0]">For students and casual users</p>
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFF]">
                $0 <span className="text-xs font-normal text-[#AAB8D0]">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#AAB8D0]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> All 50+ Client-Side Utilities</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Unlimited PDF & Image Processing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> GPA & Student Calculators</li>
              </ul>
            </div>
            <Link
              to="/tools"
              className="w-full py-3 rounded-xl bg-[#111B30] hover:bg-[#192744] text-[#F8FAFF] text-xs font-semibold text-center transition-colors border border-[#263653]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-[#0D1424] to-[#111B30] border-2 border-[#4776FF] rounded-3xl p-8 space-y-6 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#4776FF] text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#F8FAFF]">Pro AI Creator</h3>
                <p className="text-xs text-[#AAB8D0]">For creators, marketers & writers</p>
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFF]">
                $12 <span className="text-xs font-normal text-[#AAB8D0]">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#AAB8D0]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Unlimited AI Writing & Essays</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Unlimited AI Image Generation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Priority Generation Speeds</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Ad-Free Experience</li>
              </ul>
            </div>
            <Link
              to="/tools/ai-image-generator"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 text-white text-xs font-semibold text-center transition-opacity shadow-lg"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Team Tier */}
          <div className="bg-[#0D1424] border border-[#263653] rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#F8FAFF]">Team & Agency</h3>
                <p className="text-xs text-[#AAB8D0]">For collaborative teams</p>
              </div>
              <div className="text-3xl font-extrabold text-[#F8FAFF]">
                $39 <span className="text-xs font-normal text-[#AAB8D0]">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#AAB8D0]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Up to 5 Team Members</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Centralized Billing & Dashboard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#4776FF]" /> Dedicated Support</li>
              </ul>
            </div>
            <Link
              to="/contact"
              className="w-full py-3 rounded-xl bg-[#111B30] hover:bg-[#192744] text-[#F8FAFF] text-xs font-semibold text-center transition-colors border border-[#263653]"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why Choose WriteGenius Tools? */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#0D1424] border border-[#263653] rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-[#F8FAFF]">Why Choose WriteGenius Studio?</h2>
            <p className="text-xs sm:text-sm text-[#AAB8D0]">Engineered for speed, security, and absolute privacy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-[#070B14] border border-[#263653]">
              <div className="w-10 h-10 rounded-xl bg-[#111B30] border border-[#263653] flex items-center justify-center text-[#4776FF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFF]">100% Client-Side Privacy</h3>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                PDF merging, image compression, and academic calculations execute entirely inside your browser memory. Your documents never touch an external server.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#070B14] border border-[#263653]">
              <div className="w-10 h-10 rounded-xl bg-[#111B30] border border-[#263653] flex items-center justify-center text-[#8957FF]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFF]">Advanced Gemini AI</h3>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                Powered by state-of-the-art Gemini models for essays, social media posts, email composition, and text summarization.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#070B14] border border-[#263653]">
              <div className="w-10 h-10 rounded-xl bg-[#111B30] border border-[#263653] flex items-center justify-center text-cyan-400">
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
