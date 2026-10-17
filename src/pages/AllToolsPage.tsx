import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, Cpu, Filter } from 'lucide-react';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolCategory } from '../types/tools';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

export const AllToolsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ToolCategory) || 'all';
  const initialSearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [filterType, setFilterType] = useState<'all' | 'free' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      // Category match
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Type match
      if (filterType === 'free' && !tool.isFreeClientSide) return false;
      if (filterType === 'ai' && !tool.isAi) return false;

      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tool.title.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.slug.includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, filterType, searchQuery]);

  const handleCategorySelect = (cat: ToolCategory | 'all') => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Studio Tools Directory' }]} />

      {/* Header */}
      <div className="space-y-2 border-b border-[#263653] pb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
          All {ALL_TOOLS.length} Online Tools
        </h1>
        <p className="text-sm text-[#AAB8D0] max-w-2xl leading-relaxed">
          Browse our complete catalog of AI writing tools, PDF utilities, image processors, social media assistants, and student utilities. Filter by category, execution mode, or keyword search.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#AAB8D0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#090F1D] border border-[#263653] text-[#F8FAFF] placeholder-[#AAB8D0] focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
          />
        </div>

        {/* Execution Type Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D1424] rounded-xl border border-[#263653] shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
            }`}
          >
            All ({ALL_TOOLS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('free')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              filterType === 'free'
                ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Utilities</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ai')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              filterType === 'ai'
                ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                : 'text-[#AAB8D0] hover:text-[#F8FAFF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>AI Studio</span>
          </button>
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#0D1424] rounded-2xl border border-[#263653]">
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
              : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
          }`}
        >
          All Categories
        </button>
        {TOOL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white shadow-md'
                : 'text-[#AAB8D0] hover:text-[#F8FAFF] hover:bg-[#111B30]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-[#0D1424] border border-[#263653] rounded-2xl max-w-md mx-auto">
          <p className="text-sm font-semibold text-[#F8FAFF]">No tools match your search criteria</p>
          <p className="text-xs text-[#AAB8D0]">Try clearing filters or searching for different keywords.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterType('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#4776FF] hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
