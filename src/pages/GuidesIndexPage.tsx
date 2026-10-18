import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Image as ImageIcon, GraduationCap, Share2, ArrowRight, Home, ChevronRight } from 'lucide-react';
import { updateDocumentSeo } from '../utils/seoUtils';

const GUIDES = [
  {
    slug: 'image-formats',
    title: 'Web Image Formats Explained: PNG, JPG, WebP, SVG & AVIF',
    description: 'A comprehensive technical comparison to help you choose the right image format for speed, visual fidelity, and web performance.',
    category: 'Image Optimization',
    icon: ImageIcon,
    readTime: '6 min read',
    relatedTools: ['image-format-converter', 'image-compressor', 'webp-converter'],
  },
  {
    slug: 'pdf-optimization-guide',
    title: 'Complete Guide to In-Browser PDF Compression, Merging & Privacy',
    description: 'Learn how modern WebAssembly allows you to combine, split, and shrink confidential PDF documents client-side without cloud data leaks.',
    category: 'Document Management',
    icon: FileText,
    readTime: '7 min read',
    relatedTools: ['merge-pdf', 'compress-pdf', 'split-pdf'],
  },
  {
    slug: 'academic-writing-and-gpa-guide',
    title: 'College Essay Architecture, Thesis Formulation & GPA Strategies',
    description: 'A student guide to drafting persuasive argumentative papers, structuring paragraphs with topic claims, and computing cumulative GPA.',
    category: 'Academic Writing & Study',
    icon: GraduationCap,
    readTime: '8 min read',
    relatedTools: ['ai-essay-writer', 'gpa-calculator', 'word-counter'],
  },
  {
    slug: 'social-media-content-growth-guide',
    title: 'How to Write Viral Hooks, High-Retention Captions & Hashtag Bundles',
    description: 'Master the anatomy of scroll-stopping Instagram Reels, LinkedIn thought leadership, and weekly content calendars for organic reach.',
    category: 'Social Media Growth',
    icon: Share2,
    readTime: '6 min read',
    relatedTools: ['instagram-caption-generator', 'linkedin-post-writer', 'content-calendar-generator'],
  },
];

export const GuidesIndexPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'Guides & Tutorials – WriteGenius Creative Tools Studio',
      description: 'Explore in-depth technical guides, tutorials, and workflows for image optimization, PDF management, academic writing, and social media growth.',
      canonicalPath: '/guides',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Guides', url: '/guides' },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'WriteGenius Technical Guides & Tutorials',
        description: 'Comprehensive tutorials for digital productivity, document management, and creative workflows.',
        url: 'https://writegenius.tools/guides',
      },
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-8 px-4">
      {/* Header & Breadcrumb */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#0D1424] border border-[#263653] shadow-2xl space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0]">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            Guides & Tutorials
          </span>
        </nav>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#263653] text-xs font-semibold text-[#4776FF]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
            Guides, Tutorials & Technical Walkthroughs
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] max-w-2xl leading-relaxed">
            Practical, in-depth tutorials on document privacy, responsive image formats, academic writing methodologies, and organic social media reach.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((g) => {
          const IconComponent = g.icon;
          return (
            <div
              key={g.slug}
              className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] hover:border-[#4776FF] transition-all group shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4776FF] px-2.5 py-0.5 rounded-full bg-[#111A2E] border border-[#263653]">
                    {g.category}
                  </span>
                  <span className="text-xs font-mono text-[#AAB8D0]">{g.readTime}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#111A2E] border border-[#263653] flex items-center justify-center text-[#4776FF] shrink-0 mt-0.5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors leading-snug">
                    <Link to={`/guides/${g.slug}`}>{g.title}</Link>
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#AAB8D0] leading-relaxed">
                  {g.description}
                </p>

                {/* Related Tools */}
                <div className="pt-3 border-t border-[#263653]/60 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[#AAB8D0] text-[11px]">Related Tools:</span>
                  {g.relatedTools.map((tSlug) => (
                    <Link
                      key={tSlug}
                      to={`/tools/${tSlug}`}
                      className="px-2 py-0.5 rounded-md bg-[#090F1D] border border-[#263653] text-[#AAB8D0] hover:text-[#F8FAFF] hover:border-[#4776FF] text-[11px] transition-colors"
                    >
                      {tSlug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 flex items-center justify-between text-xs text-[#4776FF] font-semibold">
                <Link to={`/guides/${g.slug}`} className="flex items-center gap-1.5 group-hover:underline">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
