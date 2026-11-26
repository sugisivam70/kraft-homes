import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '../data/process';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const desktopLineRef = useRef(null);
  const mobileLineRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Desktop horizontal connecting line + staggered steps
      const desktopSteps = gsap.utils.toArray('.process-step-desktop');
      if (desktopLineRef.current) {
        gsap.from(desktopLineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '.process-desktop-timeline',
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (desktopSteps.length) {
        gsap.from(desktopSteps, {
          y: 45,
          opacity: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-desktop-timeline',
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Mobile vertical connecting line + staggered steps
      const mobileSteps = gsap.utils.toArray('.process-step-mobile');
      if (mobileLineRef.current) {
        gsap.from(mobileLineRef.current, {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '.process-mobile-timeline',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (mobileSteps.length) {
        gsap.from(mobileSteps, {
          x: -20,
          y: 25,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-mobile-timeline',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="relative bg-pure-white text-carbon py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle architectural background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-gray to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <header
          ref={headerRef}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <p className="eyebrow text-bronze mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-bronze" aria-hidden="true" />
            <span>The Kraft Homes Journey</span>
          </p>

          <h2
            id="process-heading"
            className="font-heading text-4xl md:text-6xl font-light tracking-tight leading-[1.08] text-carbon"
          >
            From Your Vision to Your Dream Home.
          </h2>

          <p className="body-text text-carbon/70 text-base md:text-lg mt-6 max-w-2xl">
            Every space follows a disciplined, transparent six-stage workflow—from
            your initial showroom consultation in Salem to precision installation
            and final handover.
          </p>
        </header>

        {/* Desktop Horizontal Timeline (lg+) */}
        <div className="process-desktop-timeline hidden lg:block relative">
          {/* Connecting track aligned to the indicator dots */}
          <div
            aria-hidden="true"
            className="absolute top-[6.25rem] left-[8.333%] right-[8.333%] h-px bg-light-gray"
          >
            <div
              ref={desktopLineRef}
              className="h-full w-full bg-gradient-to-r from-brand-red via-bronze to-carbon/40"
            />
          </div>

          <ol className="grid grid-cols-6 gap-6 xl:gap-8 list-none p-0 m-0">
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="process-step-desktop group relative flex flex-col"
              >
                {/* Large Decorative Step Number */}
                <div className="h-20 flex items-end pb-3">
                  <span
                    aria-hidden="true"
                    className="font-heading text-7xl font-light leading-none tracking-tight text-brand-red/20 transition-colors duration-500 group-hover:text-brand-red/45 select-none"
                  >
                    {step.number}
                  </span>
                </div>

                {/* Timeline Node */}
                <div className="relative z-10 flex items-center h-10 mb-6">
                  <span className="relative flex items-center justify-center w-4 h-4 rounded-full bg-pure-white border border-bronze transition-all duration-300 group-hover:border-brand-red group-hover:scale-125">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red transition-transform duration-300 group-hover:scale-110" />
                  </span>
                </div>

                {/* Step Details */}
                <div className="pr-2">
                  <span className="sr-only">Step {step.number}: </span>
                  <h3 className="font-heading text-2xl font-medium leading-snug text-carbon mb-3 transition-colors duration-300 group-hover:text-brand-red">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm font-light leading-relaxed text-carbon/70">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile & Tablet Vertical Timeline (< lg) */}
        <div className="process-mobile-timeline lg:hidden relative">
          {/* Vertical connecting line on left */}
          <div
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-4 sm:left-5 w-px bg-light-gray"
          >
            <div
              ref={mobileLineRef}
              className="w-full h-full bg-gradient-to-b from-brand-red via-bronze to-carbon/30"
            />
          </div>

          <ol className="space-y-10 sm:space-y-12 list-none p-0 m-0">
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="process-step-mobile group relative pl-12 sm:pl-16"
              >
                {/* Timeline Node on Left Line */}
                <div
                  aria-hidden="true"
                  className="absolute left-4 sm:left-5 top-3 -translate-x-1/2 z-10 flex items-center justify-center w-4 h-4 rounded-full bg-pure-white border border-bronze transition-colors duration-300 group-hover:border-brand-red"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                </div>

                <div className="border-b border-light-gray/80 pb-8 group-last:border-b-0 group-last:pb-0">
                  <span
                    aria-hidden="true"
                    className="block font-heading text-6xl sm:text-7xl font-light leading-none text-brand-red/20 mb-2 select-none"
                  >
                    {step.number}
                  </span>

                  <span className="sr-only">Step {step.number}: </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-medium leading-snug text-carbon mb-2.5">
                    {step.title}
                  </h3>

                  <p className="font-body text-sm sm:text-base font-light leading-relaxed text-carbon/70 max-w-xl">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Editorial Bottom Bar */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-light-gray flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-body text-sm font-light text-carbon/65">
            Dedicated manufacturing facility, display showroom &amp; trained installation team under one roof.
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.18em] text-carbon hover:text-brand-red transition-colors duration-300 self-start sm:self-auto"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
