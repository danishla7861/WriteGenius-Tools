import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateDocumentSeo } from '../utils/seoUtils';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'Privacy Policy – WriteGenius Studio',
      description: 'Review the WriteGenius Studio privacy policy. Learn how we protect your drafts, client-side processing guarantees, and ephemeral AI data handling.',
      canonicalPath: '/privacy',
    });
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="space-y-2 border-b border-[#263653] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFF] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#AAB8D0]">
          Last updated: October 2026 · Effective immediately
        </p>
      </div>

      <div className="text-xs sm:text-sm leading-relaxed space-y-6 text-[#AAB8D0]">
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#263653] flex items-start gap-3 shadow-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-[#F8FAFF]">
              Our Plain English Privacy Commitment
            </h3>
            <p className="text-[#AAB8D0]">
              We never sell your personal data, we do not store your private draft text in databases, and we run our core utilities 100% locally in your web browser.
            </p>
          </div>
        </div>

        <section className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
          <h2 className="text-base font-bold text-[#F8FAFF]">
            1. Client-Side Processing for Free Utilities
          </h2>
          <p>
            All tools categorized under PDF Tools, Image Tools, and Student Utilities (including PDF Merge, PDF Split, Image Resizing, Compression, Word Counter, and GPA Calculator) run entirely within your web browser using client-side JavaScript and Canvas APIs.
          </p>
          <p>
            Files and text used in these utilities are never uploaded to any remote server or transmitted across the internet. When you close the browser tab, the data is completely purged from memory.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
          <h2 className="text-base font-bold text-[#F8FAFF]">
            2. Ephemeral Processing of AI Studio Features
          </h2>
          <p>
            When you explicitly click &quot;Generate&quot;, &quot;Improve&quot;, or &quot;Rewrite&quot; on an AI tool, your input prompt and options are sent via encrypted HTTPS to our server-side API adapter, which communicates directly with Google's Gemini models.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Requests are processed in-memory and are never stored in databases.</li>
            <li>No user drafts or uploaded documents are retained for future AI model training.</li>
            <li>API keys are kept strictly server-side and never exposed in client bundles.</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
          <h2 className="text-base font-bold text-[#F8FAFF]">
            3. Local Storage & Preferences
          </h2>
          <p>
            We use your browser's local storage solely to retain local preferences (such as your active theme or recent tools). We do not deploy third-party advertising trackers or invasive behavioral spyware.
          </p>
        </section>
      </div>
    </div>
  );
};
