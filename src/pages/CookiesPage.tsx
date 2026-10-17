import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateDocumentSeo } from '../utils/seoUtils';

export const CookiesPage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'Cookie Policy – WriteGenius Tools',
      description: 'Understand how WriteGenius Tools uses browser storage and cookies for theme preferences and session performance.',
      canonicalPath: '/cookies',
    });
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Cookie Policy' }]} />

      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cookie & Storage Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 16, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. What Are Cookies and Local Storage?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Cookies and HTML5 Local Storage are lightweight text records stored by your web browser on your device to remember user settings and preferences across sessions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. How WriteGenius Tools Uses Browser Storage
          </h2>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs">
              Essential Preference: Theme Mode (<code className="font-mono">wg_theme</code>)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When you toggle between Light Mode and Dark Mode, we store your selection in <code className="font-mono">localStorage</code> so that your preferred color theme is preserved when you return or open another tool.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Managing Your Storage
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You can clear cookies and local storage at any time via your browser settings. Clearing storage will simply reset your theme to your system operating system default (dark or light).
          </p>
        </section>
      </div>
    </div>
  );
};
