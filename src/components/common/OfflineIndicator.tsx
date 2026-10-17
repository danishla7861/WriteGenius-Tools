import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Wifi, CheckCircle2, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-semibold shadow-2xl backdrop-blur-md animate-fade-in">
        <Wifi className="w-4 h-4 text-emerald-400" />
        <span>Back online! All cloud & AI services restored.</span>
      </div>
    );
  }

  return (
    <aside aria-label="Offline status banner" className="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:max-w-md z-50 p-4 rounded-2xl bg-[#0D1424]/95 border-2 border-[#4776FF] text-[#F8FAFF] shadow-2xl backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <WifiOff className="w-4 h-4" />
          <span>You are offline — Link & App are working!</span>
        </div>
      </div>
      <p className="text-[11px] text-[#AAB8D0] leading-relaxed">
        WriteGenius Studio runs seamlessly offline. All 50+ client-side tools (PDF merge/split, image compression, GPA calculators, and counters) work directly in your browser without internet.
      </p>
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium pt-1 border-t border-[#263653]">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Zero data loss · Client-side offline cache active</span>
      </div>
    </aside>
  );
};
