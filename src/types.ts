export interface PackageFeatureSection {
  subtitle: string; // e.g. "Video and Photo Coverage:" or "Deliverable Includes:"
  items: string[];
}

export type IconStyleType =
  | 'none'
  | 'star'
  | 'shield'
  | 'camera'
  | 'video'
  | 'crown'
  | 'sparkles'
  | 'heart'
  | 'gem'
  | 'flame'
  | 'award'
  | 'film'
  | 'tv'
  | 'aperture'
  | 'music';

export type CurrencyType = 'TZS' | 'USD';
export type ThemeMode = 'dark' | 'light';

export interface SavedCustomerDetails {
  clientName: string;
  phone: string;
  eventDate: string;
  eventType: string;
  notes?: string;
}

export interface PricingPackage {
  id: string;
  categoryId: string; // 'wedding' | 'sendoff' | custom
  name: string;
  price: string;
  rawPrice: number;
  featured?: boolean;
  badge?: string;
  iconType: IconStyleType | string;
  features: string[]; // flat list fallback
  sections?: PackageFeatureSection[]; // grouped by subtitles
  buttonLabel?: string;
}

export interface AppCategory {
  id: string;
  name: string; // 'Wedding Packages', 'Send Off Packages', 'Terms & Conditions', etc.
  type: 'packages' | 'terms';
  badge?: string;
  description?: string;
}

export interface TermSection {
  id: string;
  title: string;
  points: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  phoneFormatted: string;
  instagram: string;
  instagramUrl: string;
  location: string;
  locationDetails: string;
  whatsappNumber: string;
  studioHours?: string;
}

export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingOrder {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO date string
  clientName: string;
  phone: string;
  eventDate: string;
  eventType: string;
  packageId: string;
  packageName: string;
  packagePrice: string;
  packageRawPrice: number;
  notes?: string;
  status: OrderStatus;
  adminNotes?: string;
}
