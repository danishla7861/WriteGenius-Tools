import React from 'react';
import { Link } from 'react-router-dom';
import { History, Trash2, ArrowRight, Sparkles, Cpu, Clock } from 'lucide-react';
import { useRecentTools } from '../../utils/recentToolsUtils';

export const RecentToolsSection: React.FC = () => {
  const { recentTools, clearAll } = useRecentTools();

  if (recentTools.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1424]/60 border border-[#263653]/70 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111A2E] border border-[#263653] flex items-center justify-center text-[#4776FF] shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFF]">
                  Recent Tools Quick Access
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#111A2E] text-[#AAB8D0] border border-[#263653]">
                  0 / 5 tracked
                </span>
              </div>
              <p className="text-xs text-[#AAB8D0] mt-0.5">
                Tools you visit are saved locally in your browser for fast 1-click re-access.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#AAB8D0] text-[11px] hidden md:inline">Try launching:</span>
            <Link
              to="/tools/merge-pdf"
              className="px-2.5 py-1 rounded-lg bg-[#111A2E] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
            >
              Merge PDF
            </Link>
            <Link
              to="/tools/ai-image-generator"
              className="px-2.5 py-1 rounded-lg bg-[#111A2E] hover:bg-[#192744] border border-[#263653] text-[#4776FF] font-medium transition-colors"
            >
              AI Image Studio
            </Link>
            <Link
              to="/tools/gpa-calculator"
              className="px-2.5 py-1 rounded-lg bg-[#111A2E] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
            >
              GPA Calculator
            </Link>
            <Link
              to="/tools/image-compressor"
              className="px-2.5 py-1 rounded-lg bg-[#111A2E] hover:bg-[#192744] border border-[#263653] text-[#F8FAFF] font-medium transition-colors"
            >
              Image Compressor
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-4">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0D1424] via-[#111B30] to-[#0D1424] border border-[#263653] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4776FF]/20 to-[#8957FF]/20 border border-[#4776FF]/30 flex items-center justify-center text-[#4776FF] shadow-inner">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#F8FAFF] tracking-tight">
                Recently Visited Tools
              </h2>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#4776FF]/20 text-[#4776FF] border border-[#4776FF]/40">
                {recentTools.length} of 5
              </span>
            </div>
            <p className="text-xs text-[#AAB8D0] mt-0.5 hidden sm:block">
              Jump back into your recent studio workflows instantly from local storage.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#AAB8D0] hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-[#263653] hover:border-rose-900 transition-all shrink-0"
          title="Clear recent tool history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      {/* Grid of Recent Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentTools.map((tool, index) => (
          <Link
            key={tool.slug}
            to={`/tools/${tool.slug}`}
            className="group p-4 rounded-2xl bg-[#0D1424] border border-[#263653] hover:border-[#4776FF] hover:shadow-xl hover:shadow-[#4776FF]/10 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Top Index & Mode Badge */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-[#AAB8D0] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#4776FF]" />
                  <span>#{index + 1} Recent</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md font-semibold ${
                  tool.isFreeClientSide
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    : 'bg-indigo-950/60 text-[#4776FF] border border-indigo-800'
                }`}>
                  {tool.isFreeClientSide ? 'Client' : 'AI'}
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <span className="text-[10px] text-[#AAB8D0] uppercase font-mono tracking-wider block">
                  {tool.category.replace('-', ' ')}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors line-clamp-1 mt-0.5">
                  {tool.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[11px] text-[#AAB8D0] line-clamp-2 leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-[#263653]/60 flex items-center justify-between text-xs text-[#4776FF] font-semibold mt-3">
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
