import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateDocumentSeo } from '../utils/seoUtils';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'General & Pricing',
    question: 'Are all utilities completely free?',
    answer: 'Yes. All text, grammar, PDF, and image utilities operate 100% free with no limits or subscriptions. AI writing tools and image generators are provided with generous free quotas.',
  },
  {
    category: 'General & Pricing',
    question: 'Do I need to create an account or sign in?',
    answer: 'No. WriteGenius Studio does not require any account creation, login, email address, or credit card for core utilities. You can immediately access and run any tool.',
  },
  {
    category: 'Privacy & Security',
    question: 'Is my data private and secure?',
    answer: 'Yes. We enforce a privacy-first architecture. Core text, PDF, and image utilities run locally in your web browser with zero server transmission. AI requests are processed ephemerally on the backend and are never saved in persistent databases.',
  },
  {
    category: 'Privacy & Security',
    question: 'Is my content used to train AI models?',
    answer: 'No. API calls routed to our Google Gemini model provider are enterprise-grade ephemeral requests that are not retained or utilized to train future AI models.',
  },
  {
    category: 'AI Capabilities',
    question: 'Can I generate high-resolution images?',
    answer: 'Yes. Our AI Image Generator creates high-resolution visual art with custom aspect ratios, style presets, and negative prompts, directly downloadable as JPG/PNG.',
  },
  {
    category: 'AI Capabilities',
    question: 'Can I use generated content commercially?',
    answer: 'Yes. You retain full copyright and ownership of any text or visual media produced using WriteGenius Studio for commercial publications, client copy, marketing, or business projects.',
  },
  {
    category: 'Technical',
    question: 'What formulas are used for readability scores?',
    answer: 'We compute Flesch Reading Ease, Flesch-Kincaid Grade Level, and Automated Readability Index (ARI) based on exact phonetic syllable and word counts.',
  },
  {
    category: 'Technical',
    question: 'How do I download my generated drafts?',
    answer: 'Every tool includes direct download controls in the output toolbar that save your files directly to your device as text, images, or documents.',
  },
];

export const FaqPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    updateDocumentSeo({
      title: 'Frequently Asked Questions – WriteGenius Studio',
      description: 'Find answers to common questions about WriteGenius Studio, free text utilities, privacy, readability formulas, and AI capabilities.',
      canonicalPath: '/faq',
    });
  }, []);

  const filteredFaqs = FAQS.filter(
    f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

      <div className="space-y-2 border-b border-[#263653] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F8FAFF] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#AAB8D0]">
          Everything you need to know about our creative studio, utilities, and AI features.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#AAB8D0] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search FAQs by topic or keyword..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="divide-y divide-[#263653] rounded-2xl bg-[#0D1424] border border-[#263653] overflow-hidden shadow-xl">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-xs sm:text-sm text-[#F8FAFF] hover:bg-[#111B30] transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#4776FF] tracking-wider block mb-0.5">
                    {faq.category}
                  </span>
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#AAB8D0] transition-transform duration-200 shrink-0 ml-4 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#AAB8D0] leading-relaxed border-t border-[#263653]/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-2xl bg-[#0D1424] border border-[#263653] text-center space-y-3 shadow-xl">
        <h3 className="text-base font-bold text-[#F8FAFF]">
          Still have a question?
        </h3>
        <p className="text-xs text-[#AAB8D0]">
          Our team is happy to assist. Send us an inquiry via our contact page.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-md"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
