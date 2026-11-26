// SEO Configuration

export const seo = {
  title: 'Kraft Homes | Premium Modular Kitchens & Kitchen Appliances in Salem',
  description:
    'Discover premium modular kitchens, wardrobes, kitchen appliances, quartz surfaces and architectural hardware at Kraft Homes, Salem. Book your personalized consultation today.',
  url: 'https://krafthomes.in',
  image: '/images/hero/hero-1.webp',
  locale: 'en_IN',
  siteName: 'Kraft Homes',
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Kraft Homes',
  description:
    'Premium modular kitchens, kitchen appliances, wardrobes, quartz surfaces and architectural hardware in Salem, Tamil Nadu.',
  url: 'https://krafthomes.in',
  telephone: '+919042834479',
  email: 'krafthomessalem@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '165/5, First Floor, Kovai Bypass Road, Nedunchalai Nagar',
    addressLocality: 'Salem',
    addressRegion: 'Tamil Nadu',
    postalCode: '636005',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '20:00',
    },
  ],
  priceRange: '₹₹₹',
  image: '/images/hero/hero-1.webp',
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kraft Homes',
  url: 'https://krafthomes.in',
  logo: '/logo/kraft-homes-logo.png',
  description:
    'Premium modular kitchens, kitchen appliances, wardrobes, quartz surfaces and architectural hardware in Salem, Tamil Nadu.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+919042834479',
    contactType: 'customer service',
    areaServed: 'Salem',
    availableLanguage: ['English', 'Tamil'],
  },
  sameAs: ['https://www.instagram.com/krafthomes_salem/'],
};
