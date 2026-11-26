// Kraft Homes - Company Data & Brand Assets
// Source: Official Company Profile

export const company = {
  name: 'Kraft Homes',
  tagline: 'Kitchen | Appliances | Architectural Hardware',
  parent: 'Sri Lakshmi Groups',
  location: 'Salem, Tamil Nadu',

  logos: {
    original: '/logo/kraft-homes-logo.png',
    headerLight: '/logo/kraft-homes-header-light.png',
    headerDark: '/logo/kraft-homes-header-dark.png',
    stackedLight: '/logo/kraft-homes-logo-light.png',
    stackedDark: '/logo/kraft-homes-logo-dark.png',
    monogramLight: '/logo/kraft-homes-monogram-light.png',
    monogramDark: '/logo/kraft-homes-monogram-dark.png',
  },

  about: {
    intro:
      'Kraft Homes is an esteemed extension of the renowned Sri Lakshmi Groups in Salem. Our legacy spans generations, showcasing a commitment to excellence and innovation.',
    description:
      "Kraft Homes stands as a trailblazer, introducing a fresh and innovative perspective to Salem's real estate landscape. Our commitment to redefining luxury is evident in our seamless integration of sophistication and cutting-edge innovation, setting a new benchmark for opulent living experiences.",
    whyChooseUs:
      'At Kraft Homes, visionary design converges with meticulous craftsmanship, redefining real estate. Our dedication to sophistication, integrity, and innovation makes us your ideal partner in realizing your dream spaces.',
    vision:
      'To create living spaces that not only meet but exceed expectations, combining aesthetics and functionality. We strive to be the epitome of design, innovation, and quality in every project.',
    image: '/images/about/about-studio.webp',
    imageAlt:
      'Kraft Homes design consultation studio in Salem with architectural floorplans, stone slabs, timber veneers, and brass hardware samples',
    specializations: [
      'Premium modular kitchen solutions',
      'Luxury home interiors',
      'Personalized design consultations',
      'Manufacturing facility',
      'Display showroom',
      'Warehouse infrastructure',
      'Premium materials and products',
      'Professional installation',
      'Customer-focused approach',
    ],
    values: [
      {
        title: 'Integrity',
        description: 'Upholding transparency and honesty in every interaction.',
      },
      {
        title: 'Innovation',
        description: 'Continuously evolving to provide cutting-edge solutions.',
      },
      {
        title: 'Customer-Centricity',
        description: "Placing our clients' needs at the forefront of our endeavors.",
      },
    ],
    infrastructure: ['Display Showroom', 'Manufacturing Unit', 'Warehouse'],
  },

  contact: {
    phone: '+91 90428 34479',
    phoneClean: '919042834479',
    email: 'krafthomessalem@gmail.com',
    address: {
      line1: '165/5, First Floor, Kovai Bypass Road',
      line2: 'Nedunchalai Nagar, Salem',
      line3: 'Tamil Nadu – 636005',
      full: '165/5, First Floor, Kovai Bypass Road, Nedunchalai Nagar, Salem, Tamil Nadu – 636005',
    },
    hours: {
      weekdays: 'Monday – Saturday: 9:30 AM – 8:00 PM',
      weekend: 'Sunday: Closed',
    },
    social: {
      instagram: 'https://www.instagram.com/krafthomes_salem/',
    },
    whatsapp: 'https://wa.me/919042834479',
    googleMaps:
      'https://www.google.com/maps/search/Kraft+Homes+165%2F5+Kovai+Bypass+Road+Nedunchalai+Nagar+Salem+Tamil+Nadu+636005',
  },
};

export const navigation = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'collections', label: 'Collections', href: '#collections' },
  { id: 'brands', label: 'Brands', href: '#brands' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'testimonials', label: 'Testimonials', href: '#testimonials' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];
