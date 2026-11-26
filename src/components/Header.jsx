import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, ArrowUpRight } from 'lucide-react';
import { company, navigation } from '../data/company';
import { useActiveSection } from '../hooks/useActiveSection';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { WHATSAPP_CHAT_URL } from '../utils/whatsapp';
import { events, trackEvent } from '../config/tracking';

const mobileMenuVariants = {
  hidden: {
    x: '100%',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const mobileNavItemVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: 16,
    transition: { duration: 0.2 },
  },
};

function Header({ revealReady = true }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const sectionIds = useMemo(() => navigation.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);
  const magneticCta = useMagneticButton(0.2);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback((e, targetId) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const whatsappHref = WHATSAPP_CHAT_URL || company.contact.whatsapp;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          revealReady ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        } ${
          isScrolled
            ? 'bg-carbon/95 backdrop-blur-md border-b border-pure-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)]'
            : 'bg-gradient-to-b from-carbon/85 via-carbon/45 to-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 lg:h-24 flex items-center justify-between gap-4 lg:gap-6">
          {/* Left: High-Visibility Brand Logo Plaque */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className={`relative z-10 flex items-center shrink-0 group focus:outline-none transition-all duration-300 ${
              isScrolled
                ? 'py-1.5'
                : 'bg-carbon/55 backdrop-blur-md border border-pure-white/15 px-3 sm:px-4 py-2 shadow-lg'
            }`}
            aria-label={`${company.name} — ${company.tagline}`}
          >
            {!logoError ? (
              <img
                src={company.logos.headerLight}
                alt={`${company.name} — ${company.tagline}`}
                onError={() => setLogoError(true)}
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl lg:text-2xl tracking-[0.14em] uppercase text-pure-white font-medium">
                  Kraft <span className="text-brand-red">H</span>omes
                </span>
                <span className="font-body text-[9px] tracking-[0.22em] uppercase text-bronze mt-1">
                  Salem
                </span>
              </div>
            )}
          </a>

          {/* Center: Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center"
          >
            <ul className="flex items-center gap-6 xl:gap-8">
              {navigation.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative py-2 font-body text-[11px] xl:text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                        isActive
                          ? 'text-pure-white'
                          : 'text-pure-white/80 hover:text-pure-white'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="header-active-underline"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-bronze"
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Desktop CTAs & Mobile Trigger */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent(events.WHATSAPP_CLICK, { source: 'header_icon' })
              }
              aria-label="Chat with Kraft Homes on WhatsApp"
              title="WhatsApp Concierge"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-pure-white/25 bg-carbon/35 text-pure-white/95 hover:text-pure-white hover:border-bronze hover:bg-bronze/20 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
            </a>

            <button
              type="button"
              ref={magneticCta.ref}
              onMouseMove={magneticCta.onMouseMove}
              onMouseLeave={magneticCta.onMouseLeave}
              onClick={(e) => {
                trackEvent(events.CONSULTATION_CLICK, { source: 'header_cta' });
                scrollToSection(e, 'contact');
              }}
              className="hidden md:inline-flex items-center gap-2 bg-brand-red text-pure-white px-5 lg:px-6 py-2.5 text-[11px] font-body font-medium uppercase tracking-[0.18em] hover:bg-brand-red/90 transition-colors duration-300 cursor-pointer magnetic-btn shadow-md"
            >
              <span>Book a Consultation</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 bg-carbon/55 backdrop-blur-md border border-pure-white/15 text-pure-white hover:text-bronze transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-carbon text-pure-white flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            {/* Top bar inside mobile overlay */}
            <div className="px-5 sm:px-8 h-20 flex items-center justify-between border-b border-pure-white/10 shrink-0">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, 'home')}
                className="flex items-center"
                aria-label={`${company.name} - Home`}
              >
                {!logoError ? (
                  <img
                    src={company.logos.headerLight}
                    alt={company.name}
                    className="h-9 w-auto object-contain"
                  />
                ) : (
                  <span className="font-heading text-xl tracking-[0.14em] uppercase text-pure-white">
                    {company.name}
                  </span>
                )}
              </a>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center w-10 h-10 text-pure-white hover:text-bronze transition-colors duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Staggered Mobile Links */}
            <nav aria-label="Mobile Primary Navigation" className="px-6 sm:px-10 py-8 my-auto">
              <p className="eyebrow text-bronze mb-6">Navigation</p>
              <ul className="flex flex-col divide-y divide-pure-white/10">
                {navigation.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.li key={item.id} variants={mobileNavItemVariants}>
                      <a
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className="group flex items-center justify-between py-4"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-body text-xs tracking-[0.2em] text-warm-gray group-hover:text-bronze transition-colors">
                            0{index + 1}
                          </span>
                          <span
                            className={`font-heading text-3xl sm:text-4xl font-light tracking-wide transition-colors duration-300 ${
                              isActive
                                ? 'text-bronze'
                                : 'text-pure-white group-hover:text-bronze'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>

                        <span
                          className={`h-[1.5px] transition-all duration-300 ${
                            isActive
                              ? 'w-8 bg-bronze'
                              : 'w-0 bg-bronze group-hover:w-6'
                          }`}
                        />
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Mobile Actions & Showroom Info */}
            <motion.div
              variants={mobileNavItemVariants}
              className="px-6 sm:px-10 pb-8 pt-6 border-t border-pure-white/10 space-y-5 shrink-0"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    trackEvent(events.CONSULTATION_CLICK, { source: 'mobile_drawer' });
                    scrollToSection(e, 'contact');
                  }}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-brand-red text-pure-white px-6 py-3.5 text-xs font-body font-medium uppercase tracking-[0.18em] hover:bg-brand-red/90 transition-colors cursor-pointer"
                >
                  <span>Book a Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(events.WHATSAPP_CLICK, { source: 'mobile_drawer' })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-pure-white/25 text-pure-white px-6 py-3.5 text-xs font-body font-medium uppercase tracking-[0.18em] hover:border-bronze hover:text-bronze transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-body text-warm-gray">
                <span>{company.tagline}</span>
                <span className="text-pure-white/70">{company.location}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
