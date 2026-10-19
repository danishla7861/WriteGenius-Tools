import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Cpu } from 'lucide-react';
import { ToolDefinition } from '../../types/tools';

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const toolUrl = tool.slug === 'text-design-tool' ? '/text-design-tool' : `/tools/${tool.slug}`;
  return (
    <Link
      to={toolUrl}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0D1424] border border-[#263653] hover:border-[#4776FF] hover:shadow-xl hover:shadow-[#4776FF]/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4776FF] hover:-translate-y-0.5"
    >
      <div>
        {/* Unboxed Metadata Header */}
        <div className="flex items-center justify-between text-xs text-[#AAB8D0] mb-3">
          <div className="flex items-center gap-1.5 font-medium">
            {tool.isFreeClientSide ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400/90">Instant Free Utility</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#4776FF]" />
                <span className="text-[#4776FF]">AI Studio Tool</span>
              </>
            )}
          </div>
          {tool.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111B30] text-[#4776FF] border border-[#263653]">
              {tool.badge}
            </span>
          )}
        </div>

        {/* Lead directly with primary title */}
        <h3 className="text-base font-bold text-[#F8FAFF] group-hover:text-[#4776FF] transition-colors flex items-center justify-between">
          <span>{tool.title}</span>
          <ArrowUpRight className="w-4 h-4 text-[#AAB8D0] group-hover:text-[#4776FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </h3>

        <p className="text-xs text-[#AAB8D0] mt-2 leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer indicator */}
      <div className="mt-5 pt-3 border-t border-[#263653] flex items-center justify-between text-xs text-[#AAB8D0]">
        <span className="capitalize">{tool.category.replace('-', ' ')}</span>
        <span className="font-semibold text-[#4776FF] group-hover:text-blue-300 transition-colors flex items-center gap-1">
          Open Tool →
        </span>
      </div>
    </Link>
  );
};
