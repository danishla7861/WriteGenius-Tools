import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Check, X, Smartphone, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, do not display
  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={installApp}
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-xl transition-all shadow-md shrink-0"
        title="Install WriteGenius Tools to your device for offline use"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#AAB8D0] hover:text-[#F8FAFF] bg-[#0D1424] border border-[#263653] hover:bg-[#111B30] rounded-xl transition-colors shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#4776FF]" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0D1424] border border-[#263653] p-6 shadow-2xl text-[#F8FAFF] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#F8FAFF]">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-[#AAB8D0] hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#AAB8D0] leading-relaxed">
                Install WriteGenius Tools to your home screen to use all PDF, image, and student tools offline anytime:
              </p>
              <div className="space-y-2 text-xs text-[#F8FAFF] p-3 rounded-xl bg-[#090F1D] border border-[#263653]">
                <div className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-[#4776FF]" />
                  <span>1. Tap the <strong>Share</strong> button in Safari toolbar.</span>
                </div>
                <div>2. Scroll down and tap <strong>Add to Home Screen</strong>.</div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] text-white text-xs font-semibold shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
