import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SubscriptionTier } from '../types/tools';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingRedirectUrl: string | null;
  setPendingRedirectUrl: (url: string | null) => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  upgradeToPremium: () => Promise<void>;
  downgradeToFree: () => Promise<void>;
  canUseAiGeneration: () => { allowed: boolean; remaining: number; reason?: string };
  recordAiUsage: () => void;
  showAuthModal: boolean;
  openAuthModal: (intendedUrl?: string) => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY = 'wg_auth_user';
const USAGE_KEY = 'wg_daily_usage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load user from storage on initial boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        // Refresh daily usage count if date has changed
        const todayStr = new Date().toISOString().split('T')[0];
        const lastUsage = localStorage.getItem(USAGE_KEY);
        let usageToday = parsed.aiUsageCountToday || 0;

        if (lastUsage) {
          const { date, count } = JSON.parse(lastUsage);
          if (date === todayStr) {
            usageToday = count;
          } else {
            usageToday = 0;
            localStorage.setItem(USAGE_KEY, JSON.stringify({ date: todayStr, count: 0 }));
          }
        }
        setUser({ ...parsed, aiUsageCountToday: usageToday });
      }
    } catch (e) {
      console.warn('Failed to parse auth user from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserToStorage = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Basic validation
      if (!email.includes('@') || pass.length < 6) {
        return { success: false, error: 'Please enter a valid email and a password with at least 6 characters.' };
      }

      // Check registered accounts in localStorage
      const accountsKey = 'wg_registered_accounts';
      const storedAccounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
      const match = storedAccounts.find((a: any) => a.email.toLowerCase() === email.toLowerCase());

      const todayStr = new Date().toISOString().split('T')[0];
      const displayName = match?.displayName || email.split('@')[0];
      const tier: SubscriptionTier = match?.subscriptionTier || 'free';

      const userProfile: UserProfile = {
        uid: match?.uid || `user_${Date.now()}`,
        email,
        displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        subscriptionTier: tier,
        aiUsageCountToday: 0,
        dailyAiLimit: tier === 'premium' ? 9999 : 10,
        savedToolsCount: 0,
        createdAt: match?.createdAt || todayStr,
      };

      saveUserToStorage(userProfile);
      setShowAuthModal(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!name.trim()) {
        return { success: false, error: 'Please provide your full name.' };
      }
      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (pass.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const newUid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const userProfile: UserProfile = {
        uid: newUid,
        email,
        displayName: name.trim(),
        subscriptionTier: 'free',
        aiUsageCountToday: 0,
        dailyAiLimit: 10,
        savedToolsCount: 0,
        createdAt: todayStr,
      };

      // Save to registered accounts list
      const accountsKey = 'wg_registered_accounts';
      const storedAccounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
      storedAccounts.push({ ...userProfile, passwordHash: 'stored_securely' });
      localStorage.setItem(accountsKey, JSON.stringify(storedAccounts));

      saveUserToStorage(userProfile);
      setShowAuthModal(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    saveUserToStorage(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    return { success: true };
  };

  const upgradeToPremium = async () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      subscriptionTier: 'premium',
      dailyAiLimit: 9999,
      planRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    saveUserToStorage(updated);
  };

  const downgradeToFree = async () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      subscriptionTier: 'free',
      dailyAiLimit: 10,
      planRenewalDate: undefined,
    };
    saveUserToStorage(updated);
  };

  const canUseAiGeneration = (): { allowed: boolean; remaining: number; reason?: string } => {
    if (!user) {
      return { allowed: false, remaining: 0, reason: 'Please sign in to execute tools.' };
    }
    if (user.subscriptionTier === 'premium') {
      return { allowed: true, remaining: 9999 };
    }
    const remaining = Math.max(0, user.dailyAiLimit - user.aiUsageCountToday);
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        reason: 'You have reached your daily Free tier limit of 10 AI generations. Upgrade to Premium for unlimited access.',
      };
    }
    return { allowed: true, remaining };
  };

  const recordAiUsage = () => {
    if (!user) return;
    const newCount = user.aiUsageCountToday + 1;
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: todayStr, count: newCount }));

    const updated = { ...user, aiUsageCountToday: newCount };
    saveUserToStorage(updated);
  };

  const openAuthModal = (intendedUrl?: string) => {
    if (intendedUrl) {
      setPendingRedirectUrl(intendedUrl);
    }
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        pendingRedirectUrl,
        setPendingRedirectUrl,
        signIn,
        signUp,
        signOut,
        resetPassword,
        upgradeToPremium,
        downgradeToFree,
        canUseAiGeneration,
        recordAiUsage,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
