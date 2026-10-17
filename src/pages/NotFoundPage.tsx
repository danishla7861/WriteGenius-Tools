import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { updateDocumentSeo } from '../utils/seoUtils';
import { ALL_TOOLS } from '../data/toolsData';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: '404 – Page Not Found | WriteGenius Tools',
      description: 'The requested writing tool or page could not be found. Browse our directory of 56 writing tools.',
    });
  }, []);

  const popular = ALL_TOOLS.slice(0, 4);

  return (
    <div className="py-16 sm:py-24 text-center max-w-xl mx-auto space-y-6 px-4">
      <span className="text-5xl sm:text-6xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        We couldn&apos;t find the page or writing utility you requested. It might have been moved or renamed.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/tools"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-lg transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse 56 Tools</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Or try one of our popular writing tools:
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {popular.map(tool => (
            <Link
              key={tool.slug}
              to={`/${tool.slug}`}
              className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left font-medium"
            >
              {tool.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
