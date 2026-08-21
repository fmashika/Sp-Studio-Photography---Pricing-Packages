import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { PricingPackage } from '../types';
import { useApp } from '../context/AppContext';

interface AdditionServicesListProps {
  packages: PricingPackage[];
  onBook: (pkg: PricingPackage) => void;
  onSelect?: (pkg: PricingPackage) => void;
}

export const AdditionServicesList: React.FC<AdditionServicesListProps> = ({
  packages,
  onBook,
  onSelect,
}) => {
  const { theme, formatPrice } = useApp();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const q = searchQuery.toLowerCase();
      return (
        pkg.name.toLowerCase().includes(q) ||
        pkg.price.toLowerCase().includes(q) ||
        (pkg.features && pkg.features.some((f) => f.toLowerCase().includes(q)))
      );
    });
  }, [packages, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleBooking = (e: React.MouseEvent, pkg: PricingPackage) => {
    e.stopPropagation();
    onBook(pkg);
    if (onSelect) onSelect(pkg);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-3 sm:py-5 space-y-4">
      {/* Fast Search Input */}
      <div
        className={`p-3 sm:p-4 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#0f0f0f]/90 border-white/10 shadow-md'
            : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search addition services..."
            className={`w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border transition-colors focus:outline-none ${
              isDark
                ? 'bg-[#181818] border-white/10 text-white placeholder-gray-500 focus:border-[#eab308]'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#ca8a04]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Fresh Bullet Drop Lists with only bullets and BOOK NOW button */}
      <div className="space-y-2 sm:space-y-2.5">
        {filteredPackages.length === 0 ? (
          <div
            className={`text-center py-12 px-4 rounded-2xl border ${
              isDark
                ? 'bg-[#0f0f0f]/70 border-white/10 text-gray-400'
                : 'bg-white border-gray-200 text-gray-600 shadow-sm'
            }`}
          >
            <p className="text-sm font-medium">No addition service matches your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-black text-[#ca8a04] dark:text-[#eab308] hover:underline"
            >
              Show all services
            </button>
          </div>
        ) : (
          filteredPackages.map((item) => {
            const isExpanded = expandedId === item.id;
            const displayedPrice = formatPrice(item.rawPrice, item.price);

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`group rounded-2xl border transition-all duration-150 overflow-hidden cursor-pointer select-none ${
                  isExpanded
                    ? isDark
                      ? 'bg-[#141414] border-[#eab308]/70 shadow-md'
                      : 'bg-white border-[#ca8a04]/70 shadow-md'
                    : isDark
                    ? 'bg-[#0e0e0e] border-white/10 hover:border-white/20 hover:bg-[#121212]'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                {/* Main List Item Row */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Bullet Dot + Service Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-2 h-2 rounded-full bg-[#ca8a04] dark:bg-[#eab308] shrink-0 inline-block" />
                    <h3
                      className={`text-sm sm:text-base font-extrabold tracking-tight truncate ${
                        isDark ? 'text-white' : 'text-gray-950'
                      }`}
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Right: Price + BOOK NOW button + drop toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/5">
                    {/* Price */}
                    <div className="text-left sm:text-right">
                      <span className="text-sm sm:text-base font-black text-[#ca8a04] dark:text-[#eab308] tracking-tight">
                        {displayedPrice}
                      </span>
                    </div>

                    {/* BOOK NOW Button */}
                    <button
                      onClick={(e) => handleBooking(e, item)}
                      className={`flex items-center justify-center text-xs font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shrink-0 shadow-sm ${
                        isDark
                          ? 'bg-[#eab308] hover:bg-white text-black hover:text-black shadow-[#eab308]/20'
                          : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-black/10'
                      }`}
                      title={`Book ${item.name} (${displayedPrice})`}
                    >
                      <span>BOOK NOW</span>
                    </button>

                    {/* Drop Down Toggle Indicator */}
                    <div
                      className={`p-1 rounded-lg transition-colors ${
                        isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-black'
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#ca8a04] dark:text-[#eab308]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Dropdown Inclusions with Bullets */}
                {isExpanded && item.features && item.features.length > 0 && (
                  <div
                    className={`px-4 sm:px-6 pb-4 pt-2 text-xs border-t transition-all ${
                      isDark
                        ? 'bg-black/40 border-white/10 text-gray-300'
                        : 'bg-amber-50/40 border-amber-100 text-gray-700'
                    }`}
                  >
                    <ul className="space-y-1.5 pt-1">
                      {item.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] dark:bg-[#eab308] shrink-0 mt-1" />
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
