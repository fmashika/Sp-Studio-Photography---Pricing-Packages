import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PricingPackage,
  ContactInfo,
  BookingOrder,
  OrderStatus,
  AppCategory,
  TermSection,
  CurrencyType,
  ThemeMode,
  SavedCustomerDetails,
} from '../types';
import {
  packagesData,
  contactDetails,
  defaultCategories,
  defaultTerms,
} from '../data/pricingData';
import { initialOrders } from '../data/initialData';

interface AppContextType {
  // Theme & Currency
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  currency: CurrencyType;
  toggleCurrency: () => void;
  setCurrency: (curr: CurrencyType) => void;
  formatPrice: (rawPrice: number, fallbackTzs?: string) => string;
  packageTitleFontSizePercent: number;
  setPackageTitleFontSizePercent: (val: number) => void;

  // Customer autofill & persistence
  savedCustomer: SavedCustomerDetails | null;
  saveCustomerDetails: (details: SavedCustomerDetails) => void;
  clearSavedCustomer: () => void;

  // Core Data
  packages: PricingPackage[];
  categories: AppCategory[];
  activeCategoryId: string;
  terms: TermSection[];
  contacts: ContactInfo;
  orders: BookingOrder[];
  isAdminLoggedIn: boolean;
  unreadOrdersCount: number;
  setActiveCategoryId: (categoryId: string) => void;

  // Category management
  addCategory: (cat: Omit<AppCategory, 'id'>) => AppCategory;
  updateCategory: (categoryId: string, fields: Partial<AppCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (fromIndex: number, toIndex: number) => void;
  setCategoriesList: (cats: AppCategory[]) => void;

  // Terms management
  addTermSection: (section: Omit<TermSection, 'id'>) => void;
  updateTermSection: (sectionId: string, fields: Partial<TermSection>) => void;
  deleteTermSection: (sectionId: string) => void;
  reorderTerms: (fromIndex: number, toIndex: number) => void;
  setTermsList: (terms: TermSection[]) => void;

  // Orders management
  addOrder: (order: Omit<BookingOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => BookingOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrder: (orderId: string, updatedFields: Partial<BookingOrder>) => void;
  deleteOrder: (orderId: string) => void;

  // Package management
  updatePackage: (packageId: string, updatedFields: Partial<PricingPackage>) => void;
  addPackage: (newPkg: Omit<PricingPackage, 'id'>) => void;
  deletePackage: (packageId: string) => void;
  reorderPackages: (fromIndex: number, toIndex: number) => void;
  setPackagesList: (pkgs: PricingPackage[]) => void;

  // Contacts
  updateContacts: (updatedContacts: Partial<ContactInfo>) => void;

  // Admin Auth
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'sp_studio_theme_v4',
  CURRENCY: 'sp_studio_currency_v4',
  PACKAGE_TITLE_FONT_SIZE: 'sp_studio_pkg_title_font_size_v4',
  SAVED_CUSTOMER: 'sp_studio_customer_details_v4',
  PACKAGES: 'sp_studio_packages_v4',
  CATEGORIES: 'sp_studio_categories_v4',
  TERMS: 'sp_studio_terms_v4',
  CONTACTS: 'sp_studio_contacts_v4',
  ORDERS: 'sp_studio_orders_v4',
  ADMIN_AUTH: 'sp_studio_admin_auth_v4',
  ADMIN_PWD: 'sp_studio_admin_pwd_v4',
};

const DEFAULT_ADMIN_PASSWORD = 'admin'; // Default initial password
const TZS_TO_USD_RATE = 2600; // Realistic conversion rate for Tanzania Shillings

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme State (Dark by default, toggles to Light)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // 2. Currency State (TZS by default, toggles to USD)
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return saved === 'USD' ? 'USD' : 'TZS';
    } catch {
      return 'TZS';
    }
  });

  // 3. Package Title Font Size Scaling Percentage (1% to 100%, defaults to 100%)
  const [packageTitleFontSizePercent, setPackageTitleFontSizePercentState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGE_TITLE_FONT_SIZE);
      if (saved) {
        const val = Number(saved);
        if (!isNaN(val) && val >= 1 && val <= 100) return val;
      }
      return 100;
    } catch {
      return 100;
    }
  });

  const setPackageTitleFontSizePercent = (val: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(val)));
    setPackageTitleFontSizePercentState(clamped);
  };

  // 3. Saved Customer Details (Remembered to reduce duplicate typing)
  const [savedCustomer, setSavedCustomer] = useState<SavedCustomerDetails | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_CUSTOMER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Categories State
  const [categories, setCategories] = useState<AppCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const [activeCategoryId, setActiveCategoryId] = useState<string>('wedding');

  // 5. Terms State (Default 3 Sections)
  const [terms, setTerms] = useState<TermSection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TERMS);
      return saved ? JSON.parse(saved) : defaultTerms;
    } catch {
      return defaultTerms;
    }
  });

  // 6. Packages State
  const [packages, setPackages] = useState<PricingPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return saved ? JSON.parse(saved) : packagesData;
    } catch {
      return packagesData;
    }
  });

  // 7. Contacts State
  const [contacts, setContacts] = useState<ContactInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return saved ? JSON.parse(saved) : contactDetails;
    } catch {
      return contactDetails;
    }
  });

  // 8. Orders State (Starts EMPTY for clean admin view without demo noise)
  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders; // initialOrders is []
    } catch {
      return [];
    }
  });

  // 9. Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  useEffect(() => {
    if (savedCustomer) {
      localStorage.setItem(STORAGE_KEYS.SAVED_CUSTOMER, JSON.stringify(savedCustomer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SAVED_CUSTOMER);
    }
  }, [savedCustomer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(terms));
  }, [terms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGE_TITLE_FONT_SIZE, String(packageTitleFontSizePercent));
    // Ensure documentElement font size is reset to normal
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.style.fontSize = '';
    }
  }, [packageTitleFontSizePercent]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Currency
  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'TZS' ? 'USD' : 'TZS'));
  };

  // Dynamic Price Formatter based on active currency
  const formatPrice = (rawPrice: number, fallbackTzs?: string): string => {
    if (currency === 'USD') {
      const usdValue = Math.round(rawPrice / TZS_TO_USD_RATE);
      return `$${usdValue.toLocaleString('en-US')} USD`;
    }
    if (rawPrice && rawPrice > 0) {
      return `TZS ${rawPrice.toLocaleString('en-US')}/-`;
    }
    return fallbackTzs || 'TZS 0/-';
  };

  // Save / Clear Customer Details
  const saveCustomerDetails = (details: SavedCustomerDetails) => {
    setSavedCustomer(details);
  };

  const clearSavedCustomer = () => {
    setSavedCustomer(null);
  };

  const unreadOrdersCount = orders.filter((o) => o.status === 'new').length;

  // Category Actions
  const addCategory = (catData: Omit<AppCategory, 'id'>): AppCategory => {
    const slug = catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory: AppCategory = {
      ...catData,
      id: `${slug}-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (categoryId: string, fields: Partial<AppCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...fields } : c))
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (activeCategoryId === categoryId) {
      const remaining = categories.filter((c) => c.id !== categoryId);
      if (remaining.length > 0) {
        setActiveCategoryId(remaining[0].id);
      }
    }
  };

  const reorderCategories = (fromIndex: number, toIndex: number) => {
    setCategories((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  const setCategoriesList = (cats: AppCategory[]) => {
    setCategories(cats);
  };

  // Terms Actions
  const addTermSection = (section: Omit<TermSection, 'id'>) => {
    const newSection: TermSection = {
      ...section,
      id: `term-${Date.now()}`,
    };
    setTerms((prev) => [...prev, newSection]);
  };

  const updateTermSection = (sectionId: string, fields: Partial<TermSection>) => {
    setTerms((prev) =>
      prev.map((t) => (t.id === sectionId ? { ...t, ...fields } : t))
    );
  };

  const deleteTermSection = (sectionId: string) => {
    setTerms((prev) => prev.filter((t) => t.id !== sectionId));
  };

  const reorderTerms = (fromIndex: number, toIndex: number) => {
    setTerms((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  const setTermsList = (newTerms: TermSection[]) => {
    setTerms(newTerms);
  };

  // Order Actions
  const addOrder = (orderData: Omit<BookingOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>): BookingOrder => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: BookingOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `#SP-${randomNum}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateOrder = (orderId: string, updatedFields: Partial<BookingOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updatedFields } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Package Actions
  const updatePackage = (packageId: string, updatedFields: Partial<PricingPackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, ...updatedFields } : p))
    );
  };

  const addPackage = (newPkgData: Omit<PricingPackage, 'id'>) => {
    const newPackage: PricingPackage = {
      ...newPkgData,
      id: `pkg-${Date.now()}`,
    };
    setPackages((prev) => [...prev, newPackage]);
  };

  const deletePackage = (packageId: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== packageId));
  };

  const reorderPackages = (fromIndex: number, toIndex: number) => {
    setPackages((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  const setPackagesList = (pkgs: PricingPackage[]) => {
    setPackages(pkgs);
  };

  // Contacts
  const updateContacts = (updatedFields: Partial<ContactInfo>) => {
    setContacts((prev) => ({ ...prev, ...updatedFields }));
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    const currentPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || DEFAULT_ADMIN_PASSWORD;
    if (password === currentPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const changeAdminPassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    const currentPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || DEFAULT_ADMIN_PASSWORD;
    if (oldPass !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (newPass.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters.' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, newPass);
    return { success: true, message: 'Password updated successfully.' };
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TERMS);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PWD);
    localStorage.removeItem(STORAGE_KEYS.PACKAGE_TITLE_FONT_SIZE);
    setPackages(packagesData);
    setCategories(defaultCategories);
    setTerms(defaultTerms);
    setContacts(contactDetails);
    setOrders([]); // Clean empty orders
    setActiveCategoryId('wedding');
    setPackageTitleFontSizePercent(100);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        currency,
        toggleCurrency,
        setCurrency,
        formatPrice,
        packageTitleFontSizePercent,
        setPackageTitleFontSizePercent,
        savedCustomer,
        saveCustomerDetails,
        clearSavedCustomer,
        packages,
        categories,
        activeCategoryId,
        terms,
        contacts,
        orders,
        isAdminLoggedIn,
        unreadOrdersCount,
        setActiveCategoryId,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        setCategoriesList,
        addTermSection,
        updateTermSection,
        deleteTermSection,
        reorderTerms,
        setTermsList,
        addOrder,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        updatePackage,
        addPackage,
        deletePackage,
        reorderPackages,
        setPackagesList,
        updateContacts,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
