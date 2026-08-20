import React from 'react';
import { PricingPackage } from '../types';
import { useApp } from '../context/AppContext';

interface PackageCardProps {
  pkg: PricingPackage;
  onBook?: (pkg: PricingPackage) => void;
  onSelect?: (pkg: PricingPackage) => void;
  isSelected?: boolean;
  onCardClick?: (pkg: PricingPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onBook,
  onSelect,
  isSelected,
  onCardClick,
}) => {
  const { theme, formatPrice, packageTitleFontSizePercent } = useApp();
  const isDark = theme === 'dark';

  const displayedPrice = formatPrice(pkg.rawPrice, pkg.price);

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBook) onBook(pkg);
    else if (onSelect) onSelect(pkg);
  };

  const handleCard = () => {
    if (onCardClick) onCardClick(pkg);
  };

  // Calculated title font size in px based on packageTitleFontSizePercent (1% to 100%)
  const calculatedTitlePx = Math.max(10, Math.round((28 * packageTitleFontSizePercent) / 100));

  return (
    <div className="relative pt-3 sm:pt-3.5 flex flex-col h-full">
      {/* Custom Badge / Pill (Optional) - Elevated above the package without any clipping */}
      {pkg.badge && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap pointer-events-none">
          <span className="inline-flex items-center justify-center bg-[#eab308] text-black text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-lg border border-black/15">
            {pkg.badge}
          </span>
        </div>
      )}

      {/* Package Card Container */}
      <div
        onClick={handleCard}
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          WebkitTapHighlightColor: 'transparent',
        }}
        className={`group relative rounded-3xl flex flex-col justify-between transition-all duration-300 p-6 sm:p-7 md:p-8 cursor-pointer select-none overflow-hidden backdrop-blur-xl touch-manipulation active:scale-[0.99] h-full ${
          pkg.featured || isSelected
            ? isDark
              ? 'bg-[#0f0f0f]/95 border-2 border-[#eab308]/70 shadow-[0_0_30px_rgba(234,179,8,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] active:shadow-[0_0_40px_rgba(255,255,255,0.4),0_0_30px_rgba(234,179,8,0.5),inset_0_1px_3px_rgba(255,255,255,0.8)]'
              : 'bg-white/95 border-2 border-[#ca8a04] shadow-[0_8px_30px_rgba(202,138,4,0.22),0_0_25px_rgba(234,179,8,0.3)] active:shadow-[0_0_35px_rgba(234,179,8,0.5),0_12px_35px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(255,255,255,1)]'
            : isDark
            ? 'bg-[#0b0b0b]/90 border border-white/15 hover:border-[#eab308]/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.22),inset_0_1px_1px_rgba(255,255,255,0.3)] active:border-white/60 active:bg-[#151515]/95 active:shadow-[0_0_40px_rgba(255,255,255,0.35),0_0_25px_rgba(234,179,8,0.45),inset_0_1px_3px_rgba(255,255,255,0.7)]'
            : 'bg-white/90 border border-gray-200 hover:border-[#ca8a04]/70 hover:shadow-[0_0_25px_rgba(234,179,8,0.3),0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] active:border-[#ca8a04] active:bg-white active:shadow-[0_0_35px_rgba(234,179,8,0.45),0_12px_35px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(255,255,255,1)]'
        }`}
      >
        {/* Glass Gloss Sheen Highlight Overlay */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none rounded-t-3xl transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 opacity-60" />

        {/* Package Header */}
        <div className="relative z-10">
          <div className="text-center pb-6 border-b border-black/10 dark:border-white/10">
            <h3
              style={{
                fontSize: `${calculatedTitlePx}px`,
                lineHeight: 1.15,
              }}
              className={`font-black uppercase tracking-[0.06em] transition-all duration-150 ${
                isDark ? 'text-white' : 'text-gray-950'
              }`}
            >
              {pkg.name}
            </h3>

            {/* Dynamic Price Display (TZS / USD) */}
            <div className="mt-2.5">
              <span className="text-lg sm:text-xl font-extrabold text-[#ca8a04] dark:text-[#eab308] tracking-tight block">
                {displayedPrice}
              </span>
            </div>
          </div>

          {/* Deliverables / Features List with Simple Bullets: Bold in light mode, normal in dark mode */}
          <div className="py-6 space-y-6">
            {pkg.sections && pkg.sections.length > 0 ? (
              pkg.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#ca8a04] dark:text-[#eab308]">
                    {section.subtitle}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        className={`text-xs sm:text-[13px] leading-relaxed flex items-start gap-2.5 ${
                          isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] dark:bg-[#eab308] shrink-0 mt-1.5 inline-block" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul className="space-y-2.5">
                {pkg.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`text-xs sm:text-[13px] leading-relaxed flex items-start gap-2.5 ${
                      isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] dark:bg-[#eab308] shrink-0 mt-1.5 inline-block" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Booking Action Button: Icon removed, only BOOK NOW, light mode black -> hover yellow */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 relative z-10">
          <button
            onClick={handleBooking}
            className={`w-full flex items-center justify-center font-extrabold text-xs sm:text-sm py-3.5 sm:py-4 px-4 rounded-2xl transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              isDark
                ? 'bg-[#eab308] hover:bg-white text-white hover:text-black shadow-lg shadow-[#eab308]/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-lg shadow-black/15'
            }`}
          >
            <span className="tracking-wider uppercase">BOOK NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
