import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Lightbulb, Users } from 'lucide-react';
import { company } from '../data/company';
import {
  animateTextReveal,
  animateImageReveal,
  animateFadeInUp,
  animateLine,
} from '../animations/gsapAnimations';

gsap.registerPlugin(ScrollTrigger);

const VALUE_ICONS = {
  Integrity: Heart,
  Innovation: Lightbulb,
  'Customer-Centricity': Users,
};

export default function About() {
  const sectionRef = useRef(null);
  const textGroupRef = useRef(null);
  const imageWrapRef = useRef(null);
  const specializationsRef = useRef(null);
  const valuesRef = useRef(null);
  const dividerRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  const { parent, location, tagline, about, logos } = company;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textGroupRef.current) {
        const textItems = textGroupRef.current.querySelectorAll('.about-stagger');
        if (textItems.length) {
          animateTextReveal(textItems, textGroupRef.current, {
            stagger: 0.14,
            duration: 0.95,
            start: 'top 82%',
          });
        }
      }

      if (imageWrapRef.current) {
        animateImageReveal(imageWrapRef.current, imageWrapRef.current, {
          duration: 1.25,
          start: 'top 78%',
        });
      }

      if (specializationsRef.current) {
        const specItems =
          specializationsRef.current.querySelectorAll('.spec-item');
        if (specItems.length) {
          animateFadeInUp(specItems, specializationsRef.current, {
            y: 24,
            stagger: 0.06,
            duration: 0.7,
            start: 'top 85%',
          });
        }
      }

      if (valuesRef.current) {
        const valueCards = valuesRef.current.querySelectorAll('.value-card');
        if (valueCards.length) {
          animateFadeInUp(valueCards, valuesRef.current, {
            y: 32,
            stagger: 0.12,
            duration: 0.8,
            start: 'top 85%',
          });
        }
      }

      if (dividerRef.current) {
        animateLine(dividerRef.current, dividerRef.current, {
          origin: 'left center',
          duration: 1.1,
          start: 'top 90%',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative bg-ivory text-carbon py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle architectural watermark monogram */}
      <img
        src={logos.monogramDark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-16 h-72 w-auto opacity-[0.03] select-none hidden lg:block"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative">
        {/* Asymmetric Split-Screen Editorial Layout: 5 cols text / 7 cols image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Narrative (5 columns) */}
          <div ref={textGroupRef} className="lg:col-span-5 flex flex-col">
            <div className="about-stagger flex items-center gap-3 mb-5">
              <span className="inline-block w-8 h-px bg-brand-red" aria-hidden="true" />
              <p className="eyebrow text-bronze">
                An Extension of {parent}
              </p>
            </div>

            <h2
              id="about-heading"
              className="about-stagger font-heading text-4xl md:text-6xl font-light tracking-tight leading-[1.08] text-carbon mb-8"
            >
              Thoughtfully Designed. Beautifully Crafted.
            </h2>

            <div className="about-stagger space-y-5 font-body text-sm md:text-base text-carbon/80 leading-relaxed mb-8">
              <p>{about.intro}</p>
              <p>{about.description}</p>
              <p className="text-carbon/75">{about.whyChooseUs}</p>
            </div>

            {/* Vision Callout */}
            <blockquote className="about-stagger border-l border-bronze pl-5 py-1 mb-10">
              <p className="font-heading italic text-xl md:text-2xl text-carbon leading-snug">
                &ldquo;{about.vision}&rdquo;
              </p>
            </blockquote>

            {/* Capabilities & Infrastructure from company.js */}
            <div ref={specializationsRef} className="pt-6 border-t border-light-gray">
              <p className="eyebrow text-warm-gray mb-4">
                Craft &amp; Infrastructure
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {about.specializations.map((item) => (
                  <li
                    key={item}
                    className="spec-item flex items-start gap-2.5 font-body text-xs md:text-sm text-carbon/85"
                  >
                    <span
                      className="mt-2 h-1 w-1 rounded-full bg-brand-red shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Bespoke Architectural Studio Visual (7 columns) */}
          <div className="lg:col-span-7 lg:pl-4">
            <div
              ref={imageWrapRef}
              className="relative w-full aspect-[3/4] sm:aspect-[4/4] lg:aspect-[10/11] overflow-hidden bg-gradient-to-br from-carbon via-dark-surface to-bronze/40 shadow-xl"
            >
              {!imgError ? (
                <img
                  src={about.image}
                  alt={about.imageAlt}
                  onError={() => setImgError(true)}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.03]"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col justify-between p-8 md:p-12 bg-gradient-to-br from-carbon via-dark-surface to-bronze/30 text-ivory"
                  role="img"
                  aria-label={`${company.name} design consultation studio`}
                >
                  <span className="eyebrow text-bronze">{location}</span>
                  <div className="max-w-md">
                    <p className="font-heading text-3xl md:text-4xl font-light text-pure-white mb-2">
                      {company.name}
                    </p>
                    <p className="font-body text-xs tracking-widest uppercase text-ivory/70">
                      {tagline}
                    </p>
                  </div>
                </div>
              )}

              {/* Subtle architectural gradient vignette */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-carbon/15"
                aria-hidden="true"
              />

              {/* Top-left Official Brand Lockup Stamp on Ivory Plaque */}
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 bg-pure-white/95 backdrop-blur-md px-4 py-2.5 shadow-lg border border-carbon/10">
                <img
                  src={logos.headerDark}
                  alt={`${company.name} Logo`}
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>

              {/* Editorial Caption Strip */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-wrap items-end justify-between gap-4 text-pure-white">
                <div>
                  <p className="eyebrow text-bronze mb-1">{location}</p>
                  <p className="font-heading text-xl md:text-2xl font-normal tracking-wide">
                    {about.infrastructure.join(' · ')}
                  </p>
                </div>
                <span className="font-body text-[11px] uppercase tracking-[0.2em] text-ivory/90 border border-pure-white/25 px-3 py-1.5 backdrop-blur-sm bg-carbon/45">
                  {parent}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Values Row */}
        <div
          ref={valuesRef}
          className="mt-16 md:mt-24 pt-12 border-t border-light-gray grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {about.values.map((value) => {
            const IconComponent = VALUE_ICONS[value.title] || Heart;
            return (
              <article
                key={value.title}
                className="value-card group flex items-start gap-4"
              >
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bronze/40 bg-pure-white/60 text-bronze transition-colors duration-300 group-hover:border-brand-red group-hover:text-brand-red">
                  <IconComponent className="h-4 w-4 stroke-[1.5]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-medium text-carbon mb-1.5">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm font-light text-carbon/75 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Animated Divider Line with Brand Monogram */}
        <div className="mt-20 md:mt-24 flex items-center gap-6">
          <div
            ref={dividerRef}
            className="h-px flex-1 bg-gradient-to-r from-bronze via-light-gray to-transparent"
            aria-hidden="true"
          />
          <img
            src={logos.monogramDark}
            alt=""
            aria-hidden="true"
            className="h-7 w-auto opacity-30"
          />
          <div
            className="h-px flex-1 bg-gradient-to-l from-bronze via-light-gray to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
