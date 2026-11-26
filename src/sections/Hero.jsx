import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { company, navigation } from '../data/company';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { events, trackEvent } from '../config/tracking';

gsap.registerPlugin(ScrollTrigger);

const SLIDE_INTERVAL_MS = 8000;
const CROSSFADE_DURATION_MS = 1200;

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/images/hero/hero-1.webp',
    alt: 'Contemporary natural oak European modular kitchen with honed travertine waterfall island and integrated oven stack',
    caption: 'Oak & Travertine Island Architecture',
    fallbackGradient:
      'radial-gradient(circle at 72% 32%, rgba(179, 154, 125, 0.24) 0%, rgba(36, 31, 27, 0.92) 48%, #141414 100%)',
  },
  {
    id: 'slide-2',
    image: '/images/hero/hero-2.webp',
    alt: 'Matte charcoal graphite and smoked walnut handleless kitchen with monolithic stone island and architectural extraction hood',
    caption: 'Graphite & Smoked Walnut Monolith',
    fallbackGradient:
      'linear-gradient(135deg, #141414 0%, #241F1A 45%, #3B3128 80%, #181614 100%)',
  },
  {
    id: 'slide-3',
    image: '/images/hero/hero-3.webp',
    alt: 'Warm cashmere satin-lacquer European modular kitchen with Calacatta quartz island and built-in appliances',
    caption: 'Warm Cashmere & Calacatta Quartz',
    fallbackGradient:
      'radial-gradient(circle at 68% 38%, rgba(179, 154, 125, 0.3) 0%, rgba(28, 28, 28, 0.94) 55%, #141414 100%)',
  },
  {
    id: 'slide-4',
    image: '/images/hero/hero-4.webp',
    alt: 'Bespoke brushed stainless steel island kitchen paired with ash timber pocket-door coffee niche',
    caption: 'Stainless Steel & Pocket-Door Atelier',
    fallbackGradient:
      'linear-gradient(145deg, #141414 0%, #1E1A17 38%, #342B22 72%, #141414 100%)',
  },
];

function Hero({ revealReady = true }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const sectionRef = useRef(null);
  const parallaxRef = useRef(null);
  const contentRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const hasAnimatedEntranceRef = useRef(false);

  const primaryMagnetic = useMagneticButton(0.2);
  const secondaryMagnetic = useMagneticButton(0.2);

  const collectionsHref =
    navigation.find((item) => item.id === 'collections')?.href || '#collections';
  const contactHref =
    navigation.find((item) => item.id === 'contact')?.href || '#contact';

  const goToSlide = useCallback((nextIndex) => {
    setCurrentSlide((prev) => {
      const normalized = (nextIndex + HERO_SLIDES.length) % HERO_SLIDES.length;
      if (normalized === prev) return prev;
      setPreviousSlide(prev);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      fadeTimeoutRef.current = setTimeout(() => {
        setPreviousSlide(null);
      }, CROSSFADE_DURATION_MS);
      return normalized;
    });
  }, []);

  const handleNextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const handlePrevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  // Synchronized hero headline & CTA entrance when cabinet doors part open
  useEffect(() => {
    if (!revealReady || hasAnimatedEntranceRef.current) return undefined;
    hasAnimatedEntranceRef.current = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const revealItems = contentRef.current?.querySelectorAll('.hero-reveal');
      if (revealItems && revealItems.length > 0) {
        gsap.fromTo(
          revealItems,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.08,
            clearProps: 'transform,opacity',
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [revealReady]);

  // Subtle background parallax on scroll
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      if (parallaxRef.current && sectionRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleImageError = useCallback((slideId) => {
    setFailedImages((prev) => ({ ...prev, [slideId]: true }));
  }, []);

  const scrollToTarget = useCallback((selector) => {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label={`${company.name} Hero Showcase`}
      className="group relative h-screen min-h-[640px] w-full overflow-hidden bg-carbon text-pure-white select-none"
    >
      <style>{`
        @keyframes heroKenBurns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.08);
          }
        }
      `}</style>

      {/* Parallax Background Slideshow */}
      <div
        ref={parallaxRef}
        className="pointer-events-none absolute inset-x-0 -top-[6%] h-[112%] w-full will-change-transform"
        aria-hidden="true"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          const isExiting = index === previousSlide;
          const isVisible = isActive || isExiting;
          const imageFailed = Boolean(failedImages[slide.id]);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                isActive ? 'z-10 opacity-100' : isExiting ? 'z-0 opacity-0' : 'z-0 opacity-0'
              }`}
            >
              <div
                className="relative h-full w-full will-change-transform"
                style={{
                  background: slide.fallbackGradient,
                  animation: isVisible
                    ? `heroKenBurns ${SLIDE_INTERVAL_MS + CROSSFADE_DURATION_MS}ms ease-out forwards`
                    : 'none',
                }}
              >
                {!imageFailed && (
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    onError={() => handleImageError(slide.id)}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Editorial Gradient Scrim — leaves kitchen interior bright & primary */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-carbon/80 via-carbon/20 to-carbon/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-carbon/55 via-carbon/10 to-transparent"
        aria-hidden="true"
      />

      {/* Refined Architectural Brand Stamp — Top Right below Header */}
      <div className="pointer-events-none absolute top-24 right-6 sm:right-10 lg:right-20 z-30 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-carbon/55 backdrop-blur-md border border-pure-white/15">
        <img
          src={company.logos.monogramLight}
          alt=""
          aria-hidden="true"
          className="h-7 w-auto object-contain"
        />
        <div className="border-l border-pure-white/20 pl-3 leading-tight">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-pure-white">
            {company.name}
          </p>
          <p className="font-body text-[9px] uppercase tracking-[0.18em] text-bronze">
            Salem Showroom
          </p>
        </div>
      </div>

      {/* Subtle Hover Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-pure-white/20 bg-carbon/35 p-3 text-pure-white/80 backdrop-blur-md transition-all duration-300 hover:border-pure-white/50 hover:bg-carbon/60 hover:text-pure-white md:flex md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-pure-white/20 bg-carbon/35 p-3 text-pure-white/80 backdrop-blur-md transition-all duration-300 hover:border-pure-white/50 hover:bg-carbon/60 hover:text-pure-white md:flex md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Main Content Overlay — Bottom Left */}
      <div className="relative z-30 flex h-full w-full flex-col justify-end px-6 pb-28 sm:px-10 md:px-14 md:pb-32 lg:px-20 lg:pb-28">
        <div ref={contentRef} className="max-w-5xl">
          <div className="hero-reveal mb-4 flex items-center gap-3 md:mb-5">
            <span className="h-px w-8 bg-bronze" aria-hidden="true" />
            <p className="eyebrow text-bronze">CRAFTED FOR EXTRAORDINARY LIVING</p>
          </div>

          <h1 className="hero-reveal font-heading text-5xl font-light leading-[1.03] tracking-[-0.02em] text-pure-white md:text-7xl lg:text-8xl">
            Where Luxury Meets
            <br className="hidden sm:inline" /> Everyday Living.
          </h1>

          <p className="hero-reveal body-text mt-5 max-w-2xl text-sm text-pure-white/85 sm:text-base md:mt-6 md:text-lg">
            Discover thoughtfully designed modular kitchens, premium appliances and
            architectural hardware that transform everyday spaces into exceptional
            living experiences.
          </p>

          <div className="hero-reveal mt-8 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-10">
            <a
              href={collectionsHref}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(collectionsHref);
              }}
              ref={primaryMagnetic.ref}
              onMouseMove={primaryMagnetic.onMouseMove}
              onMouseLeave={primaryMagnetic.onMouseLeave}
              className="magnetic-btn group/btn inline-flex items-center justify-center gap-3 bg-brand-red px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.16em] text-pure-white transition-colors duration-300 hover:bg-brand-red/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pure-white"
            >
              <span>Explore Our Collections</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                strokeWidth={1.75}
              />
            </a>

            <a
              href={contactHref}
              onClick={(e) => {
                e.preventDefault();
                trackEvent(events.CONSULTATION_CLICK, { source: 'hero_secondary_cta' });
                scrollToTarget(contactHref);
              }}
              ref={secondaryMagnetic.ref}
              onMouseMove={secondaryMagnetic.onMouseMove}
              onMouseLeave={secondaryMagnetic.onMouseLeave}
              className="magnetic-btn inline-flex items-center justify-center border border-pure-white/55 bg-carbon/30 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.16em] text-pure-white backdrop-blur-sm transition-all duration-300 hover:border-pure-white hover:bg-pure-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-pure-white"
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Collection Indicator, Scroll Cue, Slide Dots */}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 z-30 flex items-center justify-between px-6 sm:px-10 md:px-14 lg:bottom-8 lg:pl-20 lg:pr-36">
        {/* Slide Label: compact 01 / 04 on tablet, full caption on desktop (1024px+) */}
        <div className="hidden items-center gap-3 text-xs tracking-[0.18em] text-pure-white/75 uppercase md:flex">
          <span className="font-body font-medium text-pure-white">
            0{currentSlide + 1}
          </span>
          <span className="h-px w-4 bg-pure-white/35" aria-hidden="true" />
          <span className="font-body lg:hidden">0{HERO_SLIDES.length}</span>
          <span className="hidden font-body lg:inline">{HERO_SLIDES[currentSlide].caption}</span>
        </div>

        {/* Center Animated Scroll Indicator */}
        <button
          type="button"
          onClick={() => scrollToTarget('#about')}
          aria-label="Scroll down to discover Kraft Homes"
          className="pointer-events-auto mx-auto flex flex-col items-center gap-1 text-pure-white/80 transition-colors duration-300 hover:text-pure-white focus:outline-none md:absolute md:left-1/2 md:-translate-x-1/2 cursor-pointer"
        >
          <span className="font-body text-[10px] uppercase tracking-[0.25em] text-pure-white/70">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex"
          >
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
          </motion.span>
        </button>

        {/* Slide Indicator Dots */}
        <div
          className="pointer-events-auto flex items-center gap-2.5"
          role="tablist"
          aria-label="Hero slides"
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show slide ${index + 1}: ${slide.caption}`}
                onClick={() => goToSlide(index)}
                className="group/dot relative flex h-5 items-center justify-center p-1 focus:outline-none cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'w-7 bg-brand-red'
                      : 'w-1.5 bg-pure-white/45 group-hover/dot:bg-pure-white/85'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Hero;
