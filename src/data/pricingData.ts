import { PricingPackage, ContactInfo, AppCategory, TermSection } from '../types';

export const contactDetails: ContactInfo = {
  email: 'johanesgabriel08@gmail.com',
  phone: '+255743705912',
  phoneFormatted: '0743 705 912',
  instagram: '@sixtyfour_pictures',
  instagramUrl: 'https://instagram.com/sixtyfour_pictures',
  location: 'SINZA MORI DAR ES SALAAM',
  locationDetails: 'Sinza, Dar es Salaam, Tanzania',
  whatsappNumber: '255743705912',
};

export const defaultCategories: AppCategory[] = [
  {
    id: 'wedding',
    name: 'Wedding Packages',
    type: 'packages',
    badge: 'POPULAR',
    description: 'Exclusive wedding cinematography and photography coverage tailored for your special day.',
  },
  {
    id: 'sendoff',
    name: 'Send Off',
    type: 'packages',
    badge: 'EVENT',
    description: 'Celebratory send-off night and traditional gala coverage with unmatched craftsmanship.',
  },
  {
    id: 'addition',
    name: 'Addition Service',
    type: 'packages',
    badge: 'ADD-ON',
    description: 'Bespoke cinematography add-ons, drone flights, 360 booths, and live broadcast services.',
  },
  {
    id: 'terms',
    name: 'Terms & Conditions',
    type: 'terms',
    badge: 'POLICY',
    description: 'Official Sp Studio reservation guidelines, delivery schedules, and client policies.',
  },
];

export const defaultTerms: TermSection[] = [
  {
    id: 'term-1',
    title: '40% deposit to confirm your booking & date',
    points: [
      'Asilimia 40 ya thamani ya package yako uliochagua inatakiwa ilipiwe kubook tarehe yako. Hatuweki tarehe ambazo hazijalipiwa.',
    ],
  },
  {
    id: 'term-2',
    title: 'Remaining 60% should be paid one week before the event with all the weeding information',
    points: [
      'Asilimia 60 inayobaki italipiwa wiki moja kabla ya tarehe ya shughuli na kuhakiki taarifa zote.',
    ],
  },
  {
    id: 'term-3',
    title: 'All delivery of soft & hard copies will be done 3-5 weeks after the main event',
    points: [
      'Kazi zote zitakabidhiwa wiki 3-5 baada ya shughuli.',
    ],
  },
];

export const packagesData: PricingPackage[] = [
  // ================= WEDDING PACKAGES =================
  {
    id: 'standard-wedding',
    categoryId: 'wedding',
    name: 'STANDARD PACKAGE',
    price: 'TZS 2,000,000/-',
    rawPrice: 2000000,
    iconType: 'star',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Full Coverage',
      'One Photographer & one Videographer Professionals',
      'Three 65 inches flat screen at the venue',
      'Video highlight',
      'Two A3 wooden Frames',
      'One A3 Photobook Professional designed',
      'One flash disk with all Photos & Videos',
      'Online gallery 200 high resolution images & 6 months access',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Coverage',
          'One Photographer & one Videographer Professionals',
          'Three 65 inches flat screen at the venue',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Video highlight',
          'Two A3 wooden Frames',
          'One A3 Photobook Professional designed',
          'One flash disk with all Photos & Videos',
          'Online gallery 200 high resolution images & 6 months access',
        ],
      },
    ],
  },
  {
    id: 'bronze-wedding',
    categoryId: 'wedding',
    name: 'CLASSIC PACKAGE ',
    price: 'TZS 3,000,000',
    rawPrice: 3000000,
    iconType: 'flame',
    featured: true,
    badge: 'POPULAR',
    buttonLabel: 'Book Now',
    features: [
      'Full Coverage',
      'Two Photographer & Two Videographer Professionals',
      'Four 65 inches flat screen at the venue',
      'Pre wedding session',
      'Video highlight',
      'Drone footage',
      'Two wooden frames A2 & A3',
      'One A3 Photobook Professional designed',
      'One flash disk with all Photos & Videos',
      'Online gallery 300 high-resolution images & 6 months access',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Coverage',
          'Two Photographer & Two Videographer Professionals',
          'Four 65 inches flat screen at the venue',
          'Pre wedding session',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Video highlight',
          'Drone footage',
          'Two wooden frames A2 & A3',
          'One A3 Photobook Professional designed',
          'One flash disk with all Photos & Videos',
          'Online gallery 300 high-resolution images & 6 months access',
        ],
      },
    ],
  },
  {
    id: 'silver-wedding',
    categoryId: 'wedding',
    name: 'ULTIMATE PACKAGE ',
    price: 'TZS 4,500,000',
    rawPrice: 4500000,
    iconType: 'gem',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Full Coverage',
      'Two Photographer & Two Videographer Professionals',
      'One assistant photographer & videographer',
      'Six 65 inches flat screen at the venue',
      'Pre wedding session',
      'Video highlight',
      'Drone footage',
      '360 Videos booth',
      'Two A2 wooden frames',
      'One A3 Photobook Professional designed',
      'Two flash disks with all Photos & Videos',
      'Online gallery 400 high-resolution images & 6 months',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Coverage',
          'Two Photographer & Two Videographer Professionals',
          'One assistant photographer & videographer',
          'Six 65 inches flat screen at the venue',
          'Pre wedding session',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Video highlight',
          'Drone footage',
          '360 Videos booth',
          'Two A2 wooden frames',
          'One A3 Photobook Professional designed',
          'Two flash disks with all Photos & Videos',
          'Online gallery 400 high-resolution images & 6 months',
        ],
      },
    ],
  },
  {
    id: 'gold-wedding',
    categoryId: 'wedding',
    name: 'PREMIUM PACKAGE',
    price: 'TZS 5,800,000',
    rawPrice: 5800000,
    iconType: 'crown',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Full Coverage',
      'Two Photographer & THREE Videographer Professionals',
      'One assistant photographer & videographer',
      'EIGHT 65 inches flat screen at the venue',
      'Pre wedding session',
      'Video highlight',
      'Drone footage',
      '360 Videos booth',
      'THREE A2 wooden frames',
      'One A3 Photobook Professional designed',
      'Two flash disks with all Photos & Videos',
      'Online gallery 600 high-resolution images & ONE YEAR access',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Coverage',
          'Two Photographer & THREE Videographer Professionals',
          'One assistant photographer & videographer',
          'EIGHT 65 inches flat screen at the venue',
          'Pre wedding session',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Video highlight',
          'Drone footage',
          '360 Videos booth',
          'THREE A2 wooden frames',
          'One A3 Photobook Professional designed',
          'Two flash disks with all Photos & Videos',
          'Online gallery 600 high-resolution images & ONE YEAR access',
        ],
      },
    ],
  },

  // ================= SEND OFF PACKAGES =================
  {
    id: 'sendoff-standard',
    categoryId: 'sendoff',
    name: 'STANDARD SEND OFF',
    price: 'TZS 1,800,000/-',
    rawPrice: 1800000,
    iconType: 'star',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Full Send Off Night Coverage',
      'Custom Flash Disk with all Photos & Videos',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Send Off Night Coverage',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Custom Flash Disk with all Photos & Videos',
        ],
      },
    ],
  },
  {
    id: 'sendoff-exclusive',
    categoryId: 'sendoff',
    name: 'EXCLUSIVE SEND OFF',
    price: 'TZS 2,400,000/-',
    rawPrice: 2400000,
    iconType: 'flame',
    featured: true,
    badge: 'POPULAR',
    buttonLabel: 'Book Now',
    features: [
      'Complete Send Off Gala Coverage',
      'Two 32GB Flash Disks (Raw + Master Cut)',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Complete Send Off Gala Coverage',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Two 32GB Flash Disks (Raw + Master Cut)',
        ],
      },
    ],
  },
  {
    id: 'sendoff-royal',
    categoryId: 'sendoff',
    name: 'ROYAL SEND OFF VIP',
    price: 'TZS 3,500,000/-',
    rawPrice: 3500000,
    iconType: 'crown',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      '4K Aerial Drone Coverage & 360 Video Booth',
      'Permanent Cloud Gallery with 1 Year Access',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          '4K Aerial Drone Coverage & 360 Video Booth',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Permanent Cloud Gallery with 1 Year Access',
        ],
      },
    ],
  },

  // ================= ADDITION SERVICE PACKAGES =================
  {
    id: 'addition-drone',
    categoryId: 'addition',
    name: '4K AERIAL DRONE PILOT',
    price: 'TZS 450,000/-',
    rawPrice: 450000,
    iconType: 'camera',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Certified Commercial Drone Pilot',
      'Color Graded Drone Highlight Reel',
    ],
    sections: [
      {
        subtitle: 'Coverage Scope:',
        items: [
          'Certified Commercial Drone Pilot',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Color Graded Drone Highlight Reel',
        ],
      },
    ],
  },
  {
    id: 'addition-360booth',
    categoryId: 'addition',
    name: '360 SPIN VIDEO BOOTH',
    price: 'TZS 650,000/-',
    rawPrice: 650000,
    iconType: 'aperture',
    featured: true,
    badge: 'INTERACTIVE',
    buttonLabel: 'Book Now',
    features: [
      'RGB Studio Ring Lighting & Premium Props',
      'Full Cloud Gallery with All 360 Guest Videos',
    ],
    sections: [
      {
        subtitle: 'Experience & Setup:',
        items: [
          'RGB Studio Ring Lighting & Premium Props',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Full Cloud Gallery with All 360 Guest Videos',
        ],
      },
    ],
  },
  {
    id: 'addition-livestream',
    categoryId: 'addition',
    name: 'MULTI-CAM LIVE STREAMING',
    price: 'TZS 800,000/-',
    rawPrice: 800000,
    iconType: 'tv',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Custom Graphics & Couple Name Lower Thirds',
      'Private or Public YouTube Broadcast Link',
    ],
    sections: [
      {
        subtitle: 'Broadcast System:',
        items: [
          'Custom Graphics & Couple Name Lower Thirds',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Private or Public YouTube Broadcast Link',
        ],
      },
    ],
  },
  {
    id: 'addition-prewedding',
    categoryId: 'addition',
    name: 'PRE-WEDDING PHOTOSHOOT',
    price: 'TZS 500,000/-',
    rawPrice: 500000,
    iconType: 'heart',
    featured: false,
    badge: 'ROMANTIC',
    buttonLabel: 'Book Now',
    features: [
      '3-Hour Dedicated Creative Photo Shoot',
      'Instagram Invitation Video Reel',
    ],
    sections: [
      {
        subtitle: 'Session Details:',
        items: [
          '3-Hour Dedicated Creative Photo Shoot',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Instagram Invitation Video Reel',
        ],
      },
    ],
  },
];
