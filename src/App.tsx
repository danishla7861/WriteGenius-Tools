import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarLayout } from './components/layout/SidebarLayout';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { GuidesIndexPage } from './pages/GuidesIndexPage';
import { ImageFormatGuidePage } from './pages/ImageFormatGuidePage';
import { PdfOptimizationGuidePage } from './pages/PdfOptimizationGuidePage';
import { AcademicWritingGuidePage } from './pages/AcademicWritingGuidePage';
import { SocialMediaGrowthGuidePage } from './pages/SocialMediaGrowthGuidePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { FaqPage } from './pages/FaqPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { TextDesignToolPage } from './pages/TextDesignToolPage';
import { WebsiteDesignStudioPage } from './pages/WebsiteDesignStudioPage';
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
        <SidebarLayout
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenSearch={() => setSearchOpen(true)}
        >
          <Routes>
            {/* Core Index & Directories */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<AllToolsPage />} />

            {/* Dedicated Category Landing Pages */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* Guides & Tutorials Section */}
            <Route path="/guides" element={<GuidesIndexPage />} />
            <Route path="/guides/image-formats" element={<ImageFormatGuidePage />} />
            <Route path="/guides/pdf-optimization-guide" element={<PdfOptimizationGuidePage />} />
            <Route path="/guides/academic-writing-and-gpa-guide" element={<AcademicWritingGuidePage />} />
            <Route path="/guides/social-media-content-growth-guide" element={<SocialMediaGrowthGuidePage />} />

            {/* Authentication & Account Routes */}
            <Route path="/login" element={<LoginPage onShowToast={showToast} />} />
            <Route path="/signup" element={<SignupPage onShowToast={showToast} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage onShowToast={showToast} />} />

            {/* Legal, Help & Company Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage onShowToast={showToast} />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Dedicated Text Design Tool Page */}
            <Route path="/text-design-tool" element={<TextDesignToolPage onShowToast={showToast} />} />
            <Route path="/tools/website-design-studio" element={<WebsiteDesignStudioPage onShowToast={showToast} />} />

            {/* Individual Dedicated Tool Pages (/tools/:toolSlug AND /:slug for maximum discoverability) */}
            <Route path="/tools/:toolSlug" element={<ToolDetailPage onShowToast={showToast} />} />
            <Route path="/:slug" element={<ToolDetailPage onShowToast={showToast} />} />

            {/* 404 handler */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Footer />

          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <NotificationToast toasts={toasts} onDismiss={dismissToast} />
          <OfflineIndicator />
        </SidebarLayout>
      </Router>
    </AuthProvider>
  );
}
