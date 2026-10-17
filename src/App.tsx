import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { FaqPage } from './pages/FaqPage';
import { ImageFormatGuidePage } from './pages/ImageFormatGuidePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { getInitialTheme, applyTheme, ThemeMode } from './utils/themeUtils';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Global event listener for custom search trigger
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    window.addEventListener('open-tool-search', handleOpenSearch);
    return () => window.removeEventListener('open-tool-search', handleOpenSearch);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      message,
      type,
    };
    setToasts(prev => [...prev.slice(-3), newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F8FAFF] transition-colors selection:bg-[#4776FF]/30">
          <Navbar
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenSearch={() => setSearchOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<AllToolsPage />} />
              <Route path="/login" element={<LoginPage onShowToast={showToast} />} />
              <Route path="/signup" element={<SignupPage onShowToast={showToast} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage onShowToast={showToast} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage onShowToast={showToast} />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/guides/image-formats" element={<ImageFormatGuidePage />} />

              {/* Individual dedicated tool pages (60 tools) */}
              <Route path="/:slug" element={<ToolDetailPage onShowToast={showToast} />} />

              {/* 404 handler */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />

          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <NotificationToast toasts={toasts} onDismiss={dismissToast} />
          <OfflineIndicator />
        </div>
      </Router>
    </AuthProvider>
  );
}
