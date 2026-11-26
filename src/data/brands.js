// Brand Portfolio Data
// Verified official brand SVG/PNG files are stored under /public/images/brands/
// Note: Do not claim authorized dealership, exclusivity or official partnership status unless verified.
// To add or swap a brand logo file, update the `logo` property below with a clean SVG or transparent PNG path.

export const brandCategories = [
  {
    id: 'appliances',
    title: 'Appliances',
    brands: [
      {
        id: 'siemens-appliances',
        name: 'Siemens',
        subtitle: 'Built-In Kitchen Appliances',
        logo: '/images/brands/siemens.svg',
        origin: 'Germany',
      },
      {
        id: 'bosch-appliances',
        name: 'Bosch Appliances',
        subtitle: 'Precision Culinary Engineering',
        logo: '/images/brands/bosch.svg',
        origin: 'Germany',
      },
      {
        id: 'hafele-appliances',
        name: 'Häfele Appliances',
        subtitle: 'Integrated Kitchen Solutions',
        logo: '/images/brands/hafele.svg',
        origin: 'Germany',
      },
      {
        id: 'falmec-appliances',
        name: 'Falmec',
        subtitle: 'Architectural Extraction Systems',
        logo: '/images/brands/falmec.svg',
        origin: 'Italy',
      },
    ],
  },
  {
    id: 'hardware',
    title: 'Architectural Hardware',
    brands: [
      {
        id: 'hafele-hardware',
        name: 'Häfele Hardware',
        subtitle: 'Furniture & Architectural Fittings',
        logo: '/images/brands/hafele.svg',
        origin: 'Germany',
      },
      {
        id: 'ozone-hardware',
        name: 'Ozone Hardware',
        subtitle: 'Architectural Glass & Hardware',
        logo: '/images/brands/ozone.webp',
        origin: 'India',
      },
      {
        id: 'fritsjurgens-hardware',
        name: 'FritsJurgens',
        subtitle: 'Concealed Pivot Hinge Systems',
        logo: '/images/brands/fritsjurgens.svg',
        origin: 'Netherlands',
      },
      {
        id: 'blum-hardware',
        name: 'Blum Hardware',
        subtitle: 'Motion & Storage Systems',
        logo: '/images/brands/blum.svg',
        origin: 'Austria',
      },
    ],
  },
  {
    id: 'quartz',
    title: 'Quartz & Surfaces',
    brands: [
      {
        id: 'hafele-quartz',
        name: 'Häfele Quartz',
        subtitle: 'Engineered Surface Collection',
        logo: '/images/brands/hafele.svg',
        origin: 'Germany',
      },
      {
        id: 'agl-quartz',
        name: 'AGL Quartz',
        subtitle: 'Engineered Stone & Slabs',
        logo: '/images/brands/agl.svg',
        origin: 'India',
      },
      {
        id: 'terra-surfaces',
        name: 'Terra',
        subtitle: 'Premium Quartz Surfaces by Häfele',
        // Terra is Häfele's in-house quartz brand; standalone SVG can be dropped at /images/brands/terra.svg
        logo: '',
        parentLogo: '/images/brands/hafele.svg',
        origin: 'Surface Range',
      },
    ],
  },
  {
    id: 'materials',
    title: 'Materials & Systems',
    brands: [
      {
        id: 'jindal-steel',
        name: 'Jindal Steel',
        subtitle: 'Stainless Steel Kitchen Systems',
        logo: '/images/brands/jindal.png',
        origin: 'India',
      },
      {
        id: 'acs-aluminium',
        name: 'ACS Aluminium',
        subtitle: 'Architectural Profile Systems',
        // Drop an official ACS Aluminium logo SVG/PNG at /images/brands/acs-aluminium.svg and reference here
        logo: '',
        origin: 'Profile Systems',
      },
    ],
  },
];

export const allBrands = brandCategories.flatMap((category) =>
  category.brands.map((brand) => ({
    ...brand,
    categoryId: category.id,
    category: category.title,
  }))
);

// Unique brand marks for the continuous marquee strip
export const marqueeBrands = [
  { id: 'siemens', name: 'Siemens', logo: '/images/brands/siemens.svg', category: 'Appliances' },
  { id: 'bosch', name: 'Bosch Appliances', logo: '/images/brands/bosch.svg', category: 'Appliances' },
  { id: 'hafele', name: 'Häfele', logo: '/images/brands/hafele.svg', category: 'Appliances, Hardware & Quartz' },
  { id: 'falmec', name: 'Falmec', logo: '/images/brands/falmec.svg', category: 'Appliances' },
  { id: 'blum', name: 'Blum Hardware', logo: '/images/brands/blum.svg', category: 'Hardware' },
  { id: 'fritsjurgens', name: 'FritsJurgens', logo: '/images/brands/fritsjurgens.svg', category: 'Hardware' },
  { id: 'ozone', name: 'Ozone Hardware', logo: '/images/brands/ozone.webp', category: 'Hardware' },
  { id: 'agl', name: 'AGL Quartz', logo: '/images/brands/agl.svg', category: 'Quartz & Surfaces' },
  { id: 'terra', name: 'Terra', logo: '', parentLogo: '/images/brands/hafele.svg', category: 'Quartz by Häfele' },
  { id: 'jindal', name: 'Jindal Steel', logo: '/images/brands/jindal.png', category: 'Steel Kitchens' },
  { id: 'acs', name: 'ACS Aluminium', logo: '', category: 'Aluminium Systems' },
];
