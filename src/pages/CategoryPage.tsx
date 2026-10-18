import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../data/toolsData';
import { updateDocumentSeo } from '../utils/seoUtils';
import {
  ChevronRight,
  Home,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FolderOpen,
} from 'lucide-react';

const CATEGORY_SEO_DATA: Record<string, {
  title: string;
  description: string;
  overview: string[];
  keyBenefits: string[];
  faqs: { question: string; answer: string }[];
}> = {
  'ai-writing': {
    title: 'AI Writing Toolkit – Essays, Paragraphs, Articles & Email Generators',
    description: 'Explore 17 free AI writing tools: essay writers, paragraph rewriters, grammar checkers, email drafts, resume bullets, and SEO generators.',
    overview: [
      'The AI Writing Toolkit combines modern generative language models with intuitive text analysis to accelerate your drafting, editing, and content creation workflows.',
      'Whether you are composing academic argument papers, crafting customer support replies, or building SEO blog outlines, each tool provides structured, context-aware prose that you can edit and refine instantly.',
    ],
    keyBenefits: [
      'High-cadence natural prose tailored for academic, corporate, or conversational contexts.',
      'Instant interactive output editor with word count, readability, and one-click copy.',
      'Generous daily generation allowances with no credit card requirement.',
      'Secure TLS transmission with zero permanent storage of your personal drafts.',
    ],
    faqs: [
      { question: 'Are the AI writing tools free?', answer: 'Yes, all AI writing tools provide generous free daily generation with zero upfront payment or subscription.' },
      { question: 'Can I choose different writing tones?', answer: 'Yes, most tools support tone toggles including Professional, Conversational, Academic, and Persuasive.' },
      { question: 'Is my written text kept private?', answer: 'Yes. Texts are processed in ephemeral server memory and are never stored in public databases or used for model training.' },
      { question: 'Can I export my generated content?', answer: 'You can copy text to your clipboard with one click or download it as a clean .txt file.' },
    ],
  },
  'pdf-tools': {
    title: 'PDF Tools Online Free – Merge, Compress, Split & Convert Documents',
    description: '10 free client-side PDF tools: merge PDF files, compress document size, split pages, rotate, and convert images with 100% private in-browser processing.',
    overview: [
      'Our PDF Tools suite provides robust, privacy-first document manipulation utilities that run 100% locally in your web browser using WebAssembly.',
      'Because all processing takes place in your computer\'s RAM, sensitive tax forms, financial statements, and contracts are never uploaded to remote cloud servers.',
    ],
    keyBenefits: [
      '100% Client-Side Privacy: Your documents never leave your browser.',
      'Lossless processing: preserves original vector fonts, high-res images, and links.',
      'Interactive document viewer: preview merged, split, or compressed output before downloading.',
      'Zero file-size paywalls and no watermarks added to your documents.',
    ],
    faqs: [
      { question: 'Are my PDF documents uploaded to your server?', answer: 'No! All PDF operations run 100% locally in your browser memory using WebAssembly. Nothing is uploaded to any server.' },
      { question: 'How many files can I merge or convert at once?', answer: 'You can process multiple files simultaneously up to your local device\'s available memory (typically 50MB+).' },
      { question: 'Will compressing my PDF reduce text readability?', answer: 'No. Our engine optimizes redundant metadata and image streams while preserving vector font sharpness.' },
      { question: 'Do these PDF tools work on mobile phones?', answer: 'Yes, our responsive PDF studio works smoothly across iOS Safari, Android Chrome, and desktop browsers.' },
    ],
  },
  'image-tools': {
    title: 'Image Tools Online Free – Resize, Compress, Convert & Crop Photos',
    description: '11 free in-browser image tools: resize pixel dimensions, compress photo MB to KB, convert WebP/JPG/PNG, and crop photos with zero quality loss.',
    overview: [
      'The Image Tools suite gives designers, photographers, webmasters, and social creators instant control over image dimensions, file weight, and formats.',
      'Engineered with modern HTML5 Canvas APIs, every operation executes in real time without uploading your confidential photos to external cloud storage.',
    ],
    keyBenefits: [
      'Instant in-browser image resampling and perceptual quantization.',
      'Live before-and-after visual comparisons with exact byte savings metrics.',
      'Support for modern high-efficiency formats including WebP, PNG, and JPEG.',
      'Built-in presets for social banners, e-commerce products, and passport photos.',
    ],
    faqs: [
      { question: 'How does in-browser image compression work?', answer: 'We use perceptual quantization directly in HTML5 Canvas to strip invisible redundant colors without noticeable visual blur.' },
      { question: 'Can I convert PNG to WebP?', answer: 'Yes! Our Format Converter and WebP Converter transform images instantly with full transparency support.' },
      { question: 'Are my personal photos stored online?', answer: 'Never. Processing is 100% local inside your browser session and is purged the moment you close the tab.' },
      { question: 'Does resizing images lock aspect ratio?', answer: 'Yes, you can toggle the aspect ratio lock to prevent unwanted stretching or distortion.' },
    ],
  },
  'ai-social': {
    title: 'AI Social Media Toolkit – Instagram, LinkedIn, X & YouTube Generators',
    description: '10 AI social media tools: create viral Instagram captions, LinkedIn thought leadership, X/Twitter posts, YouTube titles, and weekly content calendars.',
    overview: [
      'The AI Social Media Toolkit is designed for social media managers, influencers, founders, and creators seeking high engagement across digital channels.',
      'Generate scroll-stopping hooks, authentic storytelling captions, viral hashtag bundles, and cohesive weekly posting schedules in seconds.',
    ],
    keyBenefits: [
      'Platform-native formatting: proper spacing for Instagram, character limits for X, and hooks for LinkedIn.',
      'Curated hashtag recommendations tailored to your specific niche.',
      'Multiple creative styles: witty, inspirational, educational, and promotional.',
      'Save hours of brainstorming and eliminate creative burnout.',
    ],
    faqs: [
      { question: 'Can I generate captions with emojis and line breaks?', answer: 'Yes, captions are generated with natural emoji placement and spaced paragraphs ready to copy and post.' },
      { question: 'Are the hashtags niche-specific?', answer: 'Yes, our model analyzes your topic to suggest relevant, high-relevance hashtags rather than generic spam tags.' },
      { question: 'Can I create a full 7-day content calendar?', answer: 'Yes! Use the Content Calendar Idea Generator to generate a structured weekly schedule with themes and hooks.' },
      { question: 'Is this suitable for B2B LinkedIn posts?', answer: 'Absolutely. Select the LinkedIn Post Writer to draft professional, thought-provoking industry insights.' },
    ],
  },
  'student-tools': {
    title: 'Student Utility Tools – GPA Calculators, Word Counters & Study Planners',
    description: '12 free student academic utilities: 4.0 scale GPA & CGPA calculators, real-time word counters, reading time estimators, and study timetable planners.',
    overview: [
      'The Student Utility Tools collection empowers high school, college, and graduate students with academic calculation and productivity utilities.',
      'From computing weighted semester GPAs and cumulative academic standing to monitoring essay word limits and pacing study blocks, everything runs instantly and privately.',
    ],
    keyBenefits: [
      'Standard 4.0 academic scale calculation with letter grade weightings.',
      'Real-time lexical text analysis: words, characters, syllables, and reading ease.',
      'Pomodoro and exam countdown trackers to keep your study sessions focused.',
      '100% free with no student email or account required.',
    ],
    faqs: [
      { question: 'How is the semester GPA calculated?', answer: 'We calculate total quality grade points divided by total course credit hours using the standard 4.0 academic scale.' },
      { question: 'Does the Word Counter count spaces as characters?', answer: 'It provides both metrics: Total Characters (with spaces) and Characters (excluding spaces).' },
      { question: 'Can I use the calculators offline?', answer: 'Yes, our student calculators run completely in client-side JavaScript and work even without an internet connection.' },
      { question: 'Are my grades or essays saved on a server?', answer: 'No. All calculations and text analysis occur strictly inside your local browser memory for absolute privacy.' },
    ],
  },
};

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = TOOL_CATEGORIES.find((c) => c.id === categoryId);
  const tools = ALL_TOOLS.filter((t) => t.category === categoryId);
  const seoInfo = categoryId ? CATEGORY_SEO_DATA[categoryId] : undefined;

  useEffect(() => {
    if (category && seoInfo) {
      updateDocumentSeo({
        title: seoInfo.title,
        description: seoInfo.description,
        canonicalPath: `/category/${category.id}`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: category.name, url: `/category/${category.id}` },
        ],
        faqs: seoInfo.faqs,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          description: seoInfo.description,
          url: `https://writegenius.tools/category/${category.id}`,
        },
      });
      window.scrollTo(0, 0);
    }
  }, [category, seoInfo]);

  if (!category || !seoInfo) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111B30] border border-[#263653] flex items-center justify-center text-[#4776FF]">
          <FolderOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFF]">Category Not Found</h1>
        <p className="text-xs text-[#AAB8D0]">The requested tool category does not exist.</p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] rounded-xl"
        >
          <span>Browse All Tools</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Category Header & Breadcrumbs */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#0D1424] border border-[#263653] shadow-2xl space-y-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0]">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to="/tools" className="hover:text-[#F8FAFF] transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            {category.name}
          </span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#263653] text-xs text-[#4776FF] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tools.length} Production Tools Available</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </section>

      {/* 2. Tools Grid (Every Tool Has Its Own Landing Page) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
            All {category.name} Tools
          </h2>
          <span className="text-xs font-mono text-[#AAB8D0]">
            {tools.length} Active Utilities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.slug}`}
              className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] hover:border-[#4776FF] transition-all group shadow-xl flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    tool.isFreeClientSide
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      : 'bg-indigo-950/60 text-[#4776FF] border border-indigo-800'
                  }`}>
                    {tool.isFreeClientSide ? 'Client-Side Utility' : 'AI Powered'}
                  </span>
                  {tool.badge && (
                    <span className="text-[11px] font-medium text-[#AAB8D0]">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#AAB8D0] line-clamp-3 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-[#263653]/60 flex items-center justify-between text-xs text-[#4776FF] font-semibold mt-4">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Deep Category Overview & Editorial Guide */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
          Why Choose the WriteGenius {category.name}?
        </h2>
        <div className="space-y-3 text-sm text-[#AAB8D0] leading-relaxed">
          {seoInfo.overview.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {seoInfo.keyBenefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-[#F8FAFF]">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Category FAQs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4776FF] uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Category FAQ</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFF]">
          Frequently Asked Questions About {category.name}
        </h2>
        <div className="divide-y divide-[#263653] rounded-2xl bg-[#0D1424] border border-[#263653] overflow-hidden shadow-xl">
          {seoInfo.faqs.map((faq, idx) => (
            <div key={idx} className="p-5 space-y-1.5">
              <h3 className="text-sm font-semibold text-[#F8FAFF]">
                {faq.question}
              </h3>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Explore Other Tool Suites */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-[#F8FAFF]">
          Explore Other Tool Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOL_CATEGORIES.filter((c) => c.id !== category.id).map((other) => (
            <Link
              key={other.id}
              to={`/category/${other.id}`}
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors">
                {other.name}
              </h3>
              <p className="text-[11px] text-[#AAB8D0] line-clamp-2 mt-1">
                {other.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
