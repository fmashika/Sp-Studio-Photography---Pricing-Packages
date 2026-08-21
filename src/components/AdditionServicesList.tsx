import React, { useState, useMemo } from 'react';
import {
  Camera,
  Video,
  Tv,
  Aperture,
  Heart,
  Gem,
  Sparkles,
  Star,
  Award,
  Crown,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from 'lucide-react';
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
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group helpers for categorized filter dropdown / pills
  const getSubCategory = (pkg: PricingPackage): 'all' | 'crew' | 'shoots' | 'frames' => {
    const n = pkg.name.toLowerCase();
    if (n.includes('photographer') || n.includes('videographer') || n.includes('tv') || n.includes('drone') || n.includes('booth') || n.includes('streaming')) {
      return 'crew';
    }
    if (n.includes('shoot') || n.includes('wedding') || n.includes('engagement') || n.includes('party') || n.includes('maternity') || n.includes('photoshoot')) {
      return 'shoots';
    }
    if (n.includes('frame') || n.includes('photobook') || n.includes('wood') || n.includes('acrylic')) {
      return 'frames';
    }
    return 'crew';
  };

  const getServiceIcon = (pkg: PricingPackage) => {
    const iconType = pkg.iconType;
    const n = pkg.name.toLowerCase();
    if (iconType === 'camera' || n.includes('photo')) return <Camera className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'video' || n.includes('video')) return <Video className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'tv' || n.includes('screen') || n.includes('tv')) return <Tv className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'aperture' || n.includes('booth')) return <Aperture className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'heart' || n.includes('wedding')) return <Heart className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'gem' || n.includes('acrylic') || n.includes('engagement')) return <Gem className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'sparkles' || n.includes('party')) return <Sparkles className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'crown' || n.includes('a1')) return <Crown className="w-4 h-4 text-[#eab308]" />;
    if (iconType === 'award' || n.includes('frame') || n.includes('photobook')) return <Award className="w-4 h-4 text-[#eab308]" />;
    return <Star className="w-4 h-4 text-[#eab308]" />;
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.features && pkg.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      return getSubCategory(pkg) === selectedFilter;
    });
  }, [packages, searchQuery, selectedFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleBooking = (e: React.MouseEvent, pkg: PricingPackage) => {
    e.stopPropagation();
    onBook(pkg);
    if (onSelect) onSelect(pkg);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Search & Filter Header Bar */}
      <div
        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all ${
          isDark
            ? 'bg-[#0f0f0f]/90 border-white/10 shadow-lg'
            : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extra services, shoots, frames..."
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

          {/* Category Filter Pills / Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#eab308] shrink-0 hidden sm:inline-block" />
            {[
              { id: 'all', label: `All Services (${packages.length})` },
              { id: 'crew', label: 'Crew & Gear' },
              { id: 'shoots', label: 'Photo & Video Shoots' },
              { id: 'frames', label: 'Frames & Photobooks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`text-xs font-bold px-3 sm:px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? isDark
                      ? 'bg-[#eab308] text-black font-black shadow-sm'
                      : 'bg-black text-white font-black shadow-sm'
                    : isDark
                    ? 'bg-[#181818] hover:bg-[#222] text-gray-300 border border-white/10'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Addition Services Drop Lists Container */}
      <div className="space-y-3">
        {filteredPackages.length === 0 ? (
          <div
            className={`text-center py-16 px-4 rounded-3xl border ${
              isDark
                ? 'bg-[#0f0f0f]/70 border-white/10 text-gray-400'
                : 'bg-white border-gray-200 text-gray-600 shadow-sm'
            }`}
          >
            <p className="text-sm font-medium">No addition service matches your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="mt-3 text-xs font-black text-[#eab308] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPackages.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const displayedPrice = formatPrice(item.rawPrice, item.price);

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`group rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer select-none ${
                  item.featured || isExpanded
                    ? isDark
                      ? 'bg-[#141414] border-[#eab308]/60 shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                      : 'bg-white border-[#ca8a04]/60 shadow-md'
                    : isDark
                    ? 'bg-[#0e0e0e]/95 border-white/10 hover:border-white/25 hover:bg-[#141414]'
                    : 'bg-white/95 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Main Row */}
                <div className="p-3.5 sm:p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Icon & Service Title */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isDark ? 'bg-white/5 border border-white/10' : 'bg-amber-50 border border-amber-200'
                      }`}
                    >
                      {getServiceIcon(item)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs sm:text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <h3
                          className={`text-sm sm:text-base font-black tracking-tight truncate ${
                            isDark ? 'text-white' : 'text-gray-950'
                          }`}
                        >
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="bg-[#eab308] text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Brief helper info on mobile if not expanded */}
                      {item.features && item.features.length > 0 && (
                        <p
                          className={`text-xs mt-0.5 truncate hidden md:block ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {item.features[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Price & Small BOOK NOW Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/5">
                    {/* Price Display */}
                    <div className="text-left sm:text-right">
                      <span className="text-xs sm:text-[10px] text-gray-500 uppercase font-bold block leading-tight">
                        Price
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-extrabold text-[#ca8a04] dark:text-[#eab308] tracking-tight">
                        {displayedPrice}
                      </span>
                    </div>

                    {/* Small prominent BOOK NOW button directly after price */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleBooking(e, item)}
                        className={`flex items-center justify-center gap-1.5 text-xs font-black px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shrink-0 shadow-sm ${
                          isDark
                            ? 'bg-[#eab308] hover:bg-white text-black hover:text-black shadow-[#eab308]/20'
                            : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-black/10'
                        }`}
                        title={`Book ${item.name} (${displayedPrice})`}
                      >
                        <span>BOOK NOW</span>
                      </button>

                      {/* Expand / Collapse Indicator */}
                      <button
                        type="button"
                        className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                        }`}
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#eab308]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drop List Accordion Details (When expanded or item has extra notes) */}
                {isExpanded && item.features && item.features.length > 0 && (
                  <div
                    className={`px-4 sm:px-5 pb-4 pt-2 text-xs border-t transition-all ${
                      isDark
                        ? 'bg-black/30 border-white/10 text-gray-300'
                        : 'bg-amber-50/50 border-amber-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-bold text-[#ca8a04] dark:text-[#eab308] uppercase text-[10px] tracking-wider block mb-1">
                          Service Details & Inclusions
                        </span>
                        <ul className="space-y-1.5">
                          {item.features.map((f, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={(e) => handleBooking(e, item)}
                        className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#ca8a04] dark:text-[#eab308] hover:underline shrink-0"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Reserve Add-on</span>
                      </button>
                    </div>
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
