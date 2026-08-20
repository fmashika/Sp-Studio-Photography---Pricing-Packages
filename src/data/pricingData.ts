import { PricingPackage, ContactInfo, AppCategory, TermSection } from '../types';

export const contactDetails: ContactInfo = {
  email: 'johanesgabriel08@gmail.com',
  phone: '+255743705912',
  phoneFormatted: '0743 705 912',
  instagram: '@sixtyfour_pictures',
  instagramUrl: 'https://instagram.com/sixtyfour_pictures',
  location: 'DAR FREE MARKET MALL',
  locationDetails: 'Dar Free Market Mall, Ali Hassan Mwinyi Rd, Dar es Salaam, Tanzania',
  whatsappNumber: '255743705912',
};

export const defaultCategories: AppCategory[] = [
  {
    id: 'wedding',
    name: 'WEDDING',
    type: 'packages',
    description: 'Exclusive wedding cinematography and photography coverage tailored for your special day.',
  },
  {
    id: 'sendoff',
    name: 'SEND OFF',
    type: 'packages',
    description: 'Celebratory send-off night and traditional gala coverage with unmatched craftsmanship.',
  },
  {
    id: 'addition',
    name: 'ADDITION SERVICE',
    type: 'packages',
    description: 'Bespoke cinematography add-ons, drone flights, 360 booths, and live broadcast services.',
  },
  {
    id: 'terms',
    name: 'TERMS & CONDITION',
    type: 'terms',
    description: 'Official Sp Studio reservation guidelines, delivery schedules, and client policies.',
  },
];

export const defaultTerms: TermSection[] = [
  {
    id: 'term-1',
    title: '1. Booking & Reservation Policy',
    points: [
      'A non-refundable deposit of 40% is required to secure and lock your date on our studio calendar.',
      'Dates are reserved on a first-come, first-served basis upon receipt of the initial deposit.',
      'The remaining balance (60%) must be settled on or before the event date prior to post-production delivery.',
    ],
  },
  {
    id: 'term-2',
    title: '2. Production & Delivery Timelines',
    points: [
      'Short social media teaser highlight clip delivered within 72 hours following the event.',
      'Full edited photo gallery and high-resolution digital media delivered within 14 to 21 business days.',
      'Custom printed photobooks, wooden frames, and flash disks delivered within 30 days after photo selection.',
    ],
  },
  {
    id: 'term-3',
    title: '3. Rescheduling & Usage Rights',
    points: [
      'Event date rescheduling is permitted subject to crew availability if requested at least 30 days prior.',
      'Clients receive full personal printing and digital sharing rights for all delivered photos and films.',
      'In unforeseen circumstances (Force Majeure), Sp Studio will work cooperatively with the client to allocate alternate dates.',
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
    name: 'BRONZE EXCLUSIVE',
    price: 'TZS 2,500,000/-',
    rawPrice: 2500000,
    iconType: 'shield',
    featured: true,
    badge: 'EXCLUSIVE',
    buttonLabel: 'Book Now',
    features: [
      'Full Day Coverage',
      '1 Video Camera & 1 Videographer',
      '1 Photographer Professional',
      'Three 55 Inch Smart TVs at Venue',
      'Photo Book (200 Pictures)',
      'A2 Bridal Frame',
      '32GB Flash Disk (2)',
      'Pre Wedding Photo Shoot',
      'Highlights Video Clip',
      'Online Gallery Access',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Day Event Coverage',
          '1 Video Camera & 1 Videographer Professional',
          '1 Lead Photographer Professional',
          'Three 55 Inch Smart TVs at Venue',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Pre-Wedding Photo Shoot Session',
          'Cinematic Highlights Video Clip',
          'Photo Book (200 Pictures Custom Design)',
          'A2 Custom Bridal Wooden Frame',
          'Two 32GB Flash Disks (All Raw + Edited)',
          'Private Online Cloud Gallery Access',
        ],
      },
    ],
  },
  {
    id: 'silver-wedding',
    categoryId: 'wedding',
    name: 'SILVER VIP',
    price: 'TZS 3,900,000/-',
    rawPrice: 3900000,
    iconType: 'camera',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      '4K Aerial Air Drone Coverage',
      '2 Video Cameras & 2 Videographers',
      '1 Lead Photographer',
      'Four 55 Inch Smart TVs at Venue',
      'Photo Book (350 Pictures)',
      'A2 Premium Bridal Frame',
      'Two 32GB Flash Disks',
      'Pre-Wedding Photos & Video Teaser',
      'Extended Highlights & Full Ceremony Reel',
      'Online Gallery 400+ HD Photos',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          '4K Aerial Drone Cinematography',
          '2 High-End Cinema Cameras & 2 Videographers',
          '1 Lead Event Photographer',
          'Four 55 Inch Smart Screens at Venue',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Pre-Wedding Shoot & Video Teaser',
          'Extended Cinematic Highlights Reel',
          'Luxury Photo Book (350 Pictures)',
          'A2 Premium Bridal Frame',
          'Two 32GB High-Speed Flash Disks',
          'Cloud Online Gallery with 1 Year Access',
        ],
      },
    ],
  },
  {
    id: 'gold-wedding',
    categoryId: 'wedding',
    name: 'GOLD ROYAL VIP',
    price: 'TZS 5,700,000/-',
    rawPrice: 5700000,
    iconType: 'crown',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      '4K Drone + 360 Spin Photo Booth',
      '3 Cinema Video Cameras & 3 Videographers',
      '2 Professional Photographers',
      'YouTube Live Stream Multi-Cam Broadcast',
      'Six 55 Inch Smart TVs',
      'Grand Deluxe Photo Book (400 Pictures)',
      'A2 Premium Bridal Frame + Pre-Wedding Frame',
      'Two 64GB Flash Disks in Custom Wood Box',
      'Full Wedding Film + Social Media Teasers',
      'Permanent Online Cloud Gallery',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          '4K Aerial Drone Cinematography',
          'Interactive 360 Degree Video Booth',
          'Multi-Cam YouTube Live Stream Broadcast',
          '3 Cinema Video Cameras & 3 Videographers',
          '2 Lead Photographers',
          'Six 55 Inch Smart Screens at Venue',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Pre-Wedding Photo Shoot & Love Story Clip',
          'Full Wedding Film Documentary + Reels',
          'Grand Deluxe Photo Book (400 Pictures)',
          'A2 Bridal Frame & Couple Portrait Frame',
          'Two 64GB Flash Disks in Engraved Wooden Box',
          'Permanent High-Resolution Online Gallery',
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
    iconType: 'sparkles',
    featured: false,
    buttonLabel: 'Book Now',
    features: [
      'Full Send Off Evening Coverage',
      'One Lead Photographer & One Videographer',
      'Two 65 inches flat screens at the venue',
      'Cinematic Send Off Video highlight',
      'One A3 Wooden Frame',
      'One A3 Photobook (150 Pictures)',
      'Flash Disk with all Photos & Videos',
      'Online gallery 150 HD images',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Full Send Off Night Coverage',
          'One Lead Photographer & One Videographer',
          'Two 65 inches flat screens at the venue',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Send Off Highlights Video Reel',
          'One A3 Wooden Framed Portrait',
          'One A3 Photobook (150 Pictures)',
          'Custom Flash Disk with all Photos & Videos',
          'Online gallery with full download access',
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
      'Two Videographers & One Lead Photographer',
      'Three 65 inches flat screens at the venue',
      'Extended Highlights & Entrance Reel',
      'Two A3 Luxury Wooden Frames',
      'One Deluxe Photobook (200 Pictures)',
      'Two Flash Disks (Raw + Master Cut)',
      'Online Cloud Gallery (300+ HD Photos)',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          'Complete Send Off Gala Coverage',
          'Two Videographers & One Lead Photographer',
          'Three 65 inches flat screens at the venue',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Cinematic Send Off Highlights & Speech Reels',
          'Two A3 Luxury Wooden Frames',
          'One Deluxe Photobook (200 Pictures)',
          'Two 32GB Flash Disks (Raw + Master Cut)',
          'Online Cloud Gallery (300+ HD Photos)',
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
      '4K Drone + 360 Spin Photo Booth',
      '3 Videographers & 2 Lead Photographers',
      'Four 65 inches flat screens at venue',
      'Live Stream YouTube Broadcast',
      'Two A2 Premium Wooden Frames',
      'Luxury Photobook (300 Pictures)',
      'Two Engraved Wooden Box Flash Disks',
      'Full Documentary Film + Instagram Teaser',
    ],
    sections: [
      {
        subtitle: 'Video and Photo Coverage:',
        items: [
          '4K Aerial Drone Coverage & 360 Video Booth',
          '3 Professional Videographers & 2 Lead Photographers',
          'Four 65 inches flat screens at venue',
          'Live Stream YouTube Broadcast',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Full Send Off Documentary Film + Reels',
          'Two A2 Premium Wooden Frames',
          'Luxury Photobook (300 Pictures)',
          'Two Engraved Wooden Box Flash Disks',
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
    badge: 'POPULAR ADD-ON',
    buttonLabel: 'Book Now',
    features: [
      'Certified Drone Pilot Operator',
      'Ultra HD 4K Cinematic Aerial Footage',
      'Venue, Entrance & Grand Reception Shots',
      'Color Graded Drone Highlight Clip',
      'Raw 4K Aerial Video Files on Flash Disk',
    ],
    sections: [
      {
        subtitle: 'Coverage Scope:',
        items: [
          'Certified Commercial Drone Pilot',
          'Ultra HD 4K Cinematic Aerial Angles',
          'Outdoor Entrance & Venue Landscape Coverage',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Color Graded Drone Highlight Reel',
          'All Unedited Raw 4K Aerial Clips',
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
      'Full Evening 360 Video Booth Machine',
      'Studio Ring Lighting & Fun Party Props',
      'Instant Guest QR Code & AirDrop Video Share',
      'Custom Branded Overlay with Bride & Groom Names',
      'Dedicated Booth Attendant & Director',
    ],
    sections: [
      {
        subtitle: 'Experience & Setup:',
        items: [
          'Motorized 360 Rotating Spin Platform',
          'High-Speed Slow Motion Camera Rig',
          'RGB Studio Ring Lighting & Premium Props',
          'Dedicated On-Site Booth Attendant',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Instant QR Code / AirDrop to Guests Phones',
          'Custom Overlay with Couple Names & Date',
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
      'Multi-Camera Live Production Switcher',
      'Full HD YouTube & Facebook Live Broadcast',
      'Crystal Clear Audio Feed from Sound Board',
      'Custom Title Cards, Lower Thirds & Slides',
      'Archived Full Stream Recording in 1080p',
    ],
    sections: [
      {
        subtitle: 'Broadcast System:',
        items: [
          '2 Dedicated Streaming Cinema Cameras',
          'Direct Audio Board Integration for Clear Sound',
          'Bonded 5G High-Speed Internet Setup',
          'Custom Graphics & Couple Name Lower Thirds',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          'Private or Public YouTube Broadcast Link',
          'Permanent Full HD Master Archive Video',
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
      '3-Hour Outdoor / Studio Photo Session',
      '2 Outfit Changes & Creative Direction',
      '30 Retouched High-Resolution Portraits',
      'One A2 Framed Couple Portrait for Reception',
      'Digital Invitation Teaser Reel for Instagram',
    ],
    sections: [
      {
        subtitle: 'Session Details:',
        items: [
          '3-Hour Dedicated Creative Photo Shoot',
          'Up to 2 Outfit Changes & Posing Direction',
          'Location Selection Consultation',
        ],
      },
      {
        subtitle: 'Deliverable Includes:',
        items: [
          '30 Master Retouched High-Res Photos',
          'One A2 Framed Couple Portrait for Venue Entrance',
          'Instagram Invitation Video Reel',
        ],
      },
    ],
  },
];
