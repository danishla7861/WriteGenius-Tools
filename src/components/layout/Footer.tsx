import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, ShieldCheck, Cpu } from 'lucide-react';
import { TOOL_CATEGORIES } from '../../data/toolsData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070B14] border-t border-[#263653] text-[#AAB8D0] text-sm transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-[#F8FAFF]">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white flex items-center justify-center font-bold">
                <PenTool className="w-3.5 h-3.5" />
              </div>
              <span>WriteGenius Studio</span>
            </Link>
            <p className="text-[#AAB8D0] text-sm leading-relaxed max-w-sm">
              An all-in-one creative studio featuring 60+ free online tools: AI writing, PDF utilities, image editors, social media assistants, and student utilities. Built for professionals and creators worldwide.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#AAB8D0] pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero server logging of private drafts</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#4776FF]" />
                <span>Client-first architecture</span>
              </span>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFF] mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {TOOL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="hover:text-[#4776FF] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/guides"
                  className="hover:text-[#4776FF] transition-colors font-medium text-[#4776FF]"
                >
                  Guides & Tutorials →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFF] mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/merge-pdf" className="hover:text-[#4776FF] transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/image-compressor" className="hover:text-[#4776FF] transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link to="/gpa-calculator" className="hover:text-[#4776FF] transition-colors">
                  GPA Calculator
                </Link>
              </li>
              <li>
                <Link to="/ai-essay-writer" className="hover:text-[#4776FF] transition-colors">
                  AI Essay Writer
                </Link>
              </li>
              <li>
                <Link to="/ai-image-generator" className="hover:text-[#4776FF] transition-colors">
                  AI Image Generator
                </Link>
              </li>
              <li>
                <Link to="/word-counter" className="hover:text-[#4776FF] transition-colors">
                  Word Counter
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFF] mb-3">
              Information & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#4776FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#4776FF] transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#4776FF] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#4776FF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#4776FF] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-[#4776FF] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#263653] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAB8D0]">
          <p>© {new Date().getFullYear()} WriteGenius Studio. All rights reserved. Professional AI productivity software.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span aria-hidden="true">·</span>
            <a href="/sitemap.xml" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
