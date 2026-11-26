import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { kitchenHotspots, kitchenInteractiveImage } from '../data/kitchenHotspots';
import { animateFadeInUp, animateTextReveal } from '../animations/gsapAnimations';
import { navigateToEnquiry } from '../utils/whatsapp';
import { events, trackEvent } from '../config/tracking';

gsap.registerPlugin(ScrollTrigger);

export default function KitchenExperience() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const hotspotRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const [imageError, setImageError] = useState(false);

  const activeIndex = kitchenHotspots.findIndex((item) => item.id === activeId);
  const activeHotspot = activeIndex >= 0 ? kitchenHotspots[activeIndex] : null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const revealItems = headerRef.current.querySelectorAll('.reveal-item');
        if (revealItems.length > 0) {
          animateTextReveal(revealItems, headerRef.current, {
            stagger: 0.12,
            start: 'top 82%',
          });
        }
      }

      if (stageRef.current) {
        animateFadeInUp(stageRef.current, stageRef.current, {
          y: 36,
          duration: 0.9,
          start: 'top 85%',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleClose = useCallback(() => {
    setActiveId((prev) => {
      if (prev && hotspotRefs.current[prev]) {
        hotspotRefs.current[prev].focus();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && activeId) {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId, handleClose]);

  const handleHotspotToggle = (id) => {
    setActiveId((current) => (current === id ? null : id));
  };

  const handleHotspotKeyDown = (event, index) => {
    const total = kitchenHotspots.length;
    let nextIndex = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = (index + 1) % total;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = (index - 1 + total) % total;
    }

    if (nextIndex !== null) {
      const nextHotspot = kitchenHotspots[nextIndex];
      setActiveId(nextHotspot.id);
      hotspotRefs.current[nextHotspot.id]?.focus();
    }
  };

  const handleStep = (direction) => {
    if (kitchenHotspots.length === 0) return;
    const baseIndex = activeIndex >= 0 ? activeIndex : 0;
    const targetIndex =
      (baseIndex + direction + kitchenHotspots.length) % kitchenHotspots.length;
    setActiveId(kitchenHotspots[targetIndex].id);
  };

  const handleEnquiry = (hotspot) => {
    trackEvent(events.PRODUCT_SELECT, {
      product_category: hotspot.enquiryCategory,
      source: 'interactive_kitchen_hotspot',
      hotspot_label: hotspot.label,
    });
    navigateToEnquiry(
      hotspot.enquiryCategory,
      `Interested in ${hotspot.label} featured in the Interactive Kitchen Showcase.`
    );
  };

  const renderInfoCard = (hotspot, isMobile = false) => (
    <motion.div
      key={`${hotspot.id}-${isMobile ? 'mobile' : 'desktop'}`}
      id={`hotspot-panel-${hotspot.id}-${isMobile ? 'mobile' : 'desktop'}`}
      role="region"
      aria-labelledby={`hotspot-panel-title-${hotspot.id}-${isMobile ? 'mobile' : 'desktop'}`}
      initial={{ opacity: 0, y: isMobile ? 16 : 20, scale: isMobile ? 1 : 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isMobile ? 12 : 14, scale: isMobile ? 1 : 0.97 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="backdrop-blur-md bg-pure-white/95 text-carbon shadow-2xl border border-light-gray/70 p-6 md:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow text-[11px] text-brand-red block">
            {hotspot.enquiryCategory}
          </span>
          <h3
            id={`hotspot-panel-title-${hotspot.id}-${isMobile ? 'mobile' : 'desktop'}`}
            className="heading-md text-2xl md:text-3xl text-carbon mt-1.5"
          >
            {hotspot.label}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label={`Close ${hotspot.label} details`}
          className="p-2 -mr-2 -mt-2 text-carbon/70 hover:text-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="w-10 h-px bg-bronze my-4" aria-hidden="true" />

      <p className="body-text text-sm text-carbon/80 leading-relaxed">
        {hotspot.description}
      </p>

      <div className="mt-6 pt-4 border-t border-carbon/10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleEnquiry(hotspot)}
          className="inline-flex items-center gap-2 bg-carbon text-pure-white hover:bg-brand-red transition-colors duration-300 px-5 py-3 text-xs uppercase tracking-[0.18em] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 cursor-pointer"
        >
          <span>Enquire Now</span>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1" aria-label="Navigate hotspots">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            aria-label="Previous kitchen detail"
            className="p-2 text-carbon/70 hover:text-carbon hover:bg-carbon/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="text-xs font-medium tracking-wider text-carbon/60 min-w-[3ch] text-center">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => handleStep(1)}
            aria-label="Next kitchen detail"
            className="p-2 text-carbon/70 hover:text-carbon hover:bg-carbon/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section
      id="kitchen-experience"
      ref={sectionRef}
      aria-labelledby="kitchen-experience-heading"
      className="relative bg-carbon text-pure-white py-24 md:py-32 overflow-hidden"
    >
      {/* Editorial Section Header */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="reveal-item eyebrow text-bronze mb-4">
              Interactive Kitchen Architecture
            </p>
            <h2
              id="kitchen-experience-heading"
              className="reveal-item heading-xl text-4xl sm:text-5xl md:text-6xl text-pure-white"
            >
              Explore the Details
            </h2>
          </div>

          <p className="reveal-item body-text text-warm-gray max-w-md text-sm md:text-base">
            Select any pulsing architectural marker to inspect our European appliances,
            precision soft-close hardware, and bespoke quartz surfaces.
          </p>
        </div>
      </div>

      {/* Full-Width Interactive Kitchen Stage */}
      <div ref={stageRef} className="relative w-full max-w-[1440px] mx-auto px-0 lg:px-12">
        <div className="relative w-full aspect-[16/9] min-h-[300px] overflow-hidden bg-gradient-to-br from-dark-surface via-carbon to-[#24201c] border-y lg:border border-pure-white/10">
          {!imageError ? (
            <img
              src={kitchenInteractiveImage.src}
              alt={kitchenInteractiveImage.alt}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center select-none"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br from-[#23201d] via-carbon to-[#2d251e] flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="eyebrow text-bronze/60">
                Kraft Homes Architectural Kitchen
              </span>
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-carbon/55 via-transparent to-carbon/20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Interactive Hotspot Dots */}
          <div
            className="absolute inset-0"
            role="group"
            aria-label="Interactive kitchen feature hotspots"
          >
            {kitchenHotspots.map((hotspot, index) => {
              const isActive = hotspot.id === activeId;

              return (
                <div
                  key={hotspot.id}
                  style={{
                    left: `${hotspot.position.x}%`,
                    top: `${hotspot.position.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <button
                    ref={(el) => {
                      hotspotRefs.current[hotspot.id] = el;
                    }}
                    type="button"
                    onClick={() => handleHotspotToggle(hotspot.id)}
                    onKeyDown={(e) => handleHotspotKeyDown(e, index)}
                    aria-label={`${hotspot.label} — ${hotspot.enquiryCategory}`}
                    aria-expanded={isActive}
                    className="group relative flex items-center justify-center w-11 h-11 md:w-9 md:h-9 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
                  >
                    <span
                      className={`relative flex items-center justify-center w-5 h-5 md:w-4 md:h-4 rounded-full bg-brand-red text-brand-red hotspot-pulse transition-transform duration-300 shadow-lg ${
                        isActive
                          ? 'scale-125 ring-4 ring-pure-white/70'
                          : 'ring-2 ring-pure-white/80 group-hover:scale-125'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-pure-white"
                        aria-hidden="true"
                      />
                    </span>

                    {/* Desktop Tooltip Label */}
                    <span
                      className={`hidden md:block pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase font-medium bg-carbon/90 text-pure-white border border-pure-white/15 backdrop-blur-sm transition-all duration-200 ${
                        isActive
                          ? 'opacity-0 translate-y-1'
                          : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0'
                      }`}
                    >
                      {hotspot.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Desktop Floating Info Panel */}
          <div
            className={`hidden md:block absolute bottom-6 lg:bottom-8 z-20 w-full max-w-sm ${
              activeHotspot && activeHotspot.position.x > 55
                ? 'left-6 lg:left-8'
                : 'right-6 lg:right-8'
            }`}
          >
            <AnimatePresence mode="wait">
              {activeHotspot && renderInfoCard(activeHotspot, false)}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Stacked Info Panel */}
        <div className="md:hidden px-6 mt-6">
          <AnimatePresence mode="wait">
            {activeHotspot && renderInfoCard(activeHotspot, true)}
          </AnimatePresence>
        </div>
      </div>

      {/* Accessible Quick-Select Hotspot Index */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 md:mt-10">
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
          <span className="eyebrow text-[11px] text-warm-gray mr-2">
            Key Elements:
          </span>
          {kitchenHotspots.map((hotspot, index) => {
            const isActive = hotspot.id === activeId;
            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => handleHotspotToggle(hotspot.id)}
                aria-pressed={isActive}
                className={`px-3.5 py-2 text-xs tracking-wider transition-all duration-300 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pure-white ${
                  isActive
                    ? 'bg-brand-red border-brand-red text-pure-white'
                    : 'bg-dark-surface/80 border-pure-white/15 text-pure-white/80 hover:border-bronze hover:text-pure-white'
                }`}
              >
                <span className={`mr-1.5 font-medium ${isActive ? 'text-pure-white' : 'text-bronze'}`}>
                  {isActive ? '•' : String(index + 1).padStart(2, '0')}
                </span>
                {hotspot.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
