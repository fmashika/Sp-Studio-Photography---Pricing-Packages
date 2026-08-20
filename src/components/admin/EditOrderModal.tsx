import React, { useState } from 'react';
import { X, Save, MessageSquareText, Phone, Trash2 } from 'lucide-react';
import { BookingOrder, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditOrderModalProps {
  order: BookingOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, isOpen, onClose }) => {
  const { updateOrder, deleteOrder, contacts } = useApp();

  const [clientName, setClientName] = useState(order?.clientName || '');
  const [phone, setPhone] = useState(order?.phone || '');
  const [eventType, setEventType] = useState(order?.eventType || '');
  const [eventDate, setEventDate] = useState(order?.eventDate || '');
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'new');
  const [notes, setNotes] = useState(order?.notes || '');
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes || '');

  // Sync state when order changes
  React.useEffect(() => {
    if (order) {
      setClientName(order.clientName);
      setPhone(order.phone);
      setEventType(order.eventType);
      setEventDate(order.eventDate);
      setStatus(order.status);
      setNotes(order.notes || '');
      setAdminNotes(order.adminNotes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder(order.id, {
      clientName,
      phone,
      eventType,
      eventDate,
      status,
      notes,
      adminNotes,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      deleteOrder(order.id);
      onClose();
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const internationalPhone = cleanPhone.startsWith('0')
      ? `255${cleanPhone.slice(1)}`
      : cleanPhone.startsWith('255')
      ? cleanPhone
      : `255${cleanPhone}`;

    const text = encodeURIComponent(
      `Hello ${clientName}, this is Sp Studio regarding your inquiry for the ${order.packageName} (${order.packagePrice}). We would love to discuss and finalize your booking for ${eventDate || 'your event'}.`
    );
    window.open(`https://wa.me/${internationalPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#eab308] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full">
              {order.orderNumber}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">
            Edit Booking / Order
          </h2>
          <p className="text-sm text-[#eab308] font-bold mt-0.5">
            {order.packageName} • {order.packagePrice}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Client Name(s)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
              >
                <option value="new">🟡 New Inquiry</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="confirmed">🟢 Confirmed / Booked</option>
                <option value="completed">🟣 Completed</option>
                <option value="cancelled">🔴 Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Event Type
            </label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eab308]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Client Message / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#eab308] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#eab308] mb-1.5">
              Internal Admin Notes (Private Staff Notes)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Deposit received, assigned photographer, equipment checklist..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full bg-[#181818] border border-[#eab308]/30 rounded-2xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#eab308] resize-none"
            />
          </div>

          {/* Quick Contact Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>WhatsApp Client</span>
            </button>

            <a
              href={`tel:${phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3 rounded-xl transition-all"
            >
              <Phone className="w-4 h-4 text-[#eab308]" />
              <span>Call Client</span>
            </a>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Order</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#eab308] hover:bg-[#f59e0b] text-white font-extrabold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
