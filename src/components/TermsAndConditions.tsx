import React from 'react';
import { ShieldCheck, MessageSquareText, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpLogo } from './SpLogo';

interface TermsAndConditionsProps {
  onOpenBooking?: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onOpenBooking }) => {
  const { terms, contacts, theme } = useApp();
  const isDark = theme === 'dark';

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      'Hello Sp Studio, I am reviewing your Terms & Conditions and have a question regarding booking & event coverage.'
    );
    window.open(`https://wa.me/${contacts.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      className="max-w-4xl mx-auto px-4"
    >
      {/* Header Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 text-center transition-all ${
          isDark
            ? 'bg-[#0e0e0e] border border-[#eab308]/30 shadow-[0_0_30px_rgba(234,179,8,0.06)]'
            : 'bg-white border border-[#ca8a04]/40 shadow-lg'
        }`}
      >
        <div className="flex justify-center mb-3">
          <SpLogo size="sm" showStudioText={false} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eab308]/15 border border-[#eab308]/30 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ca8a04] dark:text-[#eab308]" />
          <span className="text-[#ca8a04] dark:text-[#eab308] text-[10px] font-bold tracking-[0.2em] uppercase">
            STUDIO POLICY & GUIDELINES
          </span>
        </div>

        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-gray-950'
          }`}
        >
          Terms & Conditions
        </h2>
        <p
          className={`text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed ${
            isDark ? 'text-gray-400 font-normal' : 'text-gray-700 font-bold'
          }`}
        >
          Please read our booking terms and studio workflow guidelines to ensure seamless coverage of your special day.
        </p>
      </div>

      {/* Policy Sections Grid */}
      <div className="space-y-6">
        {terms.map((section, idx) => (
          <div
            key={section.id}
            className={`rounded-3xl p-6 sm:p-7 transition-all ${
              isDark
                ? 'bg-[#0b0b0b] border border-white/10 hover:border-white/20'
                : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-black/10 dark:border-white/10">
              <span className="w-7 h-7 rounded-xl bg-[#eab308]/15 border border-[#eab308]/40 text-[#ca8a04] dark:text-[#eab308] text-xs font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <h3
                className={`text-base sm:text-lg font-black uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-gray-950'
                }`}
              >
                {section.title}
              </h3>
            </div>

            {/* Simple Bullets Policy Points: bold in light mode, normal in dark mode */}
            <ul className="space-y-3">
              {section.points.map((point, pIdx) => (
                <li
                  key={pIdx}
                  className={`text-xs sm:text-sm leading-relaxed flex items-start gap-3 ${
                    isDark ? 'text-gray-300 font-normal' : 'text-gray-900 font-bold'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] dark:bg-[#eab308] shrink-0 mt-2 inline-block" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Quick Action Footer in Terms Page */}
      <div
        className={`mt-10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-all ${
          isDark
            ? 'bg-[#121212] border border-white/10'
            : 'bg-amber-50/70 border border-amber-200/80'
        }`}
      >
        <div>
          <h4
            className={`text-base font-black uppercase ${
              isDark ? 'text-white' : 'text-gray-950'
            }`}
          >
            Have Questions About Our Policies?
          </h4>
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-gray-400 font-normal' : 'text-gray-700 font-bold'
            }`}
          >
            Contact our executive coordinator directly for custom inquiries and confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleWhatsAppInquiry}
            className={`flex items-center gap-2 font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer ${
              isDark
                ? 'bg-[#eab308] hover:bg-white text-white hover:text-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                : 'bg-black hover:bg-[#eab308] text-white hover:text-black'
            }`}
          >
            <MessageSquareText className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </button>

          <a
            href={`tel:${contacts.phone}`}
            className={`flex items-center gap-2 font-bold text-xs px-4 py-3 rounded-2xl border transition-all ${
              isDark
                ? 'bg-[#1c1c1c] hover:bg-white text-white hover:text-black border-white/15'
                : 'bg-black hover:bg-[#eab308] text-white hover:text-black border-black'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#ca8a04] dark:text-[#eab308]" />
            <span>Call Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
