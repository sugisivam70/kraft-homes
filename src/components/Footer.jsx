import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  X,
} from 'lucide-react';

function InstagramGlyph({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import { company, navigation } from '../data/company';
import { collections } from '../data/collections';
import { events, trackEvent } from '../config/tracking';
import { navigateToEnquiry } from '../utils/whatsapp';

gsap.registerPlugin(ScrollTrigger);

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Effective 2025',
    sections: [
      {
        heading: 'Information We Collect',
        body: `When you submit an enquiry, schedule a showroom visit, or reach out via phone, email, or WhatsApp, ${company.name} collects only the contact and project details you voluntarily share—such as your name, phone number, email address, location, and interior requirements.`,
      },
      {
        heading: 'How We Use Your Information',
        body: 'Your details are used solely to respond to consultation requests, prepare tailored design proposals, and coordinate showroom appointments in Salem and surrounding regions. We never sell or rent your personal information to third parties.',
      },
      {
        heading: 'Contact & Data Requests',
        body: `To update or request removal of your contact details, write to us at ${company.contact.email} or call ${company.contact.phone}.`,
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'Effective 2025',
    sections: [
      {
        heading: 'Consultations & Specifications',
        body: `All modular kitchen, wardrobe, appliance, and architectural hardware specifications displayed on this website are curated references. Final material finishes, dimensions, pricing, and delivery timelines are confirmed during personalized showroom consultations with ${company.name}.`,
      },
      {
        heading: 'Brand Products & Warranties',
        body: 'Appliances, surfaces, and hardware systems are covered under their respective manufacturer terms alongside Kraft Homes installation standards.',
      },
      {
        heading: 'Intellectual Property',
        body: `All brand assets and editorial content on this website belong to ${company.name}, an extension of ${company.parent}.`,
      },
    ],
  },
};

function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const columnsRef = useRef([]);
  const [activeLegal, setActiveLegal] = useState(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (wordmarkRef.current) {
        gsap.from(wordmarkRef.current, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      const validColumns = columnsRef.current.filter(Boolean);
      if (validColumns.length > 0) {
        gsap.from(validColumns, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!activeLegal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveLegal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLegal]);

  const setColumnRef = (index) => (el) => {
    columnsRef.current[index] = el;
  };

  const activePolicy = activeLegal ? LEGAL_CONTENT[activeLegal] : null;

  return (
    <>
      <footer
        ref={footerRef}
        className="bg-carbon text-pure-white relative overflow-hidden border-t border-pure-white/10 pb-14 lg:pb-0"
        aria-label="Site footer"
      >
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bronze/40 to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-24">
          {/* Top Brand Lockup Statement */}
          <div
            ref={wordmarkRef}
            className="pb-12 md:pb-16 border-b border-pure-white/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">
              <span className="eyebrow text-bronze tracking-[0.22em]">
                {company.tagline}
              </span>
              <span className="text-xs font-body tracking-widest uppercase text-warm-gray">
                {company.location}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <img
                src={company.logos.headerLight}
                alt={`${company.name} — ${company.tagline}`}
                className="h-14 sm:h-20 md:h-24 w-auto object-contain object-left"
              />
              <span
                className="hidden md:block w-16 h-[2px] bg-brand-red mb-3 shrink-0"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pt-12 md:pt-16">
            {/* Column 1: Company */}
            <div ref={setColumnRef(0)} className="space-y-5">
              <h2 className="eyebrow text-bronze">Company</h2>
              <div className="space-y-4">
                <div className="inline-block bg-pure-white/5 border border-pure-white/10 px-4 py-3">
                  <img
                    src={company.logos.stackedLight}
                    alt={company.name}
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <p className="body-text text-sm text-warm-gray leading-relaxed">
                  {company.about.intro}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={company.contact.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Kraft Homes on Instagram"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-pure-white/15 text-xs font-medium tracking-wider uppercase text-warm-gray hover:text-pure-white hover:border-bronze transition"
                >
                  <InstagramGlyph className="w-3.5 h-3.5 text-bronze" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-70" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div ref={setColumnRef(1)} className="space-y-5">
              <h2 className="eyebrow text-bronze">Quick Links</h2>
              <nav aria-label="Footer quick links">
                <ul className="space-y-3">
                  {navigation.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-pure-white transition group"
                      >
                        <span
                          className="w-0 group-hover:w-3 h-px bg-brand-red transition-all duration-300"
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 3: Collections */}
            <div ref={setColumnRef(2)} className="space-y-5">
              <h2 className="eyebrow text-bronze">Collections</h2>
              <nav aria-label="Footer collections">
                <ul className="space-y-3">
                  {collections.map((collection) => (
                    <li key={collection.id}>
                      <a
                        href="#contact"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToEnquiry(collection.enquiryCategory);
                        }}
                        className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-pure-white transition group"
                      >
                        <span
                          className="w-0 group-hover:w-3 h-px bg-bronze transition-all duration-300"
                          aria-hidden="true"
                        />
                        <span>{collection.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 4: Contact */}
            <div ref={setColumnRef(3)} className="space-y-5">
              <h2 className="eyebrow text-bronze">Contact</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin
                    className="w-4 h-4 text-bronze shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <address className="not-italic text-warm-gray leading-relaxed">
                      <span className="block">{company.contact.address.line1}</span>
                      <span className="block">{company.contact.address.line2}</span>
                      <span className="block">{company.contact.address.line3}</span>
                    </address>
                    <a
                      href={company.contact.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent(events.SHOWROOM_DIRECTIONS, { source: 'footer' })
                      }
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-gray hover:text-pure-white transition"
                    >
                      <span>View on Maps</span>
                      <ExternalLink className="w-3 h-3 text-bronze" aria-hidden="true" />
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Phone
                    className="w-4 h-4 text-bronze shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:+${company.contact.phoneClean}`}
                    onClick={() =>
                      trackEvent(events.PHONE_CLICK, { source: 'footer' })
                    }
                    className="text-warm-gray hover:text-pure-white transition"
                  >
                    {company.contact.phone}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail
                    className="w-4 h-4 text-bronze shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${company.contact.email}`}
                    className="text-warm-gray hover:text-pure-white transition break-all"
                  >
                    {company.contact.email}
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <Clock
                    className="w-4 h-4 text-bronze shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="text-warm-gray space-y-0.5 leading-relaxed">
                    <p>{company.contact.hours.weekdays}</p>
                    <p>{company.contact.hours.weekend}</p>
                  </div>
                </li>

                <li className="pt-1">
                  <a
                    href={company.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent(events.WHATSAPP_CLICK, { source: 'footer' })
                    }
                    className="inline-flex items-center gap-2 text-warm-gray hover:text-pure-white transition group"
                  >
                    <MessageCircle
                      className="w-4 h-4 text-bronze group-hover:text-brand-red transition-colors"
                      aria-hidden="true"
                    />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink
                      className="w-3 h-3 opacity-70"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pure-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-warm-gray">
            <p className="text-center md:text-left">
              &copy; {currentYear} {company.name}. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => setActiveLegal('privacy')}
                className="text-warm-gray hover:text-pure-white transition cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-pure-white/20" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                onClick={() => setActiveLegal('terms')}
                className="text-warm-gray hover:text-pure-white transition cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
            </div>

            <p className="text-center md:text-right">
              An extension of{' '}
              <span className="text-pure-white/90 font-medium">
                {company.parent}
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Information Modal */}
      <AnimatePresence>
        {activePolicy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveLegal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-legal-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg bg-dark-surface text-pure-white border border-pure-white/15 p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-pure-white/10">
                <div>
                  <span className="eyebrow text-bronze block mb-1">
                    {company.name} &bull; {activePolicy.updated}
                  </span>
                  <h3
                    id="footer-legal-title"
                    className="heading-md text-2xl text-pure-white"
                  >
                    {activePolicy.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLegal(null)}
                  aria-label="Close dialog"
                  className="p-2 text-warm-gray hover:text-pure-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {activePolicy.sections.map((section) => (
                  <div key={section.heading} className="space-y-1.5">
                    <h4 className="text-sm font-medium text-pure-white tracking-wide">
                      {section.heading}
                    </h4>
                    <p className="body-text text-xs md:text-sm text-warm-gray leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Footer;
