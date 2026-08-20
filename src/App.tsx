import React, { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { PackageCard } from './components/PackageCard';
import { TermsAndConditions } from './components/TermsAndConditions';
import { Footer } from './components/Footer';
import { AppProvider, useApp } from './context/AppContext';
import { PricingPackage } from './types';

// Performance optimization: Lazy load non-critical modals and heavy admin suites
const BookingModal = lazy(() =>
  import('./components/BookingModal').then((m) => ({ default: m.BookingModal }))
);
const LocationModal = lazy(() =>
  import('./components/LocationModal').then((m) => ({ default: m.LocationModal }))
);
const AdminLoginModal = lazy(() =>
  import('./components/admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);
const AdminPanel = lazy(() =>
  import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);

function MainLandingPage() {
  const { packages, categories, activeCategoryId, isAdminLoggedIn, theme } = useApp();

  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [activePackageId, setActivePackageId] = useState<string>('bronze-wedding');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const isDark = theme === 'dark';
  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];
  const isTermsCategory = activeCategory?.type === 'terms';

  // Filter packages for the active category
  const currentCategoryPackages = packages.filter(
    (pkg) => pkg.categoryId === activeCategoryId
  );

  const handleSelectPackage = (pkg: PricingPackage) => {
    setActivePackageId(pkg.id);
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleCardClick = (pkg: PricingPackage) => {
    setActivePackageId(pkg.id);
  };

  // Secret 2X Tap Trigger to open Admin Portal
  const handleSecretAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // If Admin Panel is opened and authenticated, display the full admin workspace
  if (isAdminPanelOpen && isAdminLoggedIn) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#080808] flex items-center justify-center text-white"><div className="w-8 h-8 border-2 border-[#eab308] border-t-transparent rounded-full animate-spin" /></div>}>
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      </Suspense>
    );
  }

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between selection:bg-[#eab308] selection:text-black overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'bg-black text-white' : 'bg-[#fafafa] text-gray-900'
      }`}
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-[-180px] right-[-100px] w-[500px] h-[500px] rounded-full blur-[130px] transition-all ${
            isDark ? 'bg-[#eab308]/4' : 'bg-[#eab308]/10'
          }`}
        />
        <div
          className={`absolute bottom-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full blur-[130px] transition-all ${
            isDark ? 'bg-[#eab308]/3' : 'bg-[#eab308]/8'
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[150px] transition-all ${
            isDark ? 'bg-[#eab308]/2' : 'bg-[#eab308]/6'
          }`}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1340px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Brand Header with Arial Typography, Light/Dark toggle & Secret 2X Tap */}
        <Header onSecretAdminTrigger={handleSecretAdminTrigger} />

        {/* Category Navigation Tabs with TZS / USD Currency Switcher */}
        <CategoryTabs />

        {/* Main Content View: Either Pricing Packages Grid OR Terms & Conditions Page */}
        {isTermsCategory ? (
          <TermsAndConditions
            onOpenBooking={() => {
              if (packages.length > 0) {
                setSelectedPackage(packages[0]);
                setIsBookingModalOpen(true);
              }
            }}
          />
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-5 xl:gap-6 items-stretch pt-2 pb-8">
            {currentCategoryPackages.length > 0 ? (
              currentCategoryPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={activePackageId === pkg.id}
                  onSelect={handleSelectPackage}
                  onBook={handleSelectPackage}
                  onCardClick={handleCardClick}
                />
              ))
            ) : (
              <div
                className={`col-span-full py-16 text-center rounded-3xl ${
                  isDark
                    ? 'bg-[#121212] border border-white/10 text-gray-400'
                    : 'bg-white border border-gray-200 text-gray-600 shadow-sm'
                }`}
              >
                <p className="text-sm">
                  No packages currently in this category. You can add one anytime from the Admin Panel.
                </p>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Footer with Contacts, Location & Secret 2X Tap */}
      <div className="relative z-10 w-full">
        <Footer
          onOpenLocation={() => setIsLocationModalOpen(true)}
          onSecretAdminTrigger={handleSecretAdminTrigger}
        />
      </div>

      {/* Booking & Inquiry Modal - Lazy loaded */}
      <Suspense fallback={null}>
        {isBookingModalOpen && (
          <BookingModal
            pkg={selectedPackage}
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
          />
        )}
      </Suspense>

      {/* Studio Location Modal - Lazy loaded */}
      <Suspense fallback={null}>
        {isLocationModalOpen && (
          <LocationModal
            isOpen={isLocationModalOpen}
            onClose={() => setIsLocationModalOpen(false)}
          />
        )}
      </Suspense>

      {/* Password-Protected Secret Admin Login Modal - Lazy loaded */}
      <Suspense fallback={null}>
        {isAdminLoginOpen && (
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onSuccess={() => {
              setIsAdminLoginOpen(false);
              setIsAdminPanelOpen(true);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLandingPage />
    </AppProvider>
  );
}
