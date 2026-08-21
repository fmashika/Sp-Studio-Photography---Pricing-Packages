import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  LiveSyncStatus,
} from '../types';
import {
  packagesData,
  contactDetails,
  defaultCategories,
  defaultTerms,
} from '../data/pricingData';
import { initialOrders } from '../data/initialData';
import {
  db,
  auth,
  testFirestoreConnection,
  loginWithGoogle,
  logoutUser,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

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

  // Live System Sync & Version
  syncStatus: LiveSyncStatus;
  systemVersion: string;
  lastSyncTime: string | null;
  pushLiveUpdate: () => Promise<boolean>;

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

  // Firebase Auth State
  firebaseUser: FirebaseUser | null;
  loginWithGoogleAuth: () => Promise<void>;
  logoutFirebaseAuth: () => Promise<void>;
  isFirebaseConnected: boolean;

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
  SYSTEM_VERSION: 'sp_studio_sys_ver_v4',
};

const DEFAULT_ADMIN_PASSWORD = 'admin'; // Default initial password
const TZS_TO_USD_RATE = 2600; // Realistic conversion rate for Tanzania Shillings
const CURRENT_APP_VERSION = 'v4.3.0';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync state
  const [syncStatus, setSyncStatus] = useState<LiveSyncStatus>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => new Date().toLocaleTimeString());
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const clientIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));
  const isInitialMount = useRef(true);
  const isRemoteUpdateRef = useRef(false);

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

  // 8. Orders State
  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders;
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

  // 10. Firebase Auth & Connection State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Initialize Firebase Auth Listener & Test Connection
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user && (user.email === 'fadhilimashika@gmail.com' || user.emailVerified)) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogleAuth = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setFirebaseUser(user);
        setIsAdminLoggedIn(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      }
    } catch (err) {
      console.error('Firebase Google Sign In Failed:', err);
      throw err;
    }
  };

  const logoutFirebaseAuth = async () => {
    try {
      await logoutUser();
      setFirebaseUser(null);
      logoutAdmin();
    } catch (err) {
      console.error('Firebase Logout Error:', err);
    }
  };

  // Ref to always access latest state synchronously without re-triggering effects
  const latestStateRef = useRef({
    categories,
    packages,
    terms,
    contacts,
    orders,
    packageTitleFontSizePercent,
  });

  useEffect(() => {
    latestStateRef.current = {
      categories,
      packages,
      terms,
      contacts,
      orders,
      packageTitleFontSizePercent,
    };
  }, [categories, packages, terms, contacts, orders, packageTitleFontSizePercent]);

  // Broadcast sync helper
  const broadcastState = useCallback((statePayload: any) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        if (!broadcastChannelRef.current) {
          broadcastChannelRef.current = new BroadcastChannel('sp_studio_live_sync_v4');
        }
        broadcastChannelRef.current.postMessage({
          type: 'LIVE_UPDATE',
          senderId: clientIdRef.current,
          payload: statePayload,
          timestamp: Date.now(),
        });
      }
    } catch {
      // Ignore broadcast errors in restricted environments
    }
  }, []);

  // Direct Live Server & Firestore Publish function (stable reference, no re-triggering loops)
  const pushLiveUpdate = useCallback(async (): Promise<boolean> => {
    try {
      const currentState = latestStateRef.current;
      const payload = {
        categories: currentState.categories,
        packages: currentState.packages,
        terms: currentState.terms,
        contacts: currentState.contacts,
        orders: currentState.orders,
        packageTitleFontSizePercent: currentState.packageTitleFontSizePercent,
        version: CURRENT_APP_VERSION,
      };

      // 1. Sync to Express Backend
      const res = await fetch('/api/system/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 2. Sync to Firebase Firestore System State (non-blocking)
      try {
        await setDoc(doc(db, 'system_state', 'sp_studio_config'), {
          id: 'sp_studio_config',
          updatedAt: new Date().toISOString(),
          exchangeRate: TZS_TO_USD_RATE,
          categoriesCount: currentState.categories.length,
          packagesCount: currentState.packages.length,
          ordersCount: currentState.orders.length,
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn('Firestore system_state sync note:', firestoreErr);
      }

      if (res.ok) {
        setSyncStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString());
        broadcastState(payload);
        return true;
      }
      setSyncStatus('offline');
      return false;
    } catch (err) {
      console.warn('Live API sync offline/fallback mode active:', err);
      setSyncStatus('offline');
      return false;
    }
  }, [broadcastState]);

  // Comprehensive cleaner: Clears Cookies, CacheStorage, and stale Site Data every 20 seconds
  const clearCookiesAndSiteData = useCallback(async () => {
    try {
      // 1. Clear all browser cookies
      if (typeof document !== 'undefined' && document.cookie) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};SameSite=Lax`;
          }
        }
      }

      // 2. Clear browser CacheStorage (Service Workers & Assets)
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
      }

      // 3. Clear temporary sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch {
      // Non-blocking cleanup
    }
  }, []);

  // Initial Fetch & 20-second Automatic Cookies/Site Data Cleaning + Live Admin Revalidation
  useEffect(() => {
    let isMounted = true;

    const fetchLiveSystem = async () => {
      try {
        // Automatically clean cookies, cache, and site data
        await clearCookiesAndSiteData();

        const res = await fetch(`/api/system?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          const {
            categories: remoteCats,
            packages: remotePkgs,
            terms: remoteTerms,
            contacts: remoteContacts,
            orders: remoteOrders,
            packageTitleFontSizePercent: remoteFontSize,
          } = json.data;

          isRemoteUpdateRef.current = true;

          if (Array.isArray(remoteCats) && remoteCats.length > 0) {
            setCategories(remoteCats);
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(remoteCats));
          }
          if (Array.isArray(remotePkgs) && remotePkgs.length > 0) {
            setPackages(remotePkgs);
            localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(remotePkgs));
          }
          if (Array.isArray(remoteTerms) && remoteTerms.length > 0) {
            setTerms(remoteTerms);
            localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(remoteTerms));
          }
          if (remoteContacts && typeof remoteContacts === 'object') {
            setContacts(remoteContacts);
            localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(remoteContacts));
          }
          if (Array.isArray(remoteOrders)) {
            setOrders(remoteOrders);
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(remoteOrders));
          }
          if (typeof remoteFontSize === 'number') {
            setPackageTitleFontSizePercentState(remoteFontSize);
            localStorage.setItem(STORAGE_KEYS.PACKAGE_TITLE_FONT_SIZE, String(remoteFontSize));
          }
          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString());
        }
      } catch {
        // Fallback to local storage seamlessly
      }
    };

    // Immediate execution on mount
    fetchLiveSystem();

    // Clean cookies and site data automatically every 20 seconds to guarantee all recent admin changes are shown
    const intervalId = setInterval(() => {
      fetchLiveSystem();
    }, 20000);

    // BroadcastChannel listener for instant cross-tab updates
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        broadcastChannelRef.current = new BroadcastChannel('sp_studio_live_sync_v4');
        broadcastChannelRef.current.onmessage = (event) => {
          if (
            event.data &&
            event.data.type === 'LIVE_UPDATE' &&
            event.data.payload &&
            event.data.senderId !== clientIdRef.current
          ) {
            const p = event.data.payload;
            isRemoteUpdateRef.current = true;
            if (Array.isArray(p.categories)) setCategories(p.categories);
            if (Array.isArray(p.packages)) setPackages(p.packages);
            if (Array.isArray(p.terms)) setTerms(p.terms);
            if (p.contacts) setContacts(p.contacts);
            if (Array.isArray(p.orders)) setOrders(p.orders);
            if (typeof p.packageTitleFontSizePercent === 'number') {
              setPackageTitleFontSizePercentState(p.packageTitleFontSizePercent);
            }
            setSyncStatus('synced');
            setLastSyncTime(new Date().toLocaleTimeString());
          }
        };
      } catch {
        // Ignore channel setup error
      }
    }

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [clearCookiesAndSiteData]);

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
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.style.fontSize = '';
    }
  }, [packageTitleFontSizePercent]);

  // Single debounced auto-sync to live server when user modifies data in admin
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      pushLiveUpdate();
    }, 500);

    return () => clearTimeout(timer);
  }, [categories, packages, terms, contacts, orders, packageTitleFontSizePercent, pushLiveUpdate]);

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

    // Persist to Firebase Firestore with strict Error Handling
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
      console.warn('Firebase Firestore Order write note:', err);
      // Non-blocking in UI, wrapped with handleFirestoreError for diagnostics
      try {
        handleFirestoreError(err, OperationType.CREATE, `orders/${newOrder.id}`);
      } catch (e) {
        // Error logged to console for Firestore audit
      }
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    // Sync status change to Firebase Firestore
    updateDoc(doc(db, 'orders', orderId), { status }).catch((err) => {
      console.warn('Firestore update order status note:', err);
    });
  };

  const updateOrder = (orderId: string, updatedFields: Partial<BookingOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updatedFields } : o))
    );

    // Sync order update to Firebase Firestore
    updateDoc(doc(db, 'orders', orderId), updatedFields).catch((err) => {
      console.warn('Firestore update order note:', err);
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    // Delete from Firebase Firestore
    deleteDoc(doc(db, 'orders', orderId)).catch((err) => {
      console.warn('Firestore delete order note:', err);
    });
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
        syncStatus,
        systemVersion: CURRENT_APP_VERSION,
        lastSyncTime,
        pushLiveUpdate,
        firebaseUser,
        loginWithGoogleAuth,
        logoutFirebaseAuth,
        isFirebaseConnected,
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
