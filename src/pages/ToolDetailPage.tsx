import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOL_MAP, TOOL_CATEGORIES, ALL_TOOLS } from '../data/toolsData';
import { ToolLayout } from '../components/tools/ToolLayout';
import { addRecentTool } from '../utils/recentToolsUtils';
import { ArrowLeft, Search, Sparkles, ChevronRight, Compass } from 'lucide-react';

interface ToolDetailPageProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ onShowToast }) => {
  const { slug, toolSlug } = useParams<{ slug?: string; toolSlug?: string }>();
  const activeSlug = toolSlug || slug;
  const tool = activeSlug ? TOOL_MAP[activeSlug] : undefined;
  const [sidebarSearch, setSidebarSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tool) {
      addRecentTool(tool.slug);
    }
  }, [activeSlug, tool]);

  if (!tool) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111B30] border border-[#263653] flex items-center justify-center text-[#4776FF]">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFF]">
          Tool Not Found
        </h1>
        <p className="text-xs text-[#AAB8D0]">
          The creative utility or tool you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse 60+ Tools in Studio Directory</span>
        </Link>
      </div>
    );
  }

  const categoryInfo = TOOL_CATEGORIES.find((c) => c.id === tool.category);
  const relatedTools = ALL_TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 6);
  const filteredTools = sidebarSearch.trim()
    ? ALL_TOOLS.filter((t) => t.title.toLowerCase().includes(sidebarSearch.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Studio Navigation & Tool Switcher */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
          {/* Quick Search */}
          <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFF] tracking-wider uppercase">
              <Compass className="w-4 h-4 text-[#4776FF]" />
              <span>Studio Directory</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#AAB8D0] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search 60+ tools..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              />
            </div>

            {filteredTools.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-[#263653]">
                {filteredTools.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/tools/${t.slug}`}
                    className="flex items-center justify-between p-2 text-xs text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30] rounded-lg transition-colors"
                  >
                    <span className="truncate">{t.title}</span>
                    <ChevronRight className="w-3 h-3 text-[#263653]" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Navigation */}
          <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
            <div className="text-xs font-bold text-[#F8FAFF] tracking-wider uppercase">
              Tool Categories
            </div>
            <div className="space-y-1">
              {TOOL_CATEGORIES.map((cat) => {
                const isActive = cat.id === tool.category;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className={`flex items-center justify-between p-2.5 text-xs font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                        : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#090F1D] text-[#AAB8D0]'}`}>
                      {ALL_TOOLS.filter((t) => t.category === cat.id).length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Related Tools in Category */}
          {relatedTools.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#263653] space-y-3 shadow-xl">
              <div className="text-xs font-bold text-[#F8FAFF] tracking-wider uppercase">
                More in {categoryInfo?.name || 'Category'}
              </div>
              <div className="space-y-1">
                {relatedTools.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/tools/${t.slug}`}
                    className="flex items-center justify-between p-2 text-xs text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30] rounded-lg transition-colors"
                  >
                    <span className="truncate">{t.title}</span>
                    <ChevronRight className="w-3 h-3 text-[#263653]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Workspace Column */}
        <main className="lg:col-span-9 space-y-6">
          <ToolLayout tool={tool} onShowToast={onShowToast} />
        </main>

      </div>
    </div>
  );
};
