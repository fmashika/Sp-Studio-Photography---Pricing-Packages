import React from 'react';
import { SpLogo } from './SpLogo';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onSecretAdminTrigger?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { theme } = useApp();

  // Instant reload and refresh when user touches or clicks header logo or SP STUDIO text
  const handleReload = () => {
    window.location.reload();
  };

  const isDark = theme === 'dark';

  return (
    <header className="relative pt-6 pb-4 md:pt-10 md:pb-6 text-center px-4 flex flex-col items-center select-none">
      {/* Brand Logo - Touching/clicking reloads and refreshes the website */}
      <div
        onClick={handleReload}
        className="relative mb-2 group cursor-pointer active:scale-95 transition-transform"
        title="Sp Studio - Click to refresh"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleReload();
          }
        }}
      >
        <div
          className={`absolute inset-0 rounded-full blur-lg transition-all duration-300 ${
            isDark
              ? 'bg-[#eab308]/10 group-hover:bg-[#eab308]/20'
              : 'bg-[#eab308]/20 group-hover:bg-[#eab308]/30'
          }`}
        />
        <div className="relative transform group-hover:scale-105 transition-transform duration-300">
          <SpLogo size="lg" showStudioText={false} />
        </div>
      </div>

      {/* Brand Title: SP STUDIO - Touching/clicking reloads and refreshes the website */}
      <h1
        onClick={handleReload}
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black tracking-[0.12em] uppercase drop-shadow-sm cursor-pointer active:opacity-80 transition-opacity select-none ${
          isDark ? 'text-white' : 'text-gray-950'
        }`}
        title="Sp Studio - Click to refresh"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleReload();
          }
        }}
      >
        SP STUDIO
      </h1>

      {/* Below SP STUDIO: Price & Packages (without icon) */}
      <div className="mt-2 mb-1">
        <span
          className="text-[#ca8a04] dark:text-[#eab308] text-xs sm:text-sm md:text-base font-extrabold tracking-[0.22em] uppercase"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Price & Packages
        </span>
      </div>
    </header>
  );
};
