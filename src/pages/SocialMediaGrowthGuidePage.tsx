import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, ArrowRight, CheckCircle2, Home, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';
import { updateDocumentSeo } from '../utils/seoUtils';

export const SocialMediaGrowthGuidePage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'How to Write Viral Hooks, High-Retention Captions & Hashtags',
      description: 'Master the anatomy of high-engagement social media copy. Learn hook formulas for Reels, storytelling captions, and organic reach strategies.',
      canonicalPath: '/guides/social-media-content-growth-guide',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Guides', url: '/guides' },
        { name: 'Social Media Growth Guide', url: '/guides/social-media-content-growth-guide' },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'How to Write Viral Hooks, High-Retention Captions & Hashtag Bundles',
        description: 'Complete playbook for social media copywriters, creators, and brands seeking organic distribution.',
        author: {
          '@type': 'Organization',
          name: 'WriteGenius Tools Editorial Team',
        },
      },
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#0D1424] border border-[#263653] shadow-2xl space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0]">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to="/guides" className="hover:text-[#F8FAFF] transition-colors">
            Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            Social Media Growth Guide
          </span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#263653] text-xs font-semibold text-[#4776FF]">
            <Share2 className="w-3.5 h-3.5" />
            <span>Organic Social Distribution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
            How to Write Viral Hooks, High-Retention Captions & Hashtags
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] leading-relaxed">
            In an algorithmic landscape dominated by short attention spans, the first 3 seconds of a video and the first line of a caption determine 90% of your organic reach.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="space-y-8 text-sm text-[#AAB8D0] leading-relaxed">
        
        {/* Section 1: Hook Psychology */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            1. The 3 Types of High-Retention Hooks
          </h2>
          <p>
            Users scroll past hundreds of posts every minute. To trigger a pause, your hook must create an immediate cognitive gap:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-[#F8FAFF]">Contrarian Truths</h3>
              <p className="text-xs">&quot;Stop doing cardio if your goal is fat loss — here is why.&quot; Challenges common beliefs.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <Target className="w-5 h-5 text-[#4776FF]" />
              <h3 className="text-xs font-bold text-[#F8FAFF]">Direct Benefit</h3>
              <p className="text-xs">&quot;The 3-step prompt framework that saved me 10 hours this week.&quot; Clear utility.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold text-[#F8FAFF]">Vulnerable Story</h3>
              <p className="text-xs">&quot;I failed 4 product launches before learning this one lesson.&quot; Human empathy.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Spacing & Line Breaks */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            2. Formatting for Readability (No More Dot Walls)
          </h2>
          <p>
            Dense walls of unformatted text suffer high drop-off rates on mobile screens. Modern captions require:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-2 sentence paragraphs with whitespace padding.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strategic emoji bullet points to guide scanning eyes.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>A singular, frictionless Call-to-Action (e.g. &quot;Comment \'GUIDE\' to get the link&quot;).</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Recommended Social Tools */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            3. Recommended WriteGenius Social Media Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              to="/tools/instagram-caption-generator"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">Instagram Caption Generator</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Generate hooks, body copy, and niche hashtags.</p>
            </Link>
            <Link
              to="/tools/linkedin-post-writer"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">LinkedIn Post Writer</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Draft professional B2B thought leadership.</p>
            </Link>
            <Link
              to="/tools/content-calendar-generator"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">Content Calendar Generator</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Plan a week of multi-platform post ideas.</p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
