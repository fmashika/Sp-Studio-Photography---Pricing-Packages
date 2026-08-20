import React, { useState, useEffect } from 'react';
import { X, MessageSquareText, Phone, Mail, Calendar, Sparkles, User, Check, BookmarkCheck } from 'lucide-react';
import { PricingPackage } from '../types';
import { useApp } from '../context/AppContext';
import { SpLogo } from './SpLogo';

interface BookingModalProps {
  pkg: PricingPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ pkg, isOpen, onClose }) => {
  const { contacts, addOrder, savedCustomer, saveCustomerDetails, formatPrice, theme } = useApp();
  const isDark = theme === 'dark';

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Wedding & Reception');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasLoadedSaved, setHasLoadedSaved] = useState(false);

  // Pre-fill fields from savedCustomer details on modal open to eliminate duplicate entry
  useEffect(() => {
    if (isOpen && savedCustomer) {
      if (savedCustomer.clientName) setClientName(savedCustomer.clientName);
      if (savedCustomer.phone) setPhone(savedCustomer.phone);
      if (savedCustomer.eventDate) setEventDate(savedCustomer.eventDate);
      if (savedCustomer.eventType) setEventType(savedCustomer.eventType);
      if (savedCustomer.notes) setNotes(savedCustomer.notes);
      setHasLoadedSaved(true);
    }
  }, [isOpen, savedCustomer]);

  if (!isOpen || !pkg) return null;

  const displayedPrice = formatPrice(pkg.rawPrice, pkg.price);

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Remember customer details for future visits
    saveCustomerDetails({
      clientName: clientName.trim(),
      phone: phone.trim(),
      eventDate,
      eventType,
      notes: notes.trim(),
    });

    // 2. Record the order into Admin Management system
    addOrder({
      clientName: clientName.trim() || 'Client Inquiry',
      phone: phone.trim() || 'Not specified',
      eventDate: eventDate || 'To be decided',
      eventType: eventType,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: displayedPrice,
      packageRawPrice: pkg.rawPrice,
      notes: notes.trim(),
    });

    setIsSuccess(true);

    // 3. Format WhatsApp text and launch
    const text = `Hello Sp Studio,\n\nI would like to book/inquire about the *${pkg.name} Package* (${displayedPrice}).\n\n*Client Name:* ${clientName || 'Not specified'}\n*Phone:* ${phone || 'Not specified'}\n*Event Type:* ${eventType}\n*Event Date:* ${eventDate || 'To be decided'}\n${notes ? `*Special Request:* ${notes}\n` : ''}\nThank you!`;
    const encoded = encodeURIComponent(text);
    
    setTimeout(() => {
      window.open(`https://wa.me/${contacts.whatsappNumber}?text=${encoded}`, '_blank');
    }, 400);
  };

  const handleDirectCall = () => {
    // Also save customer details
    if (clientName || phone) {
      saveCustomerDetails({
        clientName: clientName.trim(),
        phone: phone.trim(),
        eventDate,
        eventType,
        notes: notes.trim(),
      });
    }
    window.location.href = `tel:${contacts.phone}`;
  };

  const handleEmailBooking = () => {
    // Remember customer details
    saveCustomerDetails({
      clientName: clientName.trim(),
      phone: phone.trim(),
      eventDate,
      eventType,
      notes: notes.trim(),
    });

    // Record inquiry in admin system
    addOrder({
      clientName: clientName.trim() || 'Email Client',
      phone: phone.trim() || 'Via Email',
      eventDate: eventDate || 'To be decided',
      eventType: eventType,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: displayedPrice,
      packageRawPrice: pkg.rawPrice,
      notes: notes.trim(),
    });

    const subject = encodeURIComponent(`Booking Inquiry: ${pkg.name} Package - Sp Studio`);
    const body = encodeURIComponent(
      `Hello Sp Studio,\n\nI am interested in booking the ${pkg.name} package (${displayedPrice}).\n\nName: ${clientName}\nPhone: ${phone}\nEvent Type: ${eventType}\nDate: ${eventDate}\nNotes: ${notes}\n\nLooking forward to hearing from you.`
    );
    window.location.href = `mailto:${contacts.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${
          isDark
            ? 'bg-[#0d0d0d] border border-white/20 text-white'
            : 'bg-white border border-gray-200 text-gray-900 shadow-[0_10px_40px_rgba(0,0,0,0.2)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
            isDark
              ? 'text-gray-400 hover:text-black hover:bg-white bg-[#1c1c1c] border border-white/10'
              : 'text-white hover:text-black bg-black hover:bg-[#eab308]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with SpLogo */}
        <div className="flex items-start gap-4 mb-6">
          <SpLogo size="sm" showStudioText={false} className="shrink-0 mt-1" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#ca8a04] dark:text-[#eab308] tracking-[0.2em] uppercase">
                RESERVATION & INQUIRY
              </span>
              {hasLoadedSaved && savedCustomer?.clientName && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#eab308]/20 text-[#ca8a04] dark:text-[#eab308] px-2 py-0.5 rounded-full uppercase">
                  <BookmarkCheck className="w-3 h-3" />
                  <span>Remembered</span>
                </span>
              )}
            </div>

            <h2
              className={`text-2xl sm:text-3xl font-black mt-0.5 ${
                isDark ? 'text-white' : 'text-gray-950'
              }`}
            >
              Book <span className="text-[#ca8a04] dark:text-[#eab308]">{pkg.name}</span> Package
            </h2>
            <p className="text-xl font-extrabold text-[#ca8a04] dark:text-[#eab308] mt-1 drop-shadow-sm">
              {displayedPrice}
            </p>
          </div>
        </div>

        {/* Inclusions Quick Preview with Simple Bullets */}
        <div
          className={`rounded-2xl p-4 mb-6 ${
            isDark
              ? 'bg-[#171717] border border-white/10'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-gray-900 font-bold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ca8a04] dark:text-[#eab308]" /> Package Inclusions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {pkg.features.slice(0, 6).map((feat, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 ${
                  isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04] dark:bg-[#eab308] shrink-0 inline-block" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
            {pkg.features.length > 6 && (
              <div className="text-[11px] text-[#ca8a04] dark:text-[#eab308] font-bold pt-0.5">
                +{pkg.features.length - 6} more included features
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleWhatsAppBooking} className="space-y-4">
          <div>
            <label
              className={`block text-xs mb-1.5 ${
                isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
              }`}
            >
              Your Name / Couple Names
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Amani & Neema"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className={`w-full rounded-2xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'bg-[#171717] border border-white/20 text-white placeholder-gray-500 focus:border-[#eab308] focus:ring-[#eab308]'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#ca8a04] focus:ring-[#ca8a04]'
                }`}
              />
              <User className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs mb-1.5 ${
                  isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
                }`}
              >
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder={`e.g. ${contacts.phoneFormatted}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={`w-full rounded-2xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'bg-[#171717] border border-white/20 text-white placeholder-gray-500 focus:border-[#eab308] focus:ring-[#eab308]'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#ca8a04] focus:ring-[#ca8a04]'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs mb-1.5 ${
                  isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
                }`}
              >
                Event Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-[#171717] border border-white/20 text-white placeholder-gray-500 focus:border-[#eab308] focus:ring-[#eab308]'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#ca8a04] focus:ring-[#ca8a04]'
                  }`}
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label
              className={`block text-xs mb-1.5 ${
                isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
              }`}
            >
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 cursor-pointer ${
                isDark
                  ? 'bg-[#171717] border border-white/20 text-white focus:border-[#eab308] focus:ring-[#eab308] font-normal'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-[#ca8a04] focus:ring-[#ca8a04] font-bold'
              }`}
            >
              <option value="Wedding & Reception" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Wedding & Reception</option>
              <option value="Send-off / Kitchen Party" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Send-off / Kitchen Party</option>
              <option value="Pre-Wedding Shoot" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Pre-Wedding Shoot</option>
              <option value="Corporate Event / Gala" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Corporate Event / Gala</option>
              <option value="Birthday / Anniversary" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Birthday / Anniversary</option>
              <option value="Commercial / Studio Shoot" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Commercial / Studio Shoot</option>
              <option value="Other Celebration" className={isDark ? 'bg-[#171717] text-white font-normal' : 'bg-white text-gray-900 font-bold'}>Other Celebration</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-xs mb-1.5 ${
                isDark ? 'text-gray-200 font-normal' : 'text-gray-900 font-bold'
              }`}
            >
              Additional Details / Venue Location
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Venue in Dar es Salaam, specific hours, custom requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full rounded-2xl px-4 py-2.5 text-sm resize-none transition-all focus:outline-none focus:ring-1 ${
                isDark
                  ? 'bg-[#171717] border border-white/20 text-white placeholder-gray-500 focus:border-[#eab308] focus:ring-[#eab308]'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#ca8a04] focus:ring-[#ca8a04]'
              }`}
            />
          </div>

          {isSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Details remembered and saved! Launching WhatsApp...</span>
            </div>
          )}

          {/* Action Buttons: light mode black -> hover yellow */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 font-black text-sm py-4 px-4 rounded-2xl shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                isDark
                  ? 'bg-[#eab308] hover:bg-white text-white hover:text-black shadow-[#eab308]/25 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                  : 'bg-black hover:bg-[#eab308] text-white hover:text-black shadow-black/20'
              }`}
            >
              <MessageSquareText className="w-4 h-4 fill-current" />
              <span>Instant Booking on WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDirectCall}
                className={`flex items-center justify-center gap-2 font-black text-xs py-3 px-3 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#1c1c1c] hover:bg-white text-white hover:text-black border-white/15'
                    : 'bg-black hover:bg-[#eab308] text-white hover:text-black border-black'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#eab308]" />
                <span>Call {contacts.phoneFormatted}</span>
              </button>

              <button
                type="button"
                onClick={handleEmailBooking}
                className={`flex items-center justify-center gap-2 font-black text-xs py-3 px-3 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#1c1c1c] hover:bg-white text-white hover:text-black border-white/15'
                    : 'bg-black hover:bg-[#eab308] text-white hover:text-black border-black'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#eab308]" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
