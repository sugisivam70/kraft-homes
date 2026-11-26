import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  ArrowUpRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Factory,
  Warehouse,
  Phone,
} from 'lucide-react';
import { company } from '../data/company';
import { showroomFacilities } from '../data/showroom';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { events, trackEvent } from '../config/tracking';
import {
  animateTextReveal,
  animateFadeInUp,
  animateLine,
} from '../animations/gsapAnimations';

const ICON_BY_FACILITY = {
  'Display Showroom': Building2,
  'Manufacturing Unit': Factory,
  Warehouse: Warehouse,
};

const STYLE_BY_FACILITY = {
  'Display Showroom': {
    gradient: 'linear-gradient(135deg, #141414 0%, #241F1B 48%, #B39A7D 100%)',
    accentGlow:
      'radial-gradient(circle at 22% 28%, rgba(179, 154, 125, 0.35), transparent 58%)',
  },
  'Manufacturing Unit': {
    gradient: 'linear-gradient(145deg, #1C1C1C 0%, #2B2622 55%, #4A3D31 100%)',
    accentGlow:
      'radial-gradient(circle at 80% 25%, rgba(215, 25, 32, 0.25), transparent 55%)',
  },
  Warehouse: {
    gradient: 'linear-gradient(155deg, #1A1816 0%, #382F26 52%, #8B7358 100%)',
    accentGlow:
      'radial-gradient(circle at 75% 75%, rgba(179, 154, 125, 0.3), transparent 60%)',
  },
};

const FILTER_OPTIONS = ['All Facilities', ...company.about.infrastructure];

export default function Showroom() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const gridRef = useRef(null);
  const infoRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('All Facilities');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const ctaMagnetic = useMagneticButton(0.25);

  const filteredItems =
    activeFilter === 'All Facilities'
      ? showroomFacilities
      : showroomFacilities.filter((item) => item.facility === activeFilter);

  const activeItem =
    selectedIndex !== null ? filteredItems[selectedIndex] ?? null : null;

  const openLightbox = (index) => {
    setSelectedIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null || filteredItems.length === 0) return null;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null || filteredItems.length === 0) return null;
      return (prev + 1) % filteredItems.length;
    });
  }, [filteredItems.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const revealTargets =
          headingRef.current.querySelectorAll('.showroom-reveal');
        if (revealTargets.length > 0) {
          animateTextReveal(revealTargets, headingRef.current, {
            stagger: 0.12,
          });
        }
      }

      if (lineRef.current) {
        animateLine(lineRef.current, sectionRef.current);
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.showroom-card');
        if (cards.length > 0) {
          animateFadeInUp(cards, gridRef.current, {
            y: 36,
            stagger: 0.08,
            duration: 0.85,
          });
        }
      }

      if (infoRef.current) {
        animateFadeInUp(infoRef.current, infoRef.current, {
          y: 32,
          duration: 0.8,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, showPrev, showNext]);

  const handleFilterChange = (option) => {
    setSelectedIndex(null);
    setActiveFilter(option);
  };

  return (
    <section
      id="showroom"
      ref={sectionRef}
      aria-labelledby="showroom-heading"
      className="relative bg-ivory text-carbon py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #141414 1px, transparent 1px), linear-gradient(to bottom, #141414 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <header ref={headingRef} className="max-w-4xl">
          <p className="showroom-reveal eyebrow text-bronze mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-bronze" />
            Infrastructure &amp; Experience Center
          </p>

          <h2
            id="showroom-heading"
            className="showroom-reveal heading-lg font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-carbon tracking-tight"
          >
            Experience the Difference in Person.
          </h2>

          <p className="showroom-reveal body-text font-body text-base sm:text-lg text-carbon/75 mt-6 max-w-2xl">
            Behind every {company.name} kitchen in {company.location} stands an
            integrated ecosystem — our{' '}
            {company.about.infrastructure.join(', ').toLowerCase()} — ensuring
            architectural control from consultation to final installation.
          </p>
        </header>

        {/* Divider & Facility Filter Bar */}
        <div className="mt-12 mb-10">
          <div
            ref={lineRef}
            className="h-px w-full bg-carbon/15 mb-8"
            aria-hidden="true"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filter infrastructure facilities"
              className="flex flex-wrap items-center gap-2.5"
            >
              {FILTER_OPTIONS.map((option) => {
                const isActive = activeFilter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleFilterChange(option)}
                    className={`font-body text-xs sm:text-sm tracking-wider uppercase px-4 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-carbon text-ivory border-carbon shadow-sm'
                        : 'bg-pure-white/60 text-carbon/75 border-carbon/15 hover:border-bronze hover:text-carbon'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <p className="font-body text-xs tracking-widest uppercase text-warm-gray">
              Actual facility photos being updated
            </p>
          </div>
        </div>

        {/* Masonry Gallery */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:auto-rows-[220px]"
        >
          {filteredItems.map((item, idx) => {
            const IconComponent = ICON_BY_FACILITY[item.facility] || Building2;
            const styleDef =
              STYLE_BY_FACILITY[item.facility] || STYLE_BY_FACILITY['Display Showroom'];
            const hasImage = Boolean(item.image) && !failedImages[item.id];
            const spanClasses =
              activeFilter === 'All Facilities'
                ? item.gridClass
                : 'min-h-[300px] lg:row-span-1 lg:min-h-[280px]';

            return (
              <article
                key={item.id}
                className={`showroom-card group relative overflow-hidden rounded-sm bg-carbon cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 ${spanClasses}`}
              >
                <button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  aria-label={`Inspect ${item.title} (${item.facility})`}
                  className="relative w-full h-full text-left flex flex-col justify-between p-6 sm:p-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-ivory cursor-pointer"
                >
                  {/* Visual Background */}
                  {hasImage ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ background: styleDef.gradient }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 transition-opacity duration-500 opacity-80 group-hover:opacity-100"
                        style={{ background: styleDef.accentGlow }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-4 border border-pure-white/10 pointer-events-none transition-transform duration-700 group-hover:scale-[0.98]"
                      />
                    </>
                  )}

                  {/* Scrim */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-carbon/95 via-carbon/50 to-carbon/25 opacity-90 group-hover:opacity-95 transition-opacity duration-500"
                  />

                  {/* Top Row: Facility Badge + Expand Cue */}
                  <div className="relative z-10 flex items-start justify-between gap-3 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-carbon/60 backdrop-blur-md border border-pure-white/15 text-[11px] font-body font-medium uppercase tracking-[0.16em] text-ivory">
                        <IconComponent className="w-3.5 h-3.5 text-bronze" />
                        {item.facility}
                      </span>
                      {item.isConceptual && item.badgeText && (
                        <span className="px-2.5 py-1 bg-carbon/75 backdrop-blur-md border border-pure-white/15 text-[9px] font-body uppercase tracking-[0.14em] text-warm-gray">
                          {item.badgeText}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-carbon/55 backdrop-blur-md border border-pure-white/15 text-pure-white opacity-80 group-hover:opacity-100 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300 shrink-0">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Bottom Row */}
                  <div className="relative z-10 mt-auto pt-8">
                    <p className="font-body text-[11px] uppercase tracking-[0.2em] text-bronze mb-1.5">
                      {item.subtitle}
                    </p>
                    <h3 className="font-heading text-2xl sm:text-3xl font-normal text-pure-white leading-tight group-hover:text-ivory transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-ivory/75 mt-2.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-pure-white/10 flex items-center justify-between text-xs font-body text-ivory/70">
                      <span>{item.locationTag}</span>
                      <span className="inline-flex items-center gap-1 text-bronze group-hover:translate-x-1 transition-transform duration-300">
                        Explore <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>

        {/* Showroom Visit Info & CTA Card */}
        <div
          ref={infoRef}
          className="mt-12 md:mt-16 rounded-sm bg-pure-white border border-carbon/10 p-7 sm:p-10 lg:p-12 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-4 flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full bg-ivory border border-bronze/30 flex items-center justify-center text-bronze">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="eyebrow text-bronze mb-2">Showroom Address</p>
                <address className="not-italic font-body text-sm sm:text-base text-carbon/85 leading-relaxed">
                  {company.contact.address.line1}
                  <br />
                  {company.contact.address.line2}
                  <br />
                  {company.contact.address.line3}
                </address>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-start gap-4 lg:border-l lg:border-carbon/10 lg:pl-8">
              <div className="shrink-0 w-11 h-11 rounded-full bg-ivory border border-bronze/30 flex items-center justify-center text-bronze">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="eyebrow text-bronze mb-2">Opening Hours</p>
                <p className="font-body text-sm sm:text-base text-carbon/85 leading-relaxed">
                  {company.contact.hours.weekdays}
                </p>
                <p className="font-body text-sm text-carbon/60 mt-1">
                  {company.contact.hours.weekend}
                </p>
                <a
                  href={`tel:+${company.contact.phoneClean}`}
                  onClick={() =>
                    trackEvent(events.PHONE_CLICK, { source: 'showroom_card' })
                  }
                  className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm text-carbon/80 hover:text-brand-red transition-colors mt-2"
                >
                  <Phone className="w-3.5 h-3.5 text-bronze" />
                  {company.contact.phone}
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-end gap-3.5">
              <a
                href="#contact"
                ref={ctaMagnetic.ref}
                onMouseMove={ctaMagnetic.onMouseMove}
                onMouseLeave={ctaMagnetic.onMouseLeave}
                onClick={() =>
                  trackEvent(events.CONSULTATION_CLICK, { source: 'showroom_cta' })
                }
                className="magnetic-btn inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-brand-red text-pure-white font-body text-xs sm:text-sm font-medium uppercase tracking-[0.16em] rounded-sm hover:bg-carbon transition-colors duration-300 shadow-sm"
              >
                Visit Our Showroom
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={company.contact.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent(events.SHOWROOM_DIRECTIONS, { source: 'showroom_card' })
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-carbon/20 text-carbon font-body text-xs uppercase tracking-[0.14em] rounded-sm hover:border-bronze hover:text-bronze transition-colors duration-300"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                Get Google Maps Directions
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="showroom-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/90 backdrop-blur-md p-4 sm:p-6 md:p-10"
          >
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-sm bg-dark-surface border border-pure-white/15 shadow-2xl text-ivory"
            >
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-carbon/70 backdrop-blur-md border border-pure-white/20 flex items-center justify-center text-pure-white hover:bg-brand-red hover:border-brand-red transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                {activeItem.image && !failedImages[activeItem.id] ? (
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          (STYLE_BY_FACILITY[activeItem.facility] || STYLE_BY_FACILITY['Display Showroom']).gradient,
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-5 border border-pure-white/15 pointer-events-none"
                    />
                  </>
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-dark-surface via-carbon/35 to-transparent"
                />

                {filteredItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      aria-label="Previous facility"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-carbon/65 backdrop-blur-md border border-pure-white/20 flex items-center justify-center text-pure-white hover:bg-bronze hover:text-carbon hover:border-bronze transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next facility"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-carbon/65 backdrop-blur-md border border-pure-white/20 flex items-center justify-center text-pure-white hover:bg-bronze hover:text-carbon hover:border-bronze transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pure-white/10 backdrop-blur-md border border-pure-white/15 text-[11px] font-body uppercase tracking-[0.18em] text-bronze mb-3">
                    {activeItem.facility}
                  </span>
                  <h3
                    id="lightbox-title"
                    className="font-heading text-3xl sm:text-4xl font-normal text-pure-white"
                  >
                    {activeItem.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-10">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-bronze mb-2">
                  {activeItem.subtitle} &mdash; {activeItem.locationTag}
                </p>
                <p className="body-text font-body text-sm sm:text-base text-ivory/80 leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {activeItem.specs.map((spec) => (
                    <span
                      key={spec}
                      className="font-body text-xs tracking-wide px-3.5 py-1.5 rounded-sm bg-carbon border border-pure-white/10 text-ivory/85"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-pure-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="font-body text-xs text-warm-gray">
                    {selectedIndex + 1} of {filteredItems.length} &mdash;{' '}
                    {company.name}, {company.location}
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={company.contact.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent(events.SHOWROOM_DIRECTIONS, { source: 'showroom_lightbox' })
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-pure-white/20 text-ivory font-body text-xs uppercase tracking-wider rounded-sm hover:border-bronze hover:text-bronze transition-colors"
                    >
                      Directions <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="#contact"
                      onClick={closeLightbox}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-red text-pure-white font-body text-xs uppercase tracking-wider rounded-sm hover:bg-bronze hover:text-carbon transition-colors"
                    >
                      Visit Our Showroom
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
