import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Cpu } from 'lucide-react';
import { ALL_TOOLS } from '../../data/toolsData';
import { ToolDefinition } from '../../types/tools';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredTools = React.useMemo(() => {
    if (!query.trim()) {
      return ALL_TOOLS.slice(0, 8); // top suggestions when empty
    }
    const q = query.toLowerCase();
    return ALL_TOOLS.filter(
      tool =>
        tool.title.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.slug.includes(q) ||
        tool.category.includes(q)
    ).slice(0, 10);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open from anywhere
          const event = new CustomEvent('open-tool-search');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectTool = (tool: ToolDefinition) => {
    onClose();
    navigate(`/${tool.slug}`);
  };

  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredTools.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelectTool(filteredTools[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070B14]/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="relative w-full max-w-xl bg-[#0D1424] rounded-2xl shadow-2xl border border-[#263653] overflow-hidden"
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDownInList}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#263653] bg-[#090F1D]">
          <Search className="w-5 h-5 text-[#4776FF] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type tool name, category or action (e.g. merge, compress, essay)..."
            className="w-full text-xs sm:text-sm bg-transparent text-[#F8FAFF] placeholder-[#AAB8D0]/50 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#AAB8D0] hover:text-[#F8FAFF] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-2 py-1 text-[10px] font-semibold text-[#AAB8D0] bg-[#111B30] border border-[#263653] rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#263653]/60 p-2">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tool.slug}
                  type="button"
                  onClick={() => handleSelectTool(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-[#111B30] text-[#F8FAFF]'
                      : 'text-[#AAB8D0] hover:bg-[#111B30]/60 hover:text-[#F8FAFF]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-[#F8FAFF] truncate">
                        {tool.title}
                      </span>
                      {tool.isFreeClientSide ? (
                        <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#4776FF] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#AAB8D0] truncate mt-0.5">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#070B14] border border-[#263653] text-[#AAB8D0]">
                      {tool.category.replace('-', ' ')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4776FF]" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-[#AAB8D0]">
              No tools found matching "{query}". Try another search term.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#090F1D] border-t border-[#263653] flex items-center justify-between text-[11px] text-[#AAB8D0]">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1.5 py-0.5 bg-[#111B30] border border-[#263653] rounded text-[10px] font-mono text-[#F8FAFF]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-[#111B30] border border-[#263653] rounded text-[10px] font-mono text-[#F8FAFF]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#111B30] border border-[#263653] rounded text-[10px] font-mono text-[#F8FAFF]">Enter</kbd> to select
            </span>
          </div>
          <span>{filteredTools.length} results</span>
        </div>
      </div>
    </div>
  );
};
