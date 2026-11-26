import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { collections } from '../data/collections';
import { events, trackEvent } from '../config/tracking';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { navigateToEnquiry } from '../utils/whatsapp';

gsap.registerPlugin(ScrollTrigger);

const COLLECTION_GRADIENTS = {
  'modular-kitchens':
    'bg-[radial-gradient(circle_at_25%_25%,rgba(179,154,125,0.28),transparent_55%),linear-gradient(135deg,#1C1C1C_0%,#2B241E_48%,#141414_100%)]',
  wardrobes:
    'bg-[radial-gradient(circle_at_75%_30%,rgba(179,154,125,0.25),transparent_50%),linear-gradient(145deg,#25221E_0%,#3D352C_52%,#181614_100%)]',
  appliances:
    'bg-[radial-gradient(circle_at_30%_70%,rgba(215,25,32,0.16),transparent_50%),linear-gradient(135deg,#141414_0%,#262628_50%,#101012_100%)]',
  hardware:
    'bg-[radial-gradient(circle_at_70%_25%,rgba(179,154,125,0.32),transparent_52%),linear-gradient(125deg,#1A1917_0%,#302921_55%,#141414_100%)]',
  quartz:
    'bg-[radial-gradient(circle_at_40%_30%,rgba(247,245,240,0.22),transparent_55%),linear-gradient(135deg,#33302B_0%,#585046_50%,#211F1C_100%)]',
  aluminium:
    'bg-[radial-gradient(circle_at_65%_65%,rgba(179,154,125,0.24),transparent_50%),linear-gradient(135deg,#191B1E_0%,#2C3036_50%,#141414_100%)]',
};

function CollectionCard({ collection, index }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const magneticProps = useMagneticButton(0.2);

  const isEven = index % 2 === 0;
  const isImageLeft = isEven;
  const formattedIndex = String(index + 1).padStart(2, '0');
  const gradientClass =
    COLLECTION_GRADIENTS[collection.id] ||
    'bg-[linear-gradient(135deg,#1C1C1C_0%,#2E2822_50%,#141414_100%)]';

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    trackEvent(events.COLLECTION_ENQUIRY, {
      collection_id: collection.id,
      category: collection.enquiryCategory,
    });
    navigateToEnquiry(
      collection.enquiryCategory,
      `Interested in ${collection.title}.`
    );
  };

  return (
    <article
      id={`collection-${collection.id}`}
      data-collection-card
      aria-labelledby={`collection-title-${collection.id}`}
      className={`w-full py-16 md:py-24 transition-colors duration-300 ${
        isEven
          ? 'bg-ivory text-carbon border-t border-carbon/10'
          : 'bg-carbon text-ivory'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          className={`flex flex-col ${
            isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
          } items-center gap-10 md:gap-12 lg:gap-16`}
        >
          {/* Large Editorial Image (60% width on desktop) */}
          <div className="w-full lg:w-[60%]" data-collection-media>
            <div className="group relative overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] shadow-2xl">
              {/* Fallback */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 ${gradientClass} transition-transform duration-700 ease-out group-hover:scale-105`}
              >
                <div className="absolute inset-4 border border-bronze/25 pointer-events-none" />
                <div
                  className={`flex h-full w-full flex-col justify-between p-6 sm:p-10 transition-opacity duration-500 ${
                    imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-bronze/80">
                    <span className="eyebrow text-[11px]">Kraft Homes</span>
                    <span className="font-heading text-2xl tracking-wider">
                      {formattedIndex}
                    </span>
                  </div>
                  <div>
                    <p className="eyebrow text-bronze/70 mb-2 text-[10px]">
                      {collection.enquiryCategory}
                    </p>
                    <p className="font-heading text-2xl sm:text-3xl text-ivory/90 font-light">
                      {collection.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Collection Photography */}
              {!imageError && (
                <img
                  src={collection.image}
                  alt={collection.imageAlt || `${collection.title} — ${collection.subtitle}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`relative z-10 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-pure-white/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 z-20 px-3 py-1 bg-carbon/80 backdrop-blur-md border border-bronze/30 text-ivory text-[11px] tracking-[0.2em] uppercase font-body"
              >
                {formattedIndex} / {collection.enquiryCategory}
              </div>
            </div>
          </div>

          {/* Asymmetric Editorial Content (40% width on desktop) */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center">
            <div data-stagger className="flex items-center gap-3 mb-4">
              <span className="text-brand-red font-body text-xs font-semibold tracking-[0.22em] uppercase">
                {formattedIndex}
              </span>
              <span
                aria-hidden="true"
                className={`h-px w-8 ${isEven ? 'bg-carbon/25' : 'bg-ivory/25'}`}
              />
              <span className="eyebrow text-warm-gray">
                {collection.enquiryCategory}
              </span>
            </div>

            <h3
              id={`collection-title-${collection.id}`}
              data-stagger
              className="font-heading text-3xl md:text-4xl font-normal tracking-tight leading-[1.15] mb-2"
            >
              {collection.title}
            </h3>

            <p
              data-stagger
              className="font-heading italic text-xl md:text-2xl text-bronze mb-5"
            >
              {collection.subtitle}
            </p>

            <div
              data-stagger
              aria-hidden="true"
              className="w-12 h-px bg-bronze/60 mb-6"
            />

            <p
              data-stagger
              className={`body-text text-sm md:text-base mb-8 ${
                isEven ? 'text-carbon/80' : 'text-ivory/80'
              }`}
            >
              {collection.description}
            </p>

            {/* Feature List */}
            <ul
              data-stagger
              aria-label={`${collection.title} highlights`}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-3 mb-9 py-5 border-y ${
                isEven ? 'border-carbon/12' : 'border-ivory/12'
              }`}
            >
              {collection.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-xs md:text-sm font-body tracking-wide"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bronze"
                  />
                  <span className={isEven ? 'text-carbon/85' : 'text-ivory/85'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Enquiry CTA */}
            <div data-stagger>
              <a
                href="#contact"
                onClick={handleEnquiryClick}
                {...magneticProps}
                className={`magnetic-btn group/btn inline-flex items-center gap-3 px-7 py-3.5 text-xs font-body font-semibold uppercase tracking-[0.18em] transition-all duration-300 border ${
                  isEven
                    ? 'bg-carbon text-ivory border-carbon hover:bg-brand-red hover:border-brand-red hover:text-pure-white'
                    : 'bg-ivory text-carbon border-ivory hover:bg-brand-red hover:border-brand-red hover:text-pure-white'
                }`}
              >
                <span>Enquire About {collection.enquiryCategory}</span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Collections() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const headerItems = headerRef.current.querySelectorAll('[data-header-reveal]');
        gsap.from(headerItems, {
          y: 44,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

      const cards = gsap.utils.toArray('[data-collection-card]');
      cards.forEach((card) => {
        const media = card.querySelector('[data-collection-media]');
        const staggerItems = card.querySelectorAll('[data-stagger]');

        if (media) {
          gsap.from(media, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          });
        }

        if (staggerItems.length > 0) {
          gsap.from(staggerItems, {
            y: 32,
            opacity: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToCollection = (id) => {
    const el = document.getElementById(`collection-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="collections"
      ref={sectionRef}
      aria-labelledby="collections-heading"
      className="relative bg-ivory text-carbon overflow-hidden"
    >
      {/* Editorial Section Header + Quick Category Jump Strip */}
      <header
        ref={headerRef}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-12 md:pt-28 md:pb-16"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-3xl">
            <div data-header-reveal className="flex items-center gap-3 mb-5">
              <span aria-hidden="true" className="w-8 h-px bg-brand-red" />
              <span className="eyebrow text-bronze">Curated Collections</span>
            </div>

            <h2
              id="collections-heading"
              data-header-reveal
              className="font-heading text-4xl md:text-6xl font-light tracking-tight leading-[1.08] text-carbon"
            >
              Exceptional Products.{' '}
              <span className="italic text-bronze block sm:inline">
                Endless Possibilities.
              </span>
            </h2>
          </div>

          <p
            data-header-reveal
            className="body-text text-carbon/75 text-sm md:text-base max-w-md lg:pb-2"
          >
            Architectural kitchens, precision hardware, and bespoke interior
            systems crafted with European minimalism and enduring materiality.
          </p>
        </div>

        {/* Horizontal Category Navigation Pills (scrollable on mobile) */}
        <div
          data-header-reveal
          className="mt-10 flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar"
          role="navigation"
          aria-label="Jump to collection"
        >
          {collections.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToCollection(item.id)}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-carbon/15 bg-pure-white/75 hover:border-brand-red hover:text-brand-red text-xs font-body uppercase tracking-[0.14em] transition-colors duration-300 cursor-pointer"
            >
              <span className="text-bronze font-semibold">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Editorial Product Showcase Bands */}
      <div>
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
