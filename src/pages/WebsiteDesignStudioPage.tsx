import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ShieldCheck } from 'lucide-react';
import { WebsiteDesignStudio } from '../components/tools/WebsiteDesignStudio';
import { updateDocumentSeo } from '../utils/seoUtils';
import { addRecentTool } from '../utils/recentToolsUtils';

interface WebsiteDesignStudioPageProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const WebsiteDesignStudioPage: React.FC<WebsiteDesignStudioPageProps> = ({ onShowToast }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    addRecentTool('website-design-studio');

    updateDocumentSeo({
      title: 'Website Design Studio – Free Online Website Builder & Code Generator',
      description: 'Build professional websites instantly with 100+ templates, visual customization, and production-ready HTML, CSS, and React code generation.',
      canonicalPath: '/tools/website-design-studio',
      keywords: ['website design studio', 'online website builder', 'HTML CSS website generator', 'React landing page builder'],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Website Design', url: '/category/website-design' },
        { name: 'Website Design Studio', url: '/tools/website-design-studio' },
      ],
    });
  }, []);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto pt-6">
      <section className="px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0] flex-wrap mb-4">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to="/tools" className="hover:text-[#F8FAFF] transition-colors">
            Tools Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            Website Design Studio
          </span>
        </nav>
      </section>

      <WebsiteDesignStudio onShowToast={onShowToast} />
    </div>
  );
};
