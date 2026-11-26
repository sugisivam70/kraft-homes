import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MoveHorizontal } from 'lucide-react';
import { hardwareMechanisms } from '../data/hardware';
import { navigateToEnquiry } from '../utils/whatsapp';
import { events, trackEvent } from '../config/tracking';

gsap.registerPlugin(ScrollTrigger);

// Precision Architectural Elevation Diagram showing Closed vs Open hardware motion states
function MechanismDiagram({ id, isOpen }) {
  const strokeMain = isOpen ? '#D71920' : '#B39A7D';
  const frameStroke = '#141414';

  switch (id) {
    case 'soft-close-drawers':
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          <rect x="24" y="16" width="128" height="98" fill="none" stroke={frameStroke} strokeWidth="1.4" />
          {/* Top Drawer */}
          <motion.g animate={{ x: isOpen ? 36 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <rect x="30" y="22" width="116" height="24" fill="#F7F5F0" stroke={strokeMain} strokeWidth="1.4" />
            <line x1="36" y1="34" x2="140" y2="34" stroke={strokeMain} strokeWidth="0.7" strokeDasharray="3 2" />
          </motion.g>
          {/* Middle Drawer */}
          <motion.g animate={{ x: isOpen ? 52 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <rect x="30" y="51" width="116" height="26" fill="#FFFFFF" stroke={strokeMain} strokeWidth="1.6" />
            <line x1="36" y1="64" x2="140" y2="64" stroke="#141414" strokeWidth="0.7" opacity="0.3" />
          </motion.g>
          {/* Bottom Drawer */}
          <rect x="30" y="82" width="116" height="26" fill="#F7F5F0" stroke={frameStroke} strokeWidth="1.2" opacity="0.65" />
          <text x="174" y="122" fontSize="8" fill="#9A9A9A" fontFamily="sans-serif">
            {isOpen ? 'OPEN' : 'CLOSED'}
          </text>
        </svg>
      );

    case 'pull-out-pantry':
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          <rect x="32" y="12" width="76" height="106" fill="#FFFFFF" stroke={frameStroke} strokeWidth="1.4" />
          {[22, 42, 62, 82].map((y, idx) => (
            <motion.g
              key={y}
              animate={{ x: isOpen ? 56 - idx * 4 : 0 }}
              transition={{ duration: 0.45 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <rect x="38" y={y} width="64" height="14" fill="#F7F5F0" stroke={strokeMain} strokeWidth="1.3" />
              <line x1="46" y1={y + 7} x2="94" y2={y + 7} stroke={frameStroke} strokeWidth="0.6" opacity="0.35" />
            </motion.g>
          ))}
          <motion.line
            x1="108"
            y1="12"
            x2="108"
            y2="118"
            stroke={strokeMain}
            strokeWidth="2"
            animate={{ x: isOpen ? 56 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      );

    case 'corner-storage':
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          <path d="M28 20 H150 V110 H92 V72 H28 Z" fill="#F7F5F0" stroke={frameStroke} strokeWidth="1.4" />
          <motion.path
            d="M42 36 C68 28, 102 36, 98 58 C94 76, 62 72, 42 54 Z"
            fill="#FFFFFF"
            stroke={strokeMain}
            strokeWidth="1.5"
            animate={{ x: isOpen ? 68 : 0, y: isOpen ? 18 : 0, rotate: isOpen ? -14 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M42 50 C70 46, 98 56, 92 78 C86 96, 54 88, 42 68 Z"
            fill="#FFFFFF"
            stroke={frameStroke}
            strokeWidth="1.1"
            opacity="0.7"
            animate={{ x: isOpen ? 46 : 0, y: isOpen ? 24 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      );

    case 'lift-up-doors':
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          <rect x="44" y="42" width="132" height="68" fill="#F7F5F0" stroke={frameStroke} strokeWidth="1.4" />
          <line x1="44" y1="76" x2="176" y2="76" stroke={frameStroke} strokeWidth="0.8" opacity="0.35" />
          <motion.g
            animate={{ y: isOpen ? -32 : 0, scaleY: isOpen ? 0.85 : 1 }}
            style={{ originX: '110px', originY: '42px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <rect x="44" y="42" width="132" height="68" fill="#FFFFFF" fillOpacity="0.92" stroke={strokeMain} strokeWidth="1.6" />
          </motion.g>
          <path d="M58 46 L68 58 M162 46 L152 58" stroke={strokeMain} strokeWidth="1.2" opacity={isOpen ? 1 : 0.2} />
        </svg>
      );

    case 'pocket-doors':
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          <rect x="34" y="18" width="152" height="94" fill="#141414" fillOpacity="0.06" stroke={frameStroke} strokeWidth="1.4" />
          {/* Inner Illuminated Niche */}
          <rect x="52" y="34" width="116" height="66" fill="#F7F5F0" stroke="#B39A7D" strokeWidth="1" />
          <line x1="60" y1="68" x2="160" y2="68" stroke="#B39A7D" strokeWidth="1.2" />
          {/* Left & Right Retractable Doors */}
          <motion.rect
            x="38"
            y="20"
            width="70"
            height="90"
            fill="#FFFFFF"
            stroke={strokeMain}
            strokeWidth="1.5"
            animate={{ width: isOpen ? 12 : 70 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.rect
            x="112"
            y="20"
            width="70"
            height="90"
            fill="#FFFFFF"
            stroke={strokeMain}
            strokeWidth="1.5"
            animate={{ x: isOpen ? 170 : 112, width: isOpen ? 12 : 70 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      );

    case 'pivot-doors':
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          {/* Architectural Threshold */}
          <line x1="25" y1="65" x2="72" y2="65" stroke={frameStroke} strokeWidth="2.5" />
          <line x1="148" y1="65" x2="195" y2="65" stroke={frameStroke} strokeWidth="2.5" />
          {/* Pivot Swing Arc */}
          <path d="M148 65 A76 76 0 0 0 112 22" fill="none" stroke="#B39A7D" strokeWidth="0.9" strokeDasharray="3 3" />
          {/* Door Leaf pivoting on concealed off-center axis */}
          <motion.g
            animate={{ rotate: isOpen ? -38 : 0 }}
            style={{ originX: '88px', originY: '65px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <rect x="72" y="61" width="76" height="8" fill="#FFFFFF" stroke={strokeMain} strokeWidth="1.6" />
            <circle cx="88" cy="65" r="3" fill="#D71920" />
          </motion.g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 220 130" className="w-full h-36" aria-hidden="true">
          <rect x="34" y="20" width="152" height="90" fill="#F7F5F0" stroke={frameStroke} strokeWidth="1.4" />
          <motion.rect
            x="44"
            y="30"
            width="132"
            height="70"
            fill="#FFFFFF"
            stroke={strokeMain}
            strokeWidth="1.4"
            animate={{ scale: isOpen ? 0.94 : 1, x: isOpen ? 10 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <line x1="44" y1="54" x2="176" y2="54" stroke="#B39A7D" strokeWidth="0.9" />
          <line x1="110" y1="30" x2="110" y2="100" stroke="#B39A7D" strokeWidth="0.9" />
        </svg>
      );
  }
}

export default function HardwareShowcase() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [openStates, setOpenStates] = useState({ 'pull-out-pantry': true });

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 36,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const setItemState = (id, open) => {
    setOpenStates((prev) => ({ ...prev, [id]: open }));
  };

  const toggleItemState = (id) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="hardware"
      ref={sectionRef}
      aria-labelledby="hardware-heading"
      className="relative bg-pure-white text-carbon py-24 md:py-32 border-t border-light-gray overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 md:mb-18"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-8 h-px bg-brand-red" aria-hidden="true" />
              <span className="eyebrow text-bronze">Functional Engineering</span>
            </div>
            <h2
              id="hardware-heading"
              className="font-heading text-4xl md:text-6xl font-light tracking-tight leading-[1.08] text-carbon"
            >
              Intelligence Inside Every Cabinet.
            </h2>
          </div>

          <p className="body-text text-carbon/70 text-sm md:text-base max-w-md">
            Hover or tap any mechanism to inspect how European soft-close drawers, tall
            pull-out pantries, pocket doors, and pivot systems move from closed restraint to
            effortless access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hardwareMechanisms.map((item) => {
            const isOpen = Boolean(openStates[item.id]);

            return (
              <article
                key={item.id}
                onMouseEnter={() => setItemState(item.id, true)}
                onMouseLeave={() => setItemState(item.id, false)}
                className="group relative flex flex-col justify-between border border-light-gray bg-ivory/40 hover:bg-pure-white hover:border-bronze transition-all duration-400 p-6 sm:p-7"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-body text-[11px] font-semibold tracking-[0.2em] text-bronze">
                      {item.number} &mdash; {item.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleItemState(item.id)}
                      aria-pressed={isOpen}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-body font-semibold uppercase tracking-[0.16em] border transition-colors cursor-pointer ${
                        isOpen
                          ? 'bg-brand-red border-brand-red text-pure-white'
                          : 'bg-pure-white border-carbon/20 text-carbon hover:border-brand-red'
                      }`}
                    >
                      <MoveHorizontal className="w-3 h-3" aria-hidden="true" />
                      <span>{isOpen ? 'Open State' : 'Closed State'}</span>
                    </button>
                  </div>

                  {/* Interactive Architectural Elevation Stage */}
                  <button
                    type="button"
                    onClick={() => toggleItemState(item.id)}
                    aria-label={`Toggle ${item.title} open and closed view`}
                    className="w-full bg-pure-white border border-light-gray/80 p-3 mb-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                  >
                    <MechanismDiagram id={item.id} isOpen={isOpen} />
                  </button>

                  <h3 className="font-heading text-2xl sm:text-3xl font-normal text-carbon mb-2">
                    {item.title}
                  </h3>

                  <p className="body-text text-xs sm:text-sm text-carbon/75 leading-relaxed mb-3">
                    {item.summary}
                  </p>

                  <p className="font-body text-xs text-carbon/90 border-l-2 border-bronze pl-3 py-0.5 mb-5">
                    {isOpen ? item.openNote : item.closedNote}
                  </p>
                </div>

                {/* Footer: Brand Tags & Enquiry */}
                <div className="pt-4 border-t border-light-gray flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.brands.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 text-[10px] font-body uppercase tracking-wider bg-pure-white border border-light-gray text-carbon/70"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent(events.PRODUCT_SELECT, {
                        product_category: item.enquiryCategory,
                        mechanism: item.title,
                        source: 'hardware_showcase',
                      });
                      navigateToEnquiry(
                        item.enquiryCategory,
                        `Interested in ${item.title} (${item.brands.join(', ')}).`
                      );
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-carbon hover:text-brand-red transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Enquire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
