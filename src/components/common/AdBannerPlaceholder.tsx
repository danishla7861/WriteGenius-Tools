import React from 'react';

interface AdBannerPlaceholderProps {
  slotId?: string;
  className?: string;
}

export const AdBannerPlaceholder: React.FC<AdBannerPlaceholderProps> = ({
  slotId = 'standard-banner',
  className = '',
}) => {
  return (
    <div
      aria-label="Advertisement Space"
      className={`w-full max-w-4xl mx-auto my-8 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center transition-colors ${className}`}
    >
      <div className="flex flex-col items-center justify-center py-3">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
          Sponsor / Monetization Placement
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          Clean publisher slot reserved for verified advertising networks (AdSense, Carbon Ads) or premium tools announcement.
        </p>
      </div>
    </div>
  );
};
