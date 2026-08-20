import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AppCategory } from '../types';
import { useApp } from '../context/AppContext';

interface CategoryTabsProps {
  categories?: AppCategory[];
  activeCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
}

const getCategoryDisplayName = (category: AppCategory): string => {
  return (category.name || '').toUpperCase();
};

export const CategoryTabs: React.FC<CategoryTabsProps> = (props) => {
  const appContext = useApp();
  const { theme, toggleTheme, currency, toggleCurrency } = appContext;

  const categories = props.categories || appContext.categories;
  const activeCategoryId = props.activeCategoryId || appContext.activeCategoryId;
  const onSelectCategory = props.onSelectCategory || appContext.setActiveCategoryId;

  const isDark = theme === 'dark';

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 mb-8 sm:mb-10 flex justify-center">
      {/* Unified Border Container: wraps cleanly so all buttons are fully visible on mobile, tablet & desktop */}
      <div
        className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border w-full sm:w-auto max-w-full ${
          isDark
            ? 'bg-[#0f0f0f] border-white/20 shadow-lg shadow-black/40'
            : 'bg-gray-100 border-gray-300 shadow-sm'
        }`}
      >
        {/* Category Buttons */}
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          const displayName = getCategoryDisplayName(category);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              className={`group flex items-center justify-center px-2.5 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer select-none border-0 ${
                isActive
                  ? 'bg-[#eab308] text-black shadow-sm'
                  : isDark
                  ? 'text-gray-400 hover:text-black hover:bg-white'
                  : 'bg-black text-white hover:bg-[#eab308] hover:text-black'
              }`}
            >
              <span>{displayName}</span>
            </button>
          );
        })}

        {/* Currency Switcher */}
        <button
          onClick={toggleCurrency}
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          className={`group flex items-center justify-center gap-1 px-2.5 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer select-none border-0 ${
            isDark
              ? 'bg-[#1a1a1a] hover:bg-white text-gray-300 hover:text-black'
              : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-xs'
          }`}
          title={`Currency is currently in ${currency}. Click to switch to ${
            currency === 'TZS' ? 'USD ($)' : 'TZS (TSh)'
          }`}
        >
          <span>CURRENCY:</span>
          <span
            className={
              currency === 'TZS'
                ? isDark
                  ? 'text-[#eab308] font-black'
                  : 'text-[#eab308] group-hover:text-black font-black'
                : 'opacity-50'
            }
          >
            TZS
          </span>
          <span className="opacity-40">/</span>
          <span
            className={
              currency === 'USD'
                ? isDark
                  ? 'text-[#eab308] font-black'
                  : 'text-[#eab308] group-hover:text-black font-black'
                : 'opacity-50'
            }
          >
            USD
          </span>
        </button>

        {/* Light / Dark Mode Button placed right after Currency in the Category bar */}
        <button
          onClick={toggleTheme}
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          className={`group flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer select-none border-0 ${
            isDark
              ? 'bg-[#1a1a1a] hover:bg-white text-gray-300 hover:text-black'
              : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-xs'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#eab308] group-hover:text-black transition-colors" />
              <span>LIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#eab308] group-hover:text-black transition-colors" />
              <span>DARK</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
