import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateDocumentSeo } from '../utils/seoUtils';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'Terms of Service – WriteGenius Tools',
      description: 'Review the terms of service, acceptable use policies, and user agreements for WriteGenius Tools.',
      canonicalPath: '/terms',
    });
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Last revised: October 16, 2026 · Standard Website Terms
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Agreement to Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            By accessing or using WriteGenius Tools (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Intellectual Property and Content Ownership
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You retain 100% full ownership, copyright, and commercial exploitation rights to all original text you enter and all text outputs generated through WriteGenius Tools. You may publish, monetize, distribute, or incorporate outputs into any academic, personal, or commercial work.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Disclaimer on AI-Generated Outputs
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generative artificial intelligence is an assistive drafting technology. Outputs may occasionally contain factual errors, stylistic imperfections, or unintended phrasing. You are solely responsible for reviewing, fact-checking, and verifying any AI-generated drafts prior to reliance, publication, or official submission.
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            We make no warranties, express or implied, regarding search engine ranking guarantees, academic grading outcomes, or legal enforceability of generated proposals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Acceptable Use Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You agree not to use the Service for any unlawful activities, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Generating malware, phishing campaigns, deceptive impersonation, or harassment.</li>
            <li>Attempting to bypass server rate limits, denial-of-service attacks, or reverse engineering API endpoints.</li>
            <li>Uploading illegal, non-consensual, or prohibited material.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Limitation of Liability
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            In no event shall WriteGenius Tools, its operators, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use or inability to use the Service.
          </p>
        </section>
      </div>
    </div>
  );
};
