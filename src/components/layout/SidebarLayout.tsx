import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PenTool,
  LayoutDashboard,
  Grid,
  FileText,
  Image as ImageIcon,
  Share2,
  GraduationCap,
  BookOpen,
  History,
  Heart,
  Settings,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import { TOOL_CATEGORIES } from '../../data/toolsData';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ThemeMode } from '../../utils/themeUtils';

interface SidebarLayoutProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  theme,
  onToggleTheme,
  onOpenSearch,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-[#070B14] text-[#F8FAFF]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0A0E1A] border-r border-[#263653] flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#263653] flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-[#F8FAFF]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white flex items-center justify-center font-bold shadow-md">
              <PenTool className="w-4 h-4" />
            </div>
            <span>
              WriteGenius <span className="text-[#4776FF] text-xs font-semibold">Studio</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-[#AAB8D0] hover:text-white rounded-lg bg-[#111B30]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive('/')
                  ? 'bg-gradient-to-r from-[#4776FF]/20 to-[#8957FF]/20 text-[#4776FF] border border-[#4776FF]/30'
                  : 'text-[#AAB8D0] hover:bg-[#111B30] hover:text-[#F8FAFF]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/tools"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive('/tools')
                  ? 'bg-gradient-to-r from-[#4776FF]/20 to-[#8957FF]/20 text-[#4776FF] border border-[#4776FF]/30'
                  : 'text-[#AAB8D0] hover:bg-[#111B30] hover:text-[#F8FAFF]'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>All 60 Tools</span>
            </Link>
          </div>

          {/* Expandable Tool Categories */}
          <div className="space-y-1.5">
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#AAB8D0] hover:text-white transition-colors"
            >
              <span>Tool Suites</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  categoriesExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {categoriesExpanded && (
              <div className="space-y-1 pl-2 border-l border-[#263653] ml-3 pt-1">
                {TOOL_CATEGORIES.map((cat) => {
                  const catPath = `/category/${cat.id}`;
                  const isCatActive = location.pathname === catPath;
                  return (
                    <Link
                      key={cat.id}
                      to={catPath}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isCatActive
                          ? 'bg-[#4776FF]/15 text-[#4776FF] font-semibold'
                          : 'text-[#AAB8D0] hover:bg-[#111B30] hover:text-[#F8FAFF]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4776FF]" />
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guides & Resources */}
          <div className="space-y-1">
            <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#AAB8D0]">
              Resources
            </div>
            <Link
              to="/guides"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                location.pathname.startsWith('/guides')
                  ? 'bg-[#4776FF]/15 text-[#4776FF] font-semibold'
                  : 'text-[#AAB8D0] hover:bg-[#111B30] hover:text-[#F8FAFF]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#8957FF]" />
              <span>Guides & Tutorials</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer / Account */}
        <div className="p-4 border-t border-[#263653] space-y-3 bg-[#070B14]/50">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#111B30] border border-[#263653]">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-[#4776FF]/20 text-[#4776FF] flex items-center justify-center shrink-0">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#F8FAFF] truncate">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Pro Studio</div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1.5 text-[#AAB8D0] hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-semibold text-center text-[#F8FAFF] bg-[#111B30] hover:bg-[#192744] border border-[#263653] rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2 text-xs font-semibold text-center text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] rounded-xl shadow-md transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 w-full bg-[#070B14]/90 backdrop-blur-md border-b border-[#263653] h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#AAB8D0] hover:text-white bg-[#0D1426] border border-[#263653] rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-3 px-4 py-2 text-xs text-[#AAB8D0] bg-[#0D1426] hover:bg-[#111B30] rounded-xl border border-[#263653] transition-colors w-64 sm:w-80 shadow-inner"
            >
              <Search className="w-4 h-4 text-[#4776FF]" />
              <span className="flex-1 text-left">Search all 60 tools...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#050811] border border-[#263653] rounded text-[#AAB8D0]">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton />
            <Link
              to="/tools/ai-image-generator"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white text-xs font-semibold shadow-lg hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Studio</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
