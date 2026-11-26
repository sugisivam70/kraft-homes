// Infrastructure & Showroom Data
// Replace image paths with actual Kraft Homes Salem photographs when provided.
// Keep `isConceptual: true` on non-facility architectural previews until actual photos are uploaded.

export const showroomFacilities = [
  {
    id: 'showroom-flagship',
    facility: 'Display Showroom',
    title: 'Display Showroom & Kitchen Vignettes',
    subtitle: 'Full-Scale European Kitchen Displays',
    description:
      'Experience modular island configurations, handleless tall banks, integrated appliances, and surface combinations in person at our Kovai Bypass Road showroom.',
    specs: ['Modular Kitchen Displays', 'Appliance Experience', 'Material & Finish Library'],
    image: '/images/showroom/showroom-vignette.webp',
    isConceptual: true,
    badgeText: 'Design Vignette · Showroom Photos Coming Soon',
    gridClass: 'md:row-span-2 lg:row-span-2 min-h-[340px] lg:min-h-0',
    locationTag: 'Kovai Bypass Road, Salem',
  },
  {
    id: 'manufacturing-unit',
    facility: 'Manufacturing Unit',
    title: 'In-House Manufacturing Facility',
    subtitle: 'Precision Panel Processing & Quality Control',
    description:
      'Dedicated production unit ensuring controlled manufacturing tolerances, moisture-resistant edge finishing, and trial assembly checks prior to site dispatch.',
    specs: ['Precision Joinery', 'Controlled Production', 'Pre-Dispatch Quality Checks'],
    image: '',
    isConceptual: true,
    badgeText: 'Facility Photography Pending',
    gridClass: 'lg:row-span-1 min-h-[280px] lg:min-h-0',
    locationTag: 'Kraft Homes Production Unit',
  },
  {
    id: 'warehouse-hub',
    facility: 'Warehouse',
    title: 'Spacious Warehouse Infrastructure',
    subtitle: 'Dedicated Inventory & Timely Logistics',
    description:
      'Organized inventory management for substrates, architectural hardware, quartz surfaces, and appliances—supporting reliable installation schedules.',
    specs: ['Structured Inventory', 'Protective Material Staging', 'Scheduled Dispatch'],
    image: '',
    isConceptual: true,
    badgeText: 'Facility Photography Pending',
    gridClass: 'lg:row-span-2 min-h-[320px] lg:min-h-0',
    locationTag: 'Kraft Homes Warehouse',
  },
  {
    id: 'hardware-material-studio',
    facility: 'Display Showroom',
    title: 'Hardware & Surface Selection Zone',
    subtitle: 'Hands-On Tactile Comparison',
    description:
      'Test soft-close drawer motion, pivot door mechanisms, quartz slab textures, Jindal steel options, and ACS aluminium profiles side by side with our consultants.',
    specs: ['Soft-Close Testing', 'Quartz & Veneer Swatches', 'Consultation Desk'],
    image: '',
    isConceptual: true,
    badgeText: 'Showroom Photography Pending',
    gridClass: 'lg:row-span-2 min-h-[320px] lg:min-h-0',
    locationTag: 'First Floor Studio, Salem',
  },
  {
    id: 'appliance-display',
    facility: 'Display Showroom',
    title: 'Built-In Appliance Showcase',
    subtitle: 'Culinary & Extraction Displays',
    description:
      'Compare built-in ovens, microwaves, dishwashers, induction hobs, and architectural chimneys curated for contemporary modular cabinetry.',
    specs: ['Built-In Ovens & Hobs', 'Extraction Systems', 'Integrated Cooling'],
    image: '',
    isConceptual: true,
    badgeText: 'Showroom Photography Pending',
    gridClass: 'lg:row-span-1 min-h-[280px] lg:min-h-0',
    locationTag: 'Kovai Bypass Road, Salem',
  },
  {
    id: 'installation-dispatch',
    facility: 'Warehouse',
    title: 'Project Staging & Site Handover Prep',
    subtitle: 'Room-by-Room Delivery Coordination',
    description:
      'Every bespoke kitchen and wardrobe order is verified, protected, and coordinated directly with our in-house installation team.',
    specs: ['Verified Hardware Kits', 'Edge-Protected Transit', 'Professional Installation'],
    image: '',
    isConceptual: true,
    badgeText: 'Facility Photography Pending',
    gridClass: 'md:col-span-2 lg:col-span-1 lg:row-span-1 min-h-[280px] lg:min-h-0',
    locationTag: 'Salem Logistics Wing',
  },
];
