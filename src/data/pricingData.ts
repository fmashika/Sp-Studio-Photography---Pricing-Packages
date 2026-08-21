import { PricingPackage, ContactInfo, AppCategory, TermSection } from '../types';

export const contactDetails: ContactInfo = {
  "email": "johanesgabriel08@gmail.com",
  "phone": "+255743705912",
  "phoneFormatted": "0743 705 912",
  "instagram": "@sixtyfour_pictures",
  "instagramUrl": "https://instagram.com/sixtyfour_pictures",
  "location": "SINZA MORI DAR ES SALAAM",
  "locationDetails": "Sinza, Dar es Salaam, Tanzania",
  "whatsappNumber": "255743705912"
};

export const defaultCategories: AppCategory[] = [
  {
    "id": "wedding",
    "name": "Wedding",
    "type": "packages",
    "badge": "POPULAR",
    "description": "Exclusive wedding cinematography and photography coverage tailored for your special day."
  },
  {
    "id": "sendoff",
    "name": "Send Off",
    "type": "packages",
    "badge": "EVENT",
    "description": "Celebratory send-off night and traditional gala coverage with unmatched craftsmanship."
  },
  {
    "id": "addition",
    "name": "Addition Service",
    "type": "packages",
    "badge": "ADD-ON",
    "description": "Bespoke cinematography add-ons, drone flights, 360 booths, studio shoots, and custom frames."
  },
  {
    "id": "terms",
    "name": "Terms & Conditions",
    "type": "terms",
    "badge": "POLICY",
    "description": "Official Sp Studio reservation guidelines, delivery schedules, and client policies."
  }
];

export const defaultTerms: TermSection[] = [
  {
    "id": "term-1",
    "title": "40% deposit to confirm your booking & date",
    "points": [
      "Asilimia 40 ya thamani ya package yako uliochagua inatakiwa ilipiwe kubook tarehe yako. Hatuweki tarehe ambazo hazijalipiwa."
    ]
  },
  {
    "id": "term-2",
    "title": "Remaining 60% should be paid one week before the event with all the weeding information",
    "points": [
      "Asilimia 60 inayobaki italipiwa wiki moja kabla ya tarehe ya shughuli na kuhakiki taarifa zote."
    ]
  },
  {
    "id": "term-3",
    "title": "All delivery of soft & hard copies will be done 3-5 weeks after the main event",
    "points": [
      "Kazi zote zitakabidhiwa wiki 3-5 baada ya shughuli."
    ]
  }
];

export const packagesData: PricingPackage[] = [
  {
    "id": "standard-wedding",
    "categoryId": "wedding",
    "name": "STANDARD PACKAGE",
    "price": "TZS 2,000,000/-",
    "rawPrice": 2000000,
    "iconType": "star",
    "featured": false,
    "buttonLabel": "Book Now",
    "features": [
      "Full Coverage",
      "One Photographer & one Videographer Professionals",
      "Three 65 inches flat screen at the venue",
      "Video highlight",
      "Two A3 wooden Frames",
      "One A3 Photobook Professional designed",
      "One flash disk with all Photos & Videos",
      "Online gallery 200 high resolution images & 6 months access"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full Coverage",
          "One Photographer & one Videographer Professionals",
          "Three 65 inches flat screen at the venue"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "Video highlight",
          "Two A3 wooden Frames",
          "One A3 Photobook Professional designed",
          "One flash disk with all Photos & Videos",
          "Online gallery 200 high resolution images & 6 months access"
        ]
      }
    ]
  },
  {
    "id": "bronze-wedding",
    "categoryId": "wedding",
    "name": "CLASSIC PACKAGE ",
    "price": "TZS 3,000,000",
    "rawPrice": 3000000,
    "iconType": "flame",
    "featured": true,
    "badge": "POPULAR",
    "buttonLabel": "Book Now",
    "features": [
      "Full Coverage",
      "Two Photographer & Two Videographer Professionals",
      "Four 65 inches flat screen at the venue",
      "Pre wedding session",
      "Video highlight",
      "Drone footage",
      "Two wooden frames A2 & A3",
      "One A3 Photobook Professional designed",
      "One flash disk with all Photos & Videos",
      "Online gallery 300 high-resolution images & 6 months access"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full Coverage",
          "Two Photographer & Two Videographer Professionals",
          "Four 65 inches flat screen at the venue",
          "Pre wedding session"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "Video highlight",
          "Drone footage",
          "Two wooden frames A2 & A3",
          "One A3 Photobook Professional designed",
          "One flash disk with all Photos & Videos",
          "Online gallery 300 high-resolution images & 6 months access"
        ]
      }
    ]
  },
  {
    "id": "silver-wedding",
    "categoryId": "wedding",
    "name": "ULTIMATE PACKAGE ",
    "price": "TZS 4,500,000",
    "rawPrice": 4500000,
    "iconType": "gem",
    "featured": false,
    "buttonLabel": "Book Now",
    "features": [
      "Full Coverage",
      "Two Photographer & Two Videographer Professionals",
      "One assistant photographer & videographer",
      "Six 65 inches flat screen at the venue",
      "Pre wedding session",
      "Video highlight",
      "Drone footage",
      "360 Videos booth",
      "Two A2 wooden frames",
      "One A3 Photobook Professional designed",
      "Two flash disks with all Photos & Videos",
      "Online gallery 400 high-resolution images & 6 months"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full Coverage",
          "Two Photographer & Two Videographer Professionals",
          "One assistant photographer & videographer",
          "Six 65 inches flat screen at the venue",
          "Pre wedding session"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "Video highlight",
          "Drone footage",
          "360 Videos booth",
          "Two A2 wooden frames",
          "One A3 Photobook Professional designed",
          "Two flash disks with all Photos & Videos",
          "Online gallery 400 high-resolution images & 6 months"
        ]
      }
    ]
  },
  {
    "id": "gold-wedding",
    "categoryId": "wedding",
    "name": "PREMIUM PACKAGE",
    "price": "TZS 5,800,000",
    "rawPrice": 5800000,
    "iconType": "crown",
    "featured": false,
    "buttonLabel": "Book Now",
    "features": [
      "Full Coverage",
      "Two Photographer & THREE Videographer Professionals",
      "One assistant photographer & videographer",
      "EIGHT 65 inches flat screen at the venue",
      "Pre wedding session",
      "Video highlight",
      "Drone footage",
      "360 Videos booth",
      "THREE A2 wooden frames",
      "One A3 Photobook Professional designed",
      "Two flash disks with all Photos & Videos",
      "Online gallery 600 high-resolution images & ONE YEAR access"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full Coverage",
          "Two Photographer & THREE Videographer Professionals",
          "One assistant photographer & videographer",
          "EIGHT 65 inches flat screen at the venue",
          "Pre wedding session"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "Video highlight",
          "Drone footage",
          "360 Videos booth",
          "THREE A2 wooden frames",
          "One A3 Photobook Professional designed",
          "Two flash disks with all Photos & Videos",
          "Online gallery 600 high-resolution images & ONE YEAR access"
        ]
      }
    ]
  },
  {
    "id": "sendoff-standard",
    "categoryId": "sendoff",
    "name": "STANDARD PACKAGES",
    "price": "TZS 2,000,000",
    "rawPrice": 2000000,
    "iconType": "star",
    "featured": false,
    "buttonLabel": "Book Now",
    "features": [
      "Full coverage",
      "One professional photographer & one professional videographer",
      "Four 65 inches led flat screen at the venue",
      "video highlight",
      "Two A3 wooden frames",
      "One A3 photobook professional designed",
      "One flash disk with all photos & videos",
      "Online gallery with 200 high resolution images & 3 months access"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full coverage",
          "One professional photographer & one professional videographer",
          "Four 65 inches led flat screen at the venue"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "video highlight",
          "Two A3 wooden frames",
          "One A3 photobook professional designed",
          "One flash disk with all photos & videos",
          "Online gallery with 200 high resolution images & 3 months access"
        ]
      }
    ]
  },
  {
    "id": "sendoff-exclusive",
    "categoryId": "sendoff",
    "name": "CLASSIC PACKAGE",
    "price": "TZS 3,000,000",
    "rawPrice": 3000000,
    "iconType": "flame",
    "featured": true,
    "badge": "POPULAR",
    "buttonLabel": "Book Now",
    "features": [
      "Full coverage",
      "Two professional photographer & two professional videographer",
      "One assistant photographer & videographer",
      "Four 65 inches led flat screen at the venue",
      "Video highlight",
      "Drone footage",
      "Two A2 & A3 wooden frames",
      "One A3 Photobook professional designed",
      "One flash disk with all photos & videos",
      "Online gallery with 300 high resolution images & 6 months access"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full coverage",
          "Two professional photographer & two professional videographer",
          "One assistant photographer & videographer",
          "Four 65 inches led flat screen at the venue"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "Video highlight",
          "Drone footage",
          "Two A2 & A3 wooden frames",
          "One A3 Photobook professional designed",
          "One flash disk with all photos & videos",
          "Online gallery with 300 high resolution images & 6 months access"
        ]
      }
    ]
  },
  {
    "id": "sendoff-royal",
    "categoryId": "sendoff",
    "name": "ULTIMATE PACKAGE",
    "price": "TZS 4,500,000",
    "rawPrice": 4500000,
    "iconType": "crown",
    "featured": false,
    "buttonLabel": "Book Now",
    "features": [
      "Full coverage",
      "Two professional photographer & two professional videographer",
      "Six 65 inches led flat screen at the venue",
      "Video highlight",
      "Drone footage",
      "360 Video booth",
      "Two A2 Wooden frames",
      "One A3 Photobook professional designed",
      "One flash disk with all photos & videos",
      "Online gallery with 400 high resolution images & 6 months access"
    ],
    "sections": [
      {
        "subtitle": "Video and Photo Coverage:",
        "items": [
          "Full coverage",
          "Two professional photographer & two professional videographer",
          "Six 65 inches led flat screen at the venue"
        ]
      },
      {
        "subtitle": "Deliverable Includes:",
        "items": [
          "Video highlight",
          "Drone footage",
          "360 Video booth",
          "Two A2 Wooden frames",
          "One A3 Photobook professional designed",
          "One flash disk with all photos & videos",
          "Online gallery with 400 high resolution images & 6 months access"
        ]
      }
    ]
  },
  {
    "id": "addition-extra-photo",
    "categoryId": "addition",
    "name": "Extra Photographer",
    "price": "TZS 350,000",
    "rawPrice": 350000,
    "iconType": "camera",
    "buttonLabel": "Book Now",
    "features": [
      "Professional additional photographer for comprehensive event coverage."
    ]
  },
  {
    "id": "addition-extra-video",
    "categoryId": "addition",
    "name": "Extra Videographer",
    "price": "TZS 450,000",
    "rawPrice": 450000,
    "iconType": "video",
    "buttonLabel": "Book Now",
    "features": [
      "Professional additional cinematographer with dedicated 4K camera gear."
    ]
  },
  {
    "id": "addition-extra-tv",
    "categoryId": "addition",
    "name": "Extra tv (1) Screen",
    "price": "TZS 150,000",
    "rawPrice": 150000,
    "iconType": "tv",
    "buttonLabel": "Book Now",
    "features": [
      "One 65-inch high-definition LED screen with stand and live video feed."
    ]
  },
  {
    "id": "addition-drone",
    "categoryId": "addition",
    "name": "Drone Coverage",
    "price": "TZS 350,000",
    "rawPrice": 350000,
    "iconType": "camera",
    "buttonLabel": "Book Now",
    "features": [
      "4K aerial cinematography & cinematic landscape drone highlights."
    ]
  },
  {
    "id": "addition-360booth",
    "categoryId": "addition",
    "name": "360 Video Booth",
    "price": "TZS 500,000",
    "rawPrice": 500000,
    "iconType": "aperture",
    "featured": true,
    "buttonLabel": "Book Now",
    "features": [
      "Interactive 360 rotating video platform with studio lighting & guest cloud gallery."
    ]
  },
  {
    "id": "addition-prewedding",
    "categoryId": "addition",
    "name": "Pre Wedding Photoshoot",
    "price": "TZS 350,000",
    "rawPrice": 350000,
    "iconType": "heart",
    "buttonLabel": "Book Now",
    "features": [
      "Romantic outdoor/location photoshoot session with edited high-res digital copies."
    ]
  },
  {
    "id": "addition-engagement",
    "categoryId": "addition",
    "name": "Engagement Photoshoot",
    "price": "TZS 350,000",
    "rawPrice": 350000,
    "iconType": "gem",
    "buttonLabel": "Book Now",
    "features": [
      "Dedicated engagement ceremony and couple portrait photo coverage."
    ]
  },
  {
    "id": "addition-kitchenparty",
    "categoryId": "addition",
    "name": "Kitchen Party Video & Photos",
    "price": "TZS 1,500,000",
    "rawPrice": 1500000,
    "iconType": "sparkles",
    "buttonLabel": "Book Now",
    "features": [
      "Complete photography and videography coverage for kitchen party celebrations."
    ]
  },
  {
    "id": "addition-maternity",
    "categoryId": "addition",
    "name": "Maternity & Baby Studio Shoot (5 pictures)",
    "price": "TZS 150,000",
    "rawPrice": 150000,
    "iconType": "star",
    "buttonLabel": "Book Now",
    "features": [
      "5 professionally retouched studio photos with creative backdrops and props."
    ]
  },
  {
    "id": "addition-photoshoot-10",
    "categoryId": "addition",
    "name": "Photoshoot (10 pictures)",
    "price": "TZS 250,000",
    "rawPrice": 250000,
    "iconType": "camera",
    "buttonLabel": "Book Now",
    "features": [
      "10 high-end retouched studio/outdoor portraits delivered in full resolution."
    ]
  },
  {
    "id": "addition-studio-5",
    "categoryId": "addition",
    "name": "Studio shoot (5 pictures)",
    "price": "TZS 100,000",
    "rawPrice": 100000,
    "iconType": "camera",
    "buttonLabel": "Book Now",
    "features": [
      "5 studio portrait pictures with professional color grading."
    ]
  },
  {
    "id": "addition-a3-photobook",
    "categoryId": "addition",
    "name": "A3 Photobook",
    "price": "TZS 350,000",
    "rawPrice": 350000,
    "iconType": "award",
    "buttonLabel": "Book Now",
    "features": [
      "Hardcover luxury designed A3 photo album with premium luster print pages."
    ]
  },
  {
    "id": "addition-a4-wood",
    "categoryId": "addition",
    "name": "A4 Wooden Frame",
    "price": "TZS 50,000",
    "rawPrice": 50000,
    "iconType": "award",
    "buttonLabel": "Book Now",
    "features": [
      "Custom crafted solid wooden frame in A4 size with UV glass protective finish."
    ]
  },
  {
    "id": "addition-a3-wood",
    "categoryId": "addition",
    "name": "A3 Wooden Frame",
    "price": "TZS 80,000",
    "rawPrice": 80000,
    "iconType": "award",
    "buttonLabel": "Book Now",
    "features": [
      "Custom crafted solid wooden frame in A3 size with high-clarity glass."
    ]
  },
  {
    "id": "addition-a2-wood",
    "categoryId": "addition",
    "name": "A2 Wooden Frame",
    "price": "TZS 120,000",
    "rawPrice": 120000,
    "iconType": "award",
    "buttonLabel": "Book Now",
    "features": [
      "Large format solid wooden frame in A2 size ready for wall mounting."
    ]
  },
  {
    "id": "addition-a1-wood",
    "categoryId": "addition",
    "name": "A1 Wooden Frame",
    "price": "TZS 160,000",
    "rawPrice": 160000,
    "iconType": "award",
    "buttonLabel": "Book Now",
    "features": [
      "Grand exhibition size A1 solid wooden frame with premium metallic brackets."
    ]
  },
  {
    "id": "addition-a3-acrylic",
    "categoryId": "addition",
    "name": "A3 Acrylic Frame",
    "price": "TZS 150,000",
    "rawPrice": 150000,
    "iconType": "gem",
    "buttonLabel": "Book Now",
    "features": [
      "Ultra-glossy crystal clear A3 acrylic glass frame with floating wall spacers."
    ]
  },
  {
    "id": "addition-a2-acrylic",
    "categoryId": "addition",
    "name": "A2 Acrylic Frame",
    "price": "TZS 250,000",
    "rawPrice": 250000,
    "iconType": "gem",
    "buttonLabel": "Book Now",
    "features": [
      "Luxury high-definition A2 acrylic glass frame with diamond-polished edges."
    ]
  },
  {
    "id": "addition-a1-acrylic",
    "categoryId": "addition",
    "name": "A1 Acrylic Frame",
    "price": "TZS 300,000",
    "rawPrice": 300000,
    "iconType": "crown",
    "buttonLabel": "Book Now",
    "features": [
      "Premium executive A1 acrylic frameless glass portrait with luminous depth."
    ]
  }
];
