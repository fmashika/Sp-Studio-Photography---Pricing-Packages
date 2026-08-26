import { PricingPackage, ContactInfo, AppCategory, TermSection } from '../types';

export const EVENT_TYPE_OPTIONS: string[] = [
  'Wedding & reception',
  'Send-off',
  'Kitchen Party',
  'Pre-wedding Shoot',
  'Corporate event',
  'Gala',
  'Commercial',
  'Studio Shoot',
  'Photoshoot',
  'Other celebration',
];

export const contactDetails: ContactInfo = {};

export const defaultCategories: AppCategory[] = [
  {
    "id": "1",
    "name": "Cat1"
  }
];

export const defaultTerms: TermSection[] = [];

export const packagesData: PricingPackage[] = [
  {
    "id": "test",
    "title": "Real Test",
    "price": "200"
  }
];
