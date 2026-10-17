import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateDocumentSeo } from '../utils/seoUtils';
import { Shield, Sparkles, Cpu, Users, Award, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'About WriteGenius Studio – Mission, Philosophy & Technology',
      description: 'Learn about WriteGenius Studio, our privacy-first philosophy, client-side text utilities, and responsible AI writing architecture.',
      canonicalPath: '/about',
    });
  }, []);

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-6">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
          About WriteGenius Studio
        </h1>
        <p className="text-base text-[#AAB8D0] leading-relaxed">
          WriteGenius Studio was founded on a simple principle: high-quality creative tools and productivity software should be accessible to everyone worldwide in a fast, privacy-respecting, dark studio interface without restrictive paywalls or invasive tracking.
        </p>
      </section>

      {/* Core Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-[#111B30] border border-[#263653] text-emerald-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#F8FAFF]">
            Privacy by Design
          </h2>
          <p className="text-xs text-[#AAB8D0] leading-relaxed">
            We prioritize client-side processing. When you merge PDFs, compress images, count words, or calculate GPA, zero bytes leave your browser.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-[#111B30] border border-[#263653] text-[#4776FF] flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#F8FAFF]">
            Engineering Precision
          </h2>
          <p className="text-xs text-[#AAB8D0] leading-relaxed">
            Our text analysis algorithms implement peer-reviewed linguistic formulas including Flesch-Kincaid Grade Level, Automated Readability Index, and AP Title Casing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-[#111B30] border border-[#263653] text-[#8957FF] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#F8FAFF]">
            Responsible AI
          </h2>
          <p className="text-xs text-[#AAB8D0] leading-relaxed">
            Our generative AI tools utilize state-of-the-art models strictly as intellectual collaborators, empowering writers and creators while maintaining full human agency.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="p-8 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-[#F8FAFF]">
          Technology Architecture
        </h2>
        <div className="space-y-3 text-xs text-[#AAB8D0] leading-relaxed">
          <p>
            WriteGenius Studio is engineered as a modern, high-performance web platform built with React, TypeScript, and Tailwind CSS. We believe in minimal latency and optimal battery efficiency on mobile and desktop devices.
          </p>
          <p>
            Client-side tasks (PDF handling, image processing, character counting, and mathematical computations) execute natively using WebAssembly, HTML5 Canvas, and modern browser APIs.
          </p>
        </div>
      </section>
    </div>
  );
};
