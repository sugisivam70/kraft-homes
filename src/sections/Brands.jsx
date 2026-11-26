import { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { brandCategories, allBrands, marqueeBrands } from '../data/brands';

gsap.registerPlugin(ScrollTrigger);

function BrandLogoDisplay({ brand, size = 'card' }) {
  const [imgFailed, setImgFailed] = useState(false);

  const isMarquee = size === 'marquee';

  if (brand.logo && !imgFailed) {
    return (
      <div
        className={`flex items-center ${
          isMarquee ? 'justify-center h-10 md:h-12 w-36 md:w-44' : 'justify-start h-12 md:h-14 w-full'
        }`}
      >
        <img
          src={brand.logo}
          alt={`${brand.name} official logo`}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className={`max-h-full w-auto object-contain grayscale opacity-65 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ${
            isMarquee ? 'max-w-[140px]' : 'max-w-[175px]'
          }`}
        />
      </div>
    );
  }

  // Terra (Häfele in-house quartz range) renders parent Häfele logo alongside crisp Terra emblem
  if (brand.parentLogo && !imgFailed) {
    return (
      <div className="flex flex-col items-start justify-center gap-1.5 min-h-[3.5rem]">
        <div className="flex items-baseline gap-2.5">
          <span className="font-heading text-3xl font-medium tracking-[0.14em] uppercase text-carbon/75 group-hover:text-carbon transition-colors duration-300">
            TERRA
          </span>
          <span className="text-[10px] font-body uppercase tracking-[0.2em] text-warm-gray">
            by
          </span>
        </div>
        <img
          src={brand.parentLogo}
          alt="Häfele Surfaces logo"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-3.5 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
      </div>
    );
  }

  // Fallback architectural monogram frame ready for clean brand asset drop-in
  return (
    <div
      className={`inline-flex items-center gap-3 ${
        isMarquee ? 'h-10 md:h-12 px-4' : 'min-h-[3.5rem]'
      }`}
    >
      <span className="inline-flex items-center justify-center w-9 h-9 border border-carbon/20 bg-ivory font-heading text-base font-semibold tracking-wider text-carbon/80 group-hover:border-brand-red group-hover:text-brand-red transition-colors duration-300">
        {brand.name
          .split(' ')
          .map((w) => w[0])
          .slice(0, 3)
          .join('')}
      </span>
      <span className="font-heading text-2xl font-medium tracking-wide text-carbon/80 group-hover:text-carbon transition-colors duration-300">
        {brand.name}
      </span>
    </div>
  );
}

export default function Brands() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const lineRef = useRef(null);
  const marqueeRef = useRef(null);
  const filterRef = useRef(null);
  const gridWrapperRef = useRef(null);

  const [activeTab, setActiveTab] = useState('all');

  const filterTabs = useMemo(
    () => [
      { id: 'all', title: 'All Brands', count: allBrands.length },
      ...brandCategories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        count: cat.brands.length,
      })),
    ],
    []
  );

  const displayedBrands = useMemo(() => {
    if (activeTab === 'all') {
      return allBrands;
    }
    const selectedCategory = brandCategories.find((cat) => cat.id === activeTab);
    if (!selectedCategory) return allBrands;

    return selectedCategory.brands.map((brand) => ({
      ...brand,
      categoryId: selectedCategory.id,
      category: selectedCategory.title,
    }));
  }, [activeTab]);

  const firstRowBrands = useMemo(() => marqueeBrands, []);
  const secondRowBrands = useMemo(() => [...marqueeBrands].reverse(), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const headerElements = headerRef.current.querySelectorAll('.brands-reveal');
        gsap.from(headerElements, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (filterRef.current) {
        gsap.from(filterRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: filterRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (gridWrapperRef.current) {
        gsap.from(gridWrapperRef.current, {
          opacity: 0,
          y: 35,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridWrapperRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brands"
      ref={sectionRef}
      className="relative bg-pure-white py-24 md:py-32 lg:py-36 overflow-hidden"
      aria-labelledby="brands-heading"
    >
      <style>{`
        @keyframes brandsMarqueeLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes brandsMarqueeRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .brands-marquee-left {
          animation: brandsMarqueeLeft 40s linear infinite;
          will-change: transform;
        }

        .brands-marquee-right {
          animation: brandsMarqueeRight 44s linear infinite;
          will-change: transform;
        }

        .brands-marquee-row:hover .brands-marquee-left,
        .brands-marquee-row:hover .brands-marquee-right {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .brands-marquee-left,
          .brands-marquee-right {
            animation: none;
          }
        }
      `}</style>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-12 md:pb-16"
        >
          <div className="max-w-2xl">
            <div className="brands-reveal flex items-center gap-3 mb-5">
              <span className="inline-block w-8 h-px bg-brand-red" aria-hidden="true" />
              <span className="eyebrow text-bronze">Curated Brand Portfolio</span>
            </div>

            <h2
              id="brands-heading"
              className="brands-reveal font-heading text-4xl md:text-6xl font-light tracking-tight leading-[1.08] text-carbon"
            >
              Partnering with Excellence.
            </h2>
          </div>

          <p className="brands-reveal body-text text-carbon/70 text-sm md:text-base max-w-md lg:text-right">
            Discover exceptional products from renowned brands that bring innovation,
            quality and sophistication into your home.
          </p>
        </div>

        <div
          ref={lineRef}
          className="h-px w-full bg-light-gray mb-14 md:mb-18"
          aria-hidden="true"
        />
      </div>

      {/* Dual-Direction Infinite Brand Logo Marquee (Monochrome -> Full Brand Color on Hover) */}
      <div
        ref={marqueeRef}
        className="relative mb-16 md:mb-24 border-y border-light-gray/80 py-8 md:py-11 bg-gradient-to-b from-pure-white via-ivory/40 to-pure-white"
        aria-label="Featured brand logos marquee"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 lg:w-40 z-10 bg-gradient-to-r from-pure-white to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 lg:w-40 z-10 bg-gradient-to-l from-pure-white to-transparent"
          aria-hidden="true"
        />

        {/* Row 1: Scrolls Left */}
        <div className="brands-marquee-row overflow-hidden mb-5 md:mb-7">
          <div className="brands-marquee-left flex w-max items-center">
            {[0, 1].map((duplicateIdx) => (
              <div
                key={`row-left-${duplicateIdx}`}
                className="flex items-center shrink-0"
                aria-hidden={duplicateIdx === 1}
              >
                {firstRowBrands.map((brand, index) => (
                  <div
                    key={`left-${duplicateIdx}-${brand.id}-${index}`}
                    className="group flex items-center shrink-0"
                  >
                    <div className="px-6 md:px-10 py-2 flex items-center justify-center">
                      <BrandLogoDisplay brand={brand} size="marquee" />
                    </div>
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-bronze/40 shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolls Right */}
        <div className="brands-marquee-row overflow-hidden">
          <div className="brands-marquee-right flex w-max items-center">
            {[0, 1].map((duplicateIdx) => (
              <div
                key={`row-right-${duplicateIdx}`}
                className="flex items-center shrink-0"
                aria-hidden={duplicateIdx === 1}
              >
                {secondRowBrands.map((brand, index) => (
                  <div
                    key={`right-${duplicateIdx}-${brand.id}-${index}`}
                    className="group flex items-center shrink-0"
                  >
                    <div className="px-6 md:px-10 py-2 flex items-center justify-center">
                      <BrandLogoDisplay brand={brand} size="marquee" />
                    </div>
                    <span
                      className="inline-block w-5 h-px bg-carbon/15 shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Category Filter & Categorized Brand Logo Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={filterRef}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-14"
        >
          <div
            role="tablist"
            aria-label="Filter brands by category"
            className="flex flex-wrap items-center gap-2 md:gap-3"
          >
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="brands-grid-panel"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-[13px] font-body font-medium tracking-[0.12em] uppercase transition-colors duration-300 cursor-pointer border ${
                    isActive
                      ? 'text-pure-white border-carbon bg-carbon'
                      : 'text-carbon/70 border-light-gray bg-pure-white hover:border-bronze hover:text-carbon'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{tab.title}</span>
                    <span
                      className={`text-[10px] font-normal ${
                        isActive ? 'text-bronze' : 'text-warm-gray'
                      }`}
                    >
                      {String(tab.count).padStart(2, '0')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-body text-warm-gray tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-bronze shrink-0" aria-hidden="true" />
            <span>
              Showing {displayedBrands.length}{' '}
              {displayedBrands.length === 1 ? 'Product Line' : 'Product Lines'}
            </span>
          </div>
        </div>

        {/* Responsive Brand Logo Wall */}
        <div id="brands-grid-panel" role="tabpanel" ref={gridWrapperRef}>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedBrands.map((brand, index) => (
                <motion.article
                  key={`${activeTab}-${brand.id}`}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{
                    duration: 0.36,
                    delay: Math.min(index * 0.035, 0.25),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative flex flex-col justify-between min-h-[196px] p-6 md:p-7 border border-light-gray bg-gradient-to-br from-pure-white via-pure-white to-ivory/75 hover:border-bronze/75 hover:shadow-[0_18px_40px_-24px_rgba(20,20,20,0.18)] transition-all duration-500 overflow-hidden"
                >
                  {/* Top Row: Index & Category */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-body text-[11px] font-medium tracking-[0.2em] text-warm-gray group-hover:text-bronze transition-colors duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="font-body text-[10px] font-medium tracking-[0.16em] uppercase text-bronze text-right">
                      {brand.category}
                    </span>
                  </div>

                  {/* Center: Official Brand Logo (Monochrome -> Full Brand Color on Hover) */}
                  <div className="my-5 flex items-center">
                    <BrandLogoDisplay brand={brand} size="card" />
                  </div>

                  {/* Bottom: Official Brand Title & Subtitle */}
                  <div className="pt-3 border-t border-light-gray/70">
                    <h3 className="font-body text-sm font-semibold tracking-wide text-carbon group-hover:text-brand-red transition-colors duration-300">
                      {brand.name}
                    </h3>
                    <p className="font-body text-xs text-warm-gray mt-0.5">
                      {brand.subtitle}
                    </p>
                  </div>

                  {/* Hover Accent Line */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-brand-red via-bronze to-bronze/40 group-hover:w-full transition-all duration-500 ease-out"
                    aria-hidden="true"
                  />
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Editorial Disclaimer Note */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-light-gray/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-body text-xs md:text-sm font-light text-carbon/60 max-w-2xl">
            Every kitchen and architectural system at our Salem studio is thoughtfully
            specified using genuine appliances, hardware, and surface lines from these
            manufacturers. Hover any logo to inspect full brand identity.
          </p>
          <span className="font-body text-[11px] font-medium tracking-[0.2em] uppercase text-bronze shrink-0">
            Salem Design Studio
          </span>
        </div>
      </div>
    </section>
  );
}
