import React, { useRef } from 'react';
import { Mail, Phone, Instagram, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpLogo } from './SpLogo';

interface FooterProps {
  onOpenLocation: () => void;
  onSecretAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLocation, onSecretAdminTrigger }) => {
  const { contacts, theme } = useApp();
  const isDark = theme === 'dark';
  const lastTapRef = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 400; // ms
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (onSecretAdminTrigger) {
        onSecretAdminTrigger();
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <footer
      className={`mt-16 md:mt-24 border-t pt-12 pb-8 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark
          ? 'border-white/10 bg-black text-white'
          : 'border-gray-200 bg-white text-gray-900'
      }`}
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Brand & Contacts Grid */}
        <div className="space-y-6 pb-10">
          
          {/* Brand Header with Secret 2X Tap */}
          <div
            onClick={handleDoubleTap}
            onDoubleClick={onSecretAdminTrigger}
            className="flex items-center gap-3 cursor-pointer select-none w-fit"
            title="Sp Studio"
          >
            <SpLogo size="sm" showStudioText={false} className="shrink-0" />
            <h2
              className={`text-lg sm:text-xl font-black tracking-[0.15em] uppercase ${
                isDark ? 'text-white' : 'text-gray-950'
              }`}
            >
              SP STUDIO
            </h2>
          </div>

          {/* Contact Items Grid in Black, White and Gold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Email Card */}
            <a
              href={`mailto:${contacts.email}`}
              className={`group flex items-center gap-3.5 border p-4 rounded-2xl transition-all duration-200 ${
                isDark
                  ? 'bg-[#0f0f0f] hover:bg-[#181818] border-white/10 hover:border-[#eab308]/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                  : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-[#ca8a04]/50 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#eab308] group-hover:bg-[#eab308] group-hover:text-black transition-colors shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-widest uppercase mb-0.5">
                  EMAIL
                </p>
                <p
                  className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {contacts.email}
                </p>
              </div>
            </a>

            {/* Click to Call Card */}
            <a
              href={`tel:${contacts.phone}`}
              className={`group flex items-center gap-3.5 border p-4 rounded-2xl transition-all duration-200 ${
                isDark
                  ? 'bg-[#0f0f0f] hover:bg-[#181818] border-white/10 hover:border-[#eab308]/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                  : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-[#ca8a04]/50 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#eab308] group-hover:bg-[#eab308] group-hover:text-black transition-colors shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-widest uppercase mb-0.5">
                  CLICK TO CALL
                </p>
                <p
                  className={`text-xs sm:text-[13px] font-medium transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {contacts.phoneFormatted}
                </p>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={contacts.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3.5 border p-4 rounded-2xl transition-all duration-200 ${
                isDark
                  ? 'bg-[#0f0f0f] hover:bg-[#181818] border-white/10 hover:border-[#eab308]/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                  : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-[#ca8a04]/50 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#eab308] group-hover:bg-[#eab308] group-hover:text-black transition-colors shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-widest uppercase mb-0.5">
                  INSTAGRAM ACCOUNT
                </p>
                <p
                  className={`text-xs sm:text-[13px] font-medium transition-colors flex items-center gap-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <span>{contacts.instagram}</span>
                  <ExternalLink className="w-3 h-3 text-[#ca8a04] dark:text-[#eab308] opacity-70 group-hover:opacity-100" />
                </p>
              </div>
            </a>

            {/* Studio Location Card */}
            <button
              onClick={onOpenLocation}
              className={`group flex items-center gap-3.5 border p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-[#0f0f0f] hover:bg-[#181818] border-white/10 hover:border-[#eab308]/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                  : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-[#ca8a04]/50 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#eab308] group-hover:bg-[#eab308] group-hover:text-black transition-colors shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-widest uppercase mb-0.5">
                  STUDIO LOCATION
                </p>
                <p
                  className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {contacts.location}
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3 text-center sm:text-left ${
            isDark ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'
          }`}
        >
          <p>© {new Date().getFullYear()} SP STUDIO</p>
          <p className="tracking-widest uppercase text-[10px] text-[#ca8a04] dark:text-[#eab308] font-bold">
            ALL RIGHTS RESERVED
          </p>
        </div>

      </div>
    </footer>
  );
};
