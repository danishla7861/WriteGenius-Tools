import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ArrowRight, PenTool, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeMode } from '../../utils/themeUtils';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();

  const navLinks = [
    { name: 'All Tools', href: '/tools' },
    { name: 'AI Image Generator', href: '/tools/ai-image-generator' },
    { name: 'Image Guide', href: '/guides/image-formats' },
    { name: 'AI Writing', href: '/tools?category=ai-writing' },
    { name: 'PDF Tools', href: '/tools?category=pdf-tools' },
    { name: 'Image Tools', href: '/tools?category=image-tools' },
    { name: 'Student Tools', href: '/tools?category=student-tools' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070B14]/95 backdrop-blur-md border-b border-[#263653] text-[#F8FAFF] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#F8FAFF] whitespace-nowrap shrink-0 group focus:outline-none rounded-xl"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white flex items-center justify-center font-bold shadow-md">
            <PenTool className="w-4 h-4" />
          </div>
          <span>WriteGenius<span className="text-[#4776FF] font-semibold text-sm ml-1">Studio</span></span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-[#AAB8D0]">
          {navLinks.map((link) => {
            const isActive = location.pathname + location.search === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#F8FAFF] ${
                  isActive
                    ? 'text-[#4776FF] font-semibold'
                    : 'text-[#AAB8D0]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Search, Auth & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#AAB8D0] bg-[#0D1424] hover:bg-[#111B30] rounded-xl border border-[#263653] transition-colors"
            title="Search all 60 tools (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#4776FF]" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#090F1D] border border-[#263653] rounded text-[#AAB8D0]">
              ⌘K
            </kbd>
          </button>

          {/* Auth Controls */}
          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#263653] text-xs text-[#F8FAFF]">
                <UserIcon className="w-3.5 h-3.5 text-[#4776FF]" />
                <span className="font-semibold">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-[#AAB8D0] hover:text-[#F8FAFF] bg-[#0D1424] hover:bg-[#111B30] border border-[#263653] rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-[#F8FAFF] hover:text-[#4776FF] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 text-[#AAB8D0] hover:text-[#F8FAFF] bg-[#0D1424] border border-[#263653] rounded-xl"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#263653] bg-[#070B14] px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-xs font-medium rounded-xl text-[#AAB8D0] hover:bg-[#111B30] hover:text-[#F8FAFF]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#263653] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-950/60 border border-rose-800 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.displayName || user.email})</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-semibold text-[#F8FAFF] bg-[#0D1424] border border-[#263653] rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] rounded-xl shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
