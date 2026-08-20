import React, { useState } from 'react';
import {
  ShoppingBag,
  Layers,
  Settings,
  BarChart3,
  Lock,
  LogOut,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MessageSquareText,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Download,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Star,
  FolderPlus,
  FileText,
  FolderTree,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Type,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingOrder, OrderStatus, PricingPackage, AppCategory, TermSection } from '../../types';
import { SpLogo } from '../SpLogo';
import { EditOrderModal } from './EditOrderModal';
import { EditPackageModal } from './EditPackageModal';
import { EditCategoryModal } from './EditCategoryModal';
import { EditTermsModal } from './EditTermsModal';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
    orders,
    packages,
    categories,
    terms,
    contacts,
    logoutAdmin,
    updateContacts,
    changeAdminPassword,
    deletePackage,
    deleteCategory,
    deleteTermSection,
    reorderPackages,
    reorderCategories,
    reorderTerms,
    resetToDefaults,
    packageTitleFontSizePercent,
    setPackageTitleFontSizePercent,
  } = useApp();

  type TabType =
    | 'orders'
    | 'packages'
    | 'categories'
    | 'terms'
    | 'contacts'
    | 'analytics'
    | 'appearance'
    | 'security';
  const [activeTab, setActiveTab] = useState<TabType>('orders');

  // Filter & Search states
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageCategoryFilter, setPackageCategoryFilter] = useState<string>('all');

  // Drag states
  const [draggedPkgIdx, setDraggedPkgIdx] = useState<number | null>(null);
  const [draggedCatIdx, setDraggedCatIdx] = useState<number | null>(null);
  const [draggedTermIdx, setDraggedTermIdx] = useState<number | null>(null);

  // Modals state
  const [editingOrder, setEditingOrder] = useState<BookingOrder | null>(null);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);

  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<AppCategory | null>(null);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);

  const [editingTermSection, setEditingTermSection] = useState<TermSection | null>(null);
  const [isEditTermsOpen, setIsEditTermsOpen] = useState(false);

  // Contacts Form state
  const [contactEmail, setContactEmail] = useState(contacts.email);
  const [contactPhone, setContactPhone] = useState(contacts.phone);
  const [contactPhoneFormatted, setContactPhoneFormatted] = useState(contacts.phoneFormatted);
  const [contactInstagram, setContactInstagram] = useState(contacts.instagram);
  const [contactInstagramUrl, setContactInstagramUrl] = useState(contacts.instagramUrl);
  const [contactLocation, setContactLocation] = useState(contacts.location);
  const [contactLocationDetails, setContactLocationDetails] = useState(contacts.locationDetails);
  const [contactWhatsappNumber, setContactWhatsappNumber] = useState(contacts.whatsappNumber);
  const [contactsSaveSuccess, setContactsSaveSuccess] = useState(false);

  // Security Form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.phone.includes(orderSearch) ||
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.packageName.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Packages
  const filteredPackages = packages.filter((pkg) => {
    if (packageCategoryFilter === 'all') return true;
    return pkg.categoryId === packageCategoryFilter;
  });

  // Calculate Metrics
  const totalOrders = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed');
  const confirmedRevenue = confirmedOrders.reduce((sum, o) => sum + (o.packageRawPrice || 0), 0);
  const pipelineRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.packageRawPrice || 0), 0);

  // Format currency
  const formatTSh = (amount: number) => {
    return 'TZS ' + amount.toLocaleString('en-US') + '/-';
  };

  const handleOpenEditOrder = (order: BookingOrder) => {
    setEditingOrder(order);
    setIsEditOrderOpen(true);
  };

  const handleOpenEditPackage = (pkg: PricingPackage | null) => {
    setEditingPackage(pkg);
    setIsEditPackageOpen(true);
  };

  const handleOpenEditCategory = (cat: AppCategory | null) => {
    setEditingCategory(cat);
    setIsEditCategoryOpen(true);
  };

  const handleOpenEditTerms = (sec: TermSection | null) => {
    setEditingTermSection(sec);
    setIsEditTermsOpen(true);
  };

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    updateContacts({
      email: contactEmail,
      phone: contactPhone,
      phoneFormatted: contactPhoneFormatted,
      instagram: contactInstagram,
      instagramUrl: contactInstagramUrl,
      location: contactLocation,
      locationDetails: contactLocationDetails,
      whatsappNumber: contactWhatsappNumber,
    });
    setContactsSaveSuccess(true);
    setTimeout(() => setContactsSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMessage({ success: false, text: 'New passwords do not match.' });
      return;
    }
    const result = changeAdminPassword(oldPassword, newPassword);
    setPwdMessage({ success: result.success, text: result.message });
    if (result.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Order Number',
      'Date Created',
      'Client Name',
      'Phone',
      'Event Date',
      'Event Type',
      'Package Name',
      'Price',
      'Status',
      'Client Notes',
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.clientName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      o.eventDate,
      `"${o.eventType}"`,
      `"${o.packageName}"`,
      `"${o.packagePrice}"`,
      o.status,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sp_Studio_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="min-h-screen bg-[#070707] text-white flex flex-col font-sans selection:bg-[#eab308] selection:text-black"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#282828] text-white border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-4 h-4 text-[#eab308]" />
            <span className="hidden sm:inline">Back to Studio</span>
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <SpLogo size="sm" showStudioText={false} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  SP STUDIO
                </span>
                <span className="bg-[#eab308] text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  ADMIN WORKSPACE
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all packages, categories (Wedding, Send Off, Addition Service, Terms), and demo orders to factory defaults?')) {
                resetToDefaults();
              }
            }}
            className="hidden md:flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#262626] text-gray-300 text-xs px-3 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Reset to initial factory defaults"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#eab308]" />
            <span>Reset Factory Data</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              onClose();
            }}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Tabs and Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Tabs Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1.5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Inquiries & Orders</span>
            </div>
            {newOrdersCount > 0 && (
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'orders'
                    ? 'bg-black text-[#eab308]'
                    : 'bg-[#eab308] text-black'
                }`}
              >
                {newOrdersCount} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Pricing Packages</span>
            </div>
            <span className="text-[10px] opacity-70">({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" />
              <span>Categories & Pages</span>
            </div>
            <span className="text-[10px] opacity-70">({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Terms & Conditions</span>
            </div>
            <span className="text-[10px] opacity-70">({terms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Studio Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4" />
              <span>Package Title Font Size</span>
            </div>
            <span className="text-[10px] font-black opacity-90 bg-black/20 px-2 py-0.5 rounded-full">
              {packageTitleFontSizePercent}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/20 font-black'
                : 'bg-[#121212] text-gray-300 hover:text-white hover:bg-[#1c1c1c] border border-white/5'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </aside>

        {/* Dynamic Tab Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* ============================================================ */}
          {/* TAB 1: INQUIRIES & ORDERS */}
          {/* ============================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-[#121212] border border-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Inquiries</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{totalOrders}</p>
                </div>
                <div className="bg-[#121212] border border-amber-500/30 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-[#eab308] uppercase">New Pending</p>
                  <p className="text-2xl font-extrabold text-[#eab308] mt-1">{newOrdersCount}</p>
                </div>
                <div className="bg-[#121212] border border-emerald-500/30 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase">Confirmed Deals</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">{confirmedOrders.length}</p>
                </div>
                <div className="bg-[#121212] border border-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pipeline Value</p>
                  <p className="text-sm sm:text-base font-extrabold text-white mt-1 truncate">
                    {formatTSh(pipelineRevenue)}
                  </p>
                </div>
              </div>

              {/* Search, Filter & Export */}
              <div className="bg-[#121212] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search client, phone, or #order..."
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#eab308]"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 px-3 py-2 rounded-xl text-xs text-gray-300">
                    <Filter className="w-3.5 h-3.5 text-[#eab308]" />
                    <span>Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#222]">All Statuses ({orders.length})</option>
                      <option value="new" className="bg-[#222]">New ({orders.filter((o) => o.status === 'new').length})</option>
                      <option value="contacted" className="bg-[#222]">Contacted ({orders.filter((o) => o.status === 'contacted').length})</option>
                      <option value="confirmed" className="bg-[#222]">Confirmed ({orders.filter((o) => o.status === 'confirmed').length})</option>
                      <option value="completed" className="bg-[#222]">Completed ({orders.filter((o) => o.status === 'completed').length})</option>
                      <option value="cancelled" className="bg-[#222]">Cancelled ({orders.filter((o) => o.status === 'cancelled').length})</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#262626] border border-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    title="Export orders as CSV spreadsheet"
                  >
                    <Download className="w-3.5 h-3.5 text-[#eab308]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-12 text-center">
                  <ShoppingBag className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">No Orders Found</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search query or status filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
                    const intlPhone = cleanPhone.startsWith('0')
                      ? `255${cleanPhone.slice(1)}`
                      : cleanPhone.startsWith('255')
                      ? cleanPhone
                      : `255${cleanPhone}`;

                    const waText = encodeURIComponent(
                      `Hello ${order.clientName}, this is Sp Studio regarding your inquiry for the ${order.packageName} (${order.packagePrice}).`
                    );

                    return (
                      <div
                        key={order.id}
                        className={`bg-[#121212] border rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
                          order.status === 'new'
                            ? 'border-amber-500/50 shadow-[0_0_15px_rgba(234,179,8,0.12)] bg-[#15130b]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-mono text-gray-400 font-bold">
                                {order.orderNumber}
                              </span>
                              <span className="text-[10px] text-gray-500">•</span>
                              <span className="text-[11px] text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-white">
                              {order.clientName}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                order.status === 'new'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : order.status === 'confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : order.status === 'completed'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                  : 'bg-white/10 text-gray-300 border border-white/20'
                              }`}
                            >
                              Status: {order.status}
                            </span>

                            <span className="text-base sm:text-lg font-black text-[#eab308]">
                              {order.packagePrice}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs text-gray-300">
                          <div>
                            <span className="text-gray-500 block text-[10px] uppercase font-bold">
                              Selected Package
                            </span>
                            <span className="font-bold text-white mt-0.5 block">
                              {order.packageName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[10px] uppercase font-bold">
                              Event Details
                            </span>
                            <span className="font-bold text-white mt-0.5 block">
                              {order.eventType} • {order.eventDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[10px] uppercase font-bold">
                              Phone / WhatsApp
                            </span>
                            <span className="font-mono text-white mt-0.5 block">
                              {order.phone}
                            </span>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="bg-[#181818] p-3 rounded-xl text-xs text-gray-300 mb-4">
                            <span className="text-gray-400 font-bold block mb-0.5">
                              Client Notes:
                            </span>
                            {order.notes}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${intlPhone}?text=${waText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              <MessageSquareText className="w-3.5 h-3.5" />
                              <span>WhatsApp Client</span>
                            </a>

                            <a
                              href={`tel:${order.phone}`}
                              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#eab308]" />
                              <span>Call {order.phone}</span>
                            </a>
                          </div>

                          <button
                            onClick={() => handleOpenEditOrder(order)}
                            className="flex items-center gap-1.5 bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>View & Edit Order</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PACKAGES & PRICING MANAGEMENT WITH DRAG & DROP */}
          {/* ============================================================ */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">Live Packages & Pricing</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Drag cards above/below to reorder, edit subtitles, star features, and icon styles.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEditPackage(null)}
                  className="flex items-center gap-2 bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Package</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase mr-1">Filter:</span>
                <button
                  onClick={() => setPackageCategoryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    packageCategoryFilter === 'all'
                      ? 'bg-[#eab308] text-black font-black'
                      : 'bg-[#181818] text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  All Categories ({packages.length})
                </button>

                {categories
                  .filter((c) => c.type === 'packages')
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPackageCategoryFilter(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        packageCategoryFilter === cat.id
                          ? 'bg-[#eab308] text-black font-black'
                          : 'bg-[#181818] text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {cat.name} ({packages.filter((p) => p.categoryId === cat.id).length})
                    </button>
                  ))}
              </div>

              {/* Packages Cards Grid with Drag & Drop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg, pIdx) => {
                  const globalIdx = packages.findIndex((p) => p.id === pkg.id);
                  const catName =
                    categories.find((c) => c.id === pkg.categoryId)?.name || pkg.categoryId;

                  return (
                    <div
                      key={pkg.id}
                      draggable
                      onDragStart={() => setDraggedPkgIdx(globalIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedPkgIdx !== null && draggedPkgIdx !== globalIdx) {
                          reorderPackages(draggedPkgIdx, globalIdx);
                        }
                        setDraggedPkgIdx(null);
                      }}
                      className={`bg-[#121212] border rounded-2xl p-5 flex flex-col justify-between relative transition-all duration-200 ${
                        pkg.featured
                          ? 'border-[#eab308]/70 shadow-[0_0_15px_rgba(234,179,8,0.12)]'
                          : 'border-white/10'
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-3 right-4 bg-[#eab308] text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                          {pkg.badge}
                        </span>
                      )}

                      <div>
                        {/* Drag & Reorder header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-[#eab308] uppercase tracking-wider block">
                            📁 {catName}
                          </span>

                          <div className="flex items-center gap-1">
                            <div
                              className="text-gray-500 hover:text-[#eab308] cursor-grab active:cursor-grabbing p-1"
                              title="Drag to reorder package"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            <button
                              type="button"
                              onClick={() => globalIdx > 0 && reorderPackages(globalIdx, globalIdx - 1)}
                              disabled={globalIdx === 0}
                              className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move left/up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => globalIdx < packages.length - 1 && reorderPackages(globalIdx, globalIdx + 1)}
                              disabled={globalIdx === packages.length - 1}
                              className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move right/down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-white uppercase">{pkg.name}</h3>
                        <p className="text-base sm:text-lg font-black text-[#eab308] mt-0.5 mb-4">
                          {pkg.price}
                        </p>

                        <div className="border-t border-white/10 pt-3 mb-4">
                          {pkg.sections && pkg.sections.length > 0 ? (
                            <div className="space-y-3">
                              {pkg.sections.map((sec, sIdx) => (
                                <div key={sIdx}>
                                  <p className="text-[10px] font-bold text-[#eab308] uppercase tracking-wider mb-1">
                                    {sec.subtitle}
                                  </p>
                                  <ul className="space-y-1 text-xs text-white">
                                    {sec.items.map((item, iIdx) => (
                                      <li key={iIdx} className="flex items-start gap-1.5 truncate">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0 mt-1" />
                                        <span className="truncate">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                                Features ({pkg.features.length})
                              </p>
                              <ul className="space-y-1.5 text-xs text-white">
                                {pkg.features.map((f, i) => (
                                  <li key={i} className="flex items-center gap-1.5 truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0" />
                                    <span className="truncate">{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenEditPackage(pkg)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#eab308]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${pkg.name} package?`)) {
                              deletePackage(pkg.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: CATEGORIES & PAGES MANAGEMENT WITH DRAG & DROP */}
          {/* ============================================================ */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Categories & Website Pages</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Drag above/below to change page tab order (Wedding, Send Off, Addition Service, Terms & Conditions).
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEditCategory(null)}
                  className="flex items-center gap-2 bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat, cIdx) => {
                  const pkgCount = packages.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={() => setDraggedCatIdx(cIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedCatIdx !== null && draggedCatIdx !== cIdx) {
                          reorderCategories(draggedCatIdx, cIdx);
                        }
                        setDraggedCatIdx(null);
                      }}
                      className="bg-[#121212] border border-white/10 hover:border-[#eab308]/40 p-5 rounded-2xl flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#eab308] uppercase tracking-wider bg-[#eab308]/10 px-2 py-0.5 rounded-md">
                              Type: {cat.type}
                            </span>
                            {cat.badge && (
                              <span className="text-[10px] font-black text-black bg-[#eab308] px-2 py-0.5 rounded-full uppercase">
                                {cat.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <div
                              className="text-gray-500 hover:text-[#eab308] cursor-grab active:cursor-grabbing p-1"
                              title="Drag category above or below"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            <button
                              type="button"
                              onClick={() => cIdx > 0 && reorderCategories(cIdx, cIdx - 1)}
                              disabled={cIdx === 0}
                              className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => cIdx < categories.length - 1 && reorderCategories(cIdx, cIdx + 1)}
                              disabled={cIdx === categories.length - 1}
                              className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white uppercase">{cat.name}</h3>
                        {cat.description && (
                          <p className="text-xs text-gray-400 mt-1">{cat.description}</p>
                        )}

                        <div className="mt-3 text-xs text-gray-300">
                          {cat.type === 'packages' ? (
                            <span className="text-white font-bold">📦 {pkgCount} active packages</span>
                          ) : (
                            <span className="text-white font-bold">📜 {terms.length} policy sections</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 mt-4">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#eab308]" />
                          <span>Edit Category</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${cat.name} category?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: TERMS & CONDITIONS MANAGEMENT (3 SECTIONS WITH DRAG & DROP) */}
          {/* ============================================================ */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Terms & Conditions Sections</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Drag above/below to reorder policy sections. Total {terms.length} sections displayed.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEditTerms(null)}
                  className="flex items-center gap-2 bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Policy Section</span>
                </button>
              </div>

              <div className="space-y-4">
                {terms.map((term, index) => (
                  <div
                    key={term.id}
                    draggable
                    onDragStart={() => setDraggedTermIdx(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedTermIdx !== null && draggedTermIdx !== index) {
                        reorderTerms(draggedTermIdx, index);
                      }
                      setDraggedTermIdx(null);
                    }}
                    className="bg-[#121212] border border-white/10 p-5 sm:p-6 rounded-2xl"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="text-gray-500 hover:text-[#eab308] cursor-grab active:cursor-grabbing p-1"
                          title="Drag section above or below"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="w-6 h-6 rounded-lg bg-[#eab308]/20 text-[#eab308] text-xs font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-white">{term.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => index > 0 && reorderTerms(index, index - 1)}
                          disabled={index === 0}
                          className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => index < terms.length - 1 && reorderTerms(index, index + 1)}
                          disabled={index === terms.length - 1}
                          className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleOpenEditTerms(term)}
                          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-[#eab308]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${term.title}?`)) {
                              deleteTermSection(term.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <ul className="space-y-1.5 pl-8 text-xs text-gray-300">
                      {term.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0 mt-1.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: STUDIO INFO & CONTACT SETTINGS */}
          {/* ============================================================ */}
          {activeTab === 'contacts' && (
            <div className="max-w-2xl bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Studio Contact Information</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update phone numbers, WhatsApp, email, Instagram handle, and studio location.
                </p>
              </div>

              {contactsSaveSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Studio contact details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveContacts} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Direct WhatsApp Number (No spaces/symbols)
                    </label>
                    <input
                      type="text"
                      value={contactWhatsappNumber}
                      onChange={(e) => setContactWhatsappNumber(e.target.value)}
                      placeholder="e.g. 255743705912"
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Formatted Phone (Display)
                    </label>
                    <input
                      type="text"
                      value={contactPhoneFormatted}
                      onChange={(e) => setContactPhoneFormatted(e.target.value)}
                      placeholder="e.g. 0743 705 912"
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. johanesgabriel08@gmail.com"
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={contactInstagram}
                      onChange={(e) => setContactInstagram(e.target.value)}
                      placeholder="e.g. @sixtyfour_pictures"
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={contactInstagramUrl}
                    onChange={(e) => setContactInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/sixtyfour_pictures"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Studio Location (Card Headline)
                  </label>
                  <input
                    type="text"
                    value={contactLocation}
                    onChange={(e) => setContactLocation(e.target.value)}
                    placeholder="e.g. DAR FREE MARKET MALL"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Detailed Physical Address
                  </label>
                  <textarea
                    value={contactLocationDetails}
                    onChange={(e) => setContactLocationDetails(e.target.value)}
                    rows={2}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#eab308]"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs px-6 py-3 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Save Studio Information
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: ANALYTICS & KPIS */}
          {/* ============================================================ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121212] border border-white/10 p-6 rounded-3xl">
                  <p className="text-xs font-bold text-gray-400 uppercase">Confirmed Revenue</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#eab308] mt-2">
                    {formatTSh(confirmedRevenue)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    From {confirmedOrders.length} confirmed event bookings.
                  </p>
                </div>

                <div className="bg-[#121212] border border-white/10 p-6 rounded-3xl">
                  <p className="text-xs font-bold text-gray-400 uppercase">Conversion Rate</p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {totalOrders > 0 ? Math.round((confirmedOrders.length / totalOrders) * 100) : 0}%
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Confirmed deals vs total inquiry traffic.
                  </p>
                </div>

                <div className="bg-[#121212] border border-white/10 p-6 rounded-3xl">
                  <p className="text-xs font-bold text-gray-400 uppercase">Active Packages</p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {packages.length}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Across {categories.length} categories on public site.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 7: FONT SIZE & TYPOGRAPHY SCALING */}
          {/* ============================================================ */}
          {/* TAB 7: PACKAGE TITLE FONT SIZE SCALING                      */}
          {/* ============================================================ */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Settings Card */}
              <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#eab308]/15 border border-[#eab308]/30 flex items-center justify-center text-[#eab308]">
                        <Type className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Package Titles Font Size Scaling</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Increase or decrease font size scaling specifically for the titles of pricing packages from 1% to 100%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-[#eab308] text-black font-black text-sm px-4 py-1.5 rounded-xl shadow-sm">
                      {packageTitleFontSizePercent}%
                    </span>
                    <button
                      onClick={() => setPackageTitleFontSizePercent(100)}
                      className="flex items-center gap-1.5 bg-[#1c1c1c] hover:bg-[#282828] text-gray-300 hover:text-white border border-white/10 text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                      title="Reset to 100% default"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#eab308]" />
                      <span>Reset (100%)</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Percentage Slider & Step Buttons */}
                <div className="py-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-300 mb-3">
                      <span>Scaling Range: 1% to 100%</span>
                      <span className="text-[#eab308] font-black">{packageTitleFontSizePercent}% Active Scale ({Math.max(10, Math.round((28 * packageTitleFontSizePercent) / 100))}px)</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Step -5% Button */}
                      <button
                        type="button"
                        onClick={() => setPackageTitleFontSizePercent(packageTitleFontSizePercent - 5)}
                        disabled={packageTitleFontSizePercent <= 1}
                        className="w-10 h-10 rounded-xl bg-[#1c1c1c] hover:bg-[#2c2c2c] disabled:opacity-30 border border-white/10 flex items-center justify-center text-white font-black text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
                        title="Decrease 5%"
                      >
                        -5%
                      </button>

                      {/* Step -1% Button */}
                      <button
                        type="button"
                        onClick={() => setPackageTitleFontSizePercent(packageTitleFontSizePercent - 1)}
                        disabled={packageTitleFontSizePercent <= 1}
                        className="w-9 h-10 rounded-xl bg-[#181818] hover:bg-[#282828] disabled:opacity-30 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                        title="Decrease 1%"
                      >
                        -1%
                      </button>

                      {/* Range Slider */}
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={packageTitleFontSizePercent}
                        onChange={(e) => setPackageTitleFontSizePercent(Number(e.target.value))}
                        className="flex-1 h-3 bg-[#1c1c1c] rounded-lg appearance-none cursor-pointer accent-[#eab308]"
                      />

                      {/* Step +1% Button */}
                      <button
                        type="button"
                        onClick={() => setPackageTitleFontSizePercent(packageTitleFontSizePercent + 1)}
                        disabled={packageTitleFontSizePercent >= 100}
                        className="w-9 h-10 rounded-xl bg-[#181818] hover:bg-[#282828] disabled:opacity-30 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                        title="Increase 1%"
                      >
                        +1%
                      </button>

                      {/* Step +5% Button */}
                      <button
                        type="button"
                        onClick={() => setPackageTitleFontSizePercent(packageTitleFontSizePercent + 5)}
                        disabled={packageTitleFontSizePercent >= 100}
                        className="w-10 h-10 rounded-xl bg-[#1c1c1c] hover:bg-[#2c2c2c] disabled:opacity-30 border border-white/10 flex items-center justify-center text-white font-black text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
                        title="Increase 5%"
                      >
                        +5%
                      </button>
                    </div>
                  </div>

                  {/* Manual Numeric Input and Quick Presets */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <label className="text-xs text-gray-400 font-medium">Exact Percentage:</label>
                      <div className="relative w-28">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={packageTitleFontSizePercent}
                          onChange={(e) => setPackageTitleFontSizePercent(Number(e.target.value))}
                          className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white text-right pr-7 focus:outline-none focus:border-[#eab308]"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-medium mr-1">Presets:</span>
                      {[25, 50, 70, 80, 90, 95, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPackageTitleFontSizePercent(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            packageTitleFontSizePercent === preset
                              ? 'bg-[#eab308] text-black font-black'
                              : 'bg-[#1c1c1c] text-gray-300 hover:text-white hover:bg-[#282828] border border-white/10'
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Package Titles Preview Box */}
              <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Live Package Title Font Preview ({packageTitleFontSizePercent}%)
                  </h3>
                  <span className="text-xs text-[#eab308] font-bold">Real-time sync</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl space-y-3">
                    <span className="bg-[#eab308] text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full inline-block">
                      MOST POPULAR
                    </span>
                    <h4
                      style={{
                        fontSize: `${Math.max(10, Math.round((28 * packageTitleFontSizePercent) / 100))}px`,
                        lineHeight: 1.15,
                      }}
                      className="font-black uppercase text-white tracking-[0.06em] transition-all duration-150"
                    >
                      GOLD WEDDING PACKAGE
                    </h4>
                    <span className="text-base font-extrabold text-[#eab308] block">
                      TZS 4,500,000/-
                    </span>
                  </div>

                  <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl space-y-3">
                    <span className="bg-[#eab308] text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full inline-block">
                      BEST VALUE
                    </span>
                    <h4
                      style={{
                        fontSize: `${Math.max(10, Math.round((28 * packageTitleFontSizePercent) / 100))}px`,
                        lineHeight: 1.15,
                      }}
                      className="font-black uppercase text-white tracking-[0.06em] transition-all duration-150"
                    >
                      SILVER SEND OFF
                    </h4>
                    <span className="text-base font-extrabold text-[#eab308] block">
                      TZS 2,800,000/-
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 8: SECURITY & PASSWORD */}
          {/* ============================================================ */}
          {activeTab === 'security' && (
            <div className="max-w-md bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#eab308] mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Change Admin Password</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Default password is <code className="text-[#eab308]">admin</code>. Update it to keep your portal secure.
                </p>
              </div>

              {pwdMessage && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs font-bold ${
                    pwdMessage.success
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {pwdMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 4 characters..."
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#eab308]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#eab308] hover:bg-[#f59e0b] text-black font-black text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer mt-2"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Edit Order Modal */}
      <EditOrderModal
        order={editingOrder}
        isOpen={isEditOrderOpen}
        onClose={() => setIsEditOrderOpen(false)}
      />

      {/* Edit Package Modal */}
      <EditPackageModal
        pkg={editingPackage}
        isOpen={isEditPackageOpen}
        onClose={() => setIsEditPackageOpen(false)}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        category={editingCategory}
        isOpen={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
      />

      {/* Edit Terms Modal */}
      <EditTermsModal
        section={editingTermSection}
        isOpen={isEditTermsOpen}
        onClose={() => setIsEditTermsOpen(false)}
      />
    </div>
  );
};
