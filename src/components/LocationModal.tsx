import React from 'react';
import { X, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpLogo } from './SpLogo';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { contacts, theme } = useApp();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0d0d0d] border border-white/20 text-white'
            : 'bg-white border border-gray-200 text-gray-900 shadow-[0_10px_40px_rgba(0,0,0,0.2)]'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
            isDark
              ? 'text-gray-400 hover:text-black hover:bg-white bg-[#1c1c1c] border border-white/10'
              : 'text-gray-500 hover:text-black hover:bg-gray-100 bg-gray-100 border border-gray-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <SpLogo size="sm" showStudioText={false} className="shrink-0" />
          <div className="w-9 h-9 rounded-xl bg-[#eab308]/15 border border-[#eab308]/30 flex items-center justify-center text-[#ca8a04] dark:text-[#eab308] shadow-sm">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <span className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-[0.2em] uppercase">
          OUR STUDIO
        </span>
        <h3
          className={`text-2xl font-bold mb-1 mt-0.5 ${
            isDark ? 'text-white' : 'text-gray-950'
          }`}
        >
          Location & Access
        </h3>
        <p className="text-[#ca8a04] dark:text-[#eab308] font-bold text-sm mb-5">
          {contacts.location}
        </p>

        <div className="space-y-3.5 text-sm mb-6">
          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDark
                ? 'bg-[#171717] border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Navigation className="w-4 h-4 text-[#ca8a04] dark:text-[#eab308] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-wider uppercase">
                Address
              </p>
              <p
                className={`font-medium text-xs sm:text-sm mt-0.5 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {contacts.locationDetails}
              </p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDark
                ? 'bg-[#171717] border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4 text-[#ca8a04] dark:text-[#eab308] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-wider uppercase">
                Studio Hours
              </p>
              <p
                className={`font-medium text-xs sm:text-sm mt-0.5 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Monday – Saturday: 08:30 AM – 07:00 PM
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Sunday / Events: By Appointment
              </p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
              isDark
                ? 'bg-[#171717] border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Phone className="w-4 h-4 text-[#ca8a04] dark:text-[#eab308] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-wider uppercase">
                Direct Line
              </p>
              <p
                className={`font-medium text-xs sm:text-sm mt-0.5 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {contacts.phoneFormatted}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              contacts.location + ' ' + contacts.locationDetails
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg transition-all duration-200 ${
              isDark
                ? 'bg-[#eab308] hover:bg-white text-white hover:text-black shadow-[#eab308]/25 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-black/20'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>

          <button
            onClick={onClose}
            className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              isDark
                ? 'text-gray-400 hover:text-black hover:bg-white'
                : 'text-gray-700 hover:text-black hover:bg-[#eab308]/20'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
