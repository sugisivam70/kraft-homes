// Product Collections Data
// Each collection features its own unique architectural image asset.

export const collections = [
  {
    id: 'modular-kitchens',
    title: 'Modular Kitchens',
    subtitle: 'Where Function Meets Elegance',
    description:
      'Discover our range of thoughtfully designed modular kitchens featuring contemporary aesthetics, premium finishes, and intelligent storage solutions tailored to your lifestyle.',
    image: '/images/kitchens/collection-modular-kitchen.webp',
    imageAlt:
      'Bespoke taupe satin lacquer and vertical slatted oak modular kitchen with stainless steel architectural detailing',
    features: [
      'Contemporary kitchens',
      'Luxury island kitchens',
      'Handleless kitchen systems',
      'Customized kitchen layouts',
      'Jindal steel kitchen solutions',
      'Premium cabinet finishes',
    ],
    enquiryCategory: 'Modular Kitchen',
  },
  {
    id: 'wardrobes',
    title: 'Wardrobes & Home Interiors',
    subtitle: 'Crafted for Your World',
    description:
      'From walk-in wardrobes to customized storage solutions, our home interior offerings blend functionality with refined aesthetics to create spaces that feel truly yours.',
    image: '/images/wardrobes/collection-wardrobe.webp',
    imageAlt:
      'Custom illuminated walk-in wardrobe with smoked glass partitions and warm timber interior cabinetry',
    features: [
      'Walk-in wardrobes',
      'Sliding wardrobes',
      'Customized storage solutions',
      'Premium beds',
      'Functional home interior solutions',
    ],
    enquiryCategory: 'Wardrobes',
  },
  {
    id: 'appliances',
    title: 'Premium Kitchen Appliances',
    subtitle: 'Innovation in Every Detail',
    description:
      'Elevate your culinary experience with premium built-in appliances from world-renowned brands, seamlessly integrated into your kitchen design.',
    image: '/images/appliances/collection-appliances.webp',
    imageAlt:
      'Flush-mounted European black-glass built-in oven tower, induction cooktop, and linear chimney extractor',
    features: [
      'Built-in ovens',
      'Microwaves',
      'Dishwashers',
      'Refrigerators',
      'Induction cooktops',
      'Kitchen hobs',
      'Chimneys and extraction systems',
    ],
    enquiryCategory: 'Kitchen Appliances',
  },
  {
    id: 'hardware',
    title: 'Architectural Hardware',
    subtitle: 'The Art of Precision',
    description:
      'Premium architectural hardware that combines impeccable engineering with elegant design. Every hinge, drawer system, and fitting is chosen for lasting performance.',
    image: '/images/hardware/collection-hardware.webp',
    imageAlt:
      'Close-up of soft-close anthracite drawer system fitted with solid walnut cutlery and knife organizers',
    features: [
      'Premium hinges',
      'Drawer systems',
      'Soft-close mechanisms',
      'Kitchen storage accessories',
      'Architectural fittings',
      'Pivot door systems',
    ],
    enquiryCategory: 'Architectural Hardware',
  },
  {
    id: 'quartz',
    title: 'Quartz & Premium Surfaces',
    subtitle: 'Surfaces That Define Spaces',
    description:
      'Transform your interiors with stunning quartz countertops and premium surface materials that combine natural beauty with exceptional durability.',
    image: '/images/quartz/collection-quartz.webp',
    imageAlt:
      'Honed marble-veined quartz waterfall kitchen island countertop with undermount sink and gunmetal faucet',
    features: [
      'Quartz countertops',
      'Kitchen island surfaces',
      'Premium textures and finishes',
      'Luxury worktops',
    ],
    enquiryCategory: 'Quartz Countertops',
  },
  {
    id: 'aluminium',
    title: 'Aluminium Solutions',
    subtitle: 'Modern Architectural Finishes',
    description:
      'Contemporary aluminium systems that bring lightweight strength and design versatility to modern architectural applications.',
    image: '/images/aluminium/collection-aluminium.webp',
    imageAlt:
      'Slim black and bronze anodized aluminium framed fluted-glass sliding doors and illuminated pantry cabinetry',
    features: [
      'ACS aluminium solutions',
      'Contemporary architectural finishes',
      'Functional aluminium systems',
    ],
    enquiryCategory: 'Aluminium Solutions',
  },
];

export const productDropdownOptions = [
  'Modular Kitchen',
  'Kitchen Appliances',
  'Architectural Hardware',
  'Wardrobes',
  'Quartz Countertops',
  'Aluminium Solutions',
  'Complete Home Interiors',
  'Other Requirements',
];
