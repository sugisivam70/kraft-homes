import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, Check, ArrowUpRight, Info } from 'lucide-react';
import { materials, materialExplorerBaseImage } from '../data/materials';
import { animateFadeInUp, animateLine } from '../animations/gsapAnimations';
import { navigateToEnquiry } from '../utils/whatsapp';
import { events, trackEvent } from '../config/tracking';

const CATEGORY_SURFACE_MAP = {
  Wood: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 9px)',
  Lacquer: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.12) 100%)',
  Quartz: 'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.45) 0%, transparent 55%), linear-gradient(125deg, rgba(180,175,168,0.25) 0%, transparent 45%, rgba(160,155,148,0.2) 100%)',
  Metal: 'linear-gradient(110deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.28) 65%, rgba(0,0,0,0.15) 100%)',
};

function MaterialExplorer() {
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [kitchenImgError, setKitchenImgError] = useState(false);
  const [swatchImgError, setSwatchImgError] = useState({});

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const dividerRef = useRef(null);
  const visualRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        animateFadeInUp(headerRef.current.children, headerRef.current, {
          y: 32,
          stagger: 0.12,
          duration: 0.9,
        });
      }

      if (dividerRef.current) {
        animateLine(dividerRef.current, dividerRef.current, {
          duration: 1,
          origin: 'left center',
        });
      }

      if (visualRef.current) {
        animateFadeInUp(visualRef.current, visualRef.current, {
          y: 40,
          duration: 0.9,
        });
      }

      if (controlsRef.current) {
        animateFadeInUp(controlsRef.current, controlsRef.current, {
          y: 40,
          duration: 0.9,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isLightColor = (hex) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.72;
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
  };

  const handleConsultationClick = () => {
    trackEvent(events.PRODUCT_SELECT, {
      product_category: 'Modular Kitchen',
      material_finish: selectedMaterial.name,
      source: 'material_explorer',
    });
    navigateToEnquiry(
      selectedMaterial.category === 'Quartz' ? 'Quartz Countertops' : 'Modular Kitchen',
      `Interested in exploring "${selectedMaterial.name}" (${selectedMaterial.category}) surface finish.`
    );
  };

  const activeSurfaceGradient =
    CATEGORY_SURFACE_MAP[selectedMaterial.category] || CATEGORY_SURFACE_MAP.Lacquer;

  return (
    <section
      id="materials"
      ref={sectionRef}
      aria-labelledby="materials-heading"
      className="relative bg-ivory text-carbon py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-1/2 h-full opacity-40"
        style={{
          background:
            'radial-gradient(circle at 85% 20%, rgba(179, 154, 125, 0.14), transparent 60%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <header ref={headerRef} className="max-w-3xl mb-12 md:mb-16">
          <p className="eyebrow text-bronze mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-bronze" aria-hidden="true" />
            Architectural Surfaces
          </p>

          <h2
            id="materials-heading"
            className="font-heading heading-lg text-4xl sm:text-5xl md:text-6xl text-carbon mb-5"
          >
            Materials &amp; Finishes
          </h2>

          <p className="body-text text-carbon/75 text-base md:text-lg max-w-2xl">
            Explore the textures and tones that define bespoke European cabinetry—from tactile
            timber veneers to architectural matte lacquers and veined stone surfaces.
          </p>
        </header>

        <div
          ref={dividerRef}
          className="w-full h-px bg-light-gray mb-12 md:mb-16"
          aria-hidden="true"
        />

        {/* Two-Column Interactive Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: Large Kitchen Visualization with Live Material Mood Shift */}
          <div ref={visualRef} className="lg:col-span-7">
            <div className="relative rounded-sm overflow-hidden bg-carbon shadow-2xl aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] border border-carbon/10">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #2B2622 0%, #141414 50%, #3A322A 100%)',
                }}
              />

              {/* Dedicated Material Explorer Base Kitchen */}
              {!kitchenImgError && (
                <img
                  src={materialExplorerBaseImage}
                  alt={`Minimalist European kitchen previewed in ${selectedMaterial.name} palette`}
                  onError={() => setKitchenImgError(true)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
                />
              )}

              {/* Dual blend layers tuned to neutral alabaster kitchen so dark & warm finishes shift realistically */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                animate={{
                  backgroundColor: selectedMaterial.tintColor || selectedMaterial.color,
                  opacity: selectedMaterial.tintOpacity ?? 0.4,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                animate={{
                  backgroundColor: selectedMaterial.tintColor || selectedMaterial.color,
                  opacity: 0.35,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-carbon/20 pointer-events-none"
              />

              {/* Top Preview Indicator */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-4">
                <div className="bg-carbon/65 backdrop-blur-md px-4 py-2 border border-pure-white/15 inline-flex items-center gap-2.5 text-pure-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-pure-white/50 shrink-0"
                    style={{ backgroundColor: selectedMaterial.color }}
                  />
                  <span className="eyebrow text-[11px] tracking-[0.18em] text-pure-white/95">
                    Material Inspiration Preview
                  </span>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-carbon/65 backdrop-blur-md border border-pure-white/15 text-xs text-ivory/90 font-body">
                  <Sparkles className="w-3.5 h-3.5 text-bronze" aria-hidden="true" />
                  {selectedMaterial.category}
                </span>
              </div>

              {/* Bottom Overlay: Tactile Texture Sample Tile + Active Title */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMaterial.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-4 bg-carbon/80 backdrop-blur-xl border border-pure-white/20 p-3.5 sm:p-4 max-w-md shadow-2xl"
                  >
                    <div
                      className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden shrink-0 border border-pure-white/25 shadow-inner"
                      style={{
                        backgroundColor: selectedMaterial.color,
                        backgroundImage: activeSurfaceGradient,
                      }}
                    >
                      {!swatchImgError[selectedMaterial.id] && (
                        <img
                          src={selectedMaterial.image}
                          alt={`${selectedMaterial.name} surface texture close-up`}
                          onError={() =>
                            setSwatchImgError((prev) => ({
                              ...prev,
                              [selectedMaterial.id]: true,
                            }))
                          }
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="eyebrow text-[10px] text-bronze mb-1">
                        {selectedMaterial.category}
                      </p>
                      <h3 className="font-heading text-xl sm:text-2xl text-pure-white leading-tight truncate">
                        {selectedMaterial.name}
                      </h3>
                      <p className="text-xs text-pure-white/70 font-body mt-0.5">
                        Finish Reference &bull; {selectedMaterial.color}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: Material Swatch Grid & Selected Details */}
          <div ref={controlsRef} className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="eyebrow text-carbon/70">Select a Surface Finish</h3>
                <span className="text-xs font-body text-warm-gray">
                  {materials.length} Curated Finishes
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Kitchen material and finish swatches"
                className="grid grid-cols-4 gap-y-6 gap-x-4 sm:gap-6"
              >
                {materials.map((material) => {
                  const isSelected = selectedMaterial.id === material.id;
                  const lightSwatch = isLightColor(material.color);
                  const surfaceTexture =
                    CATEGORY_SURFACE_MAP[material.category] || CATEGORY_SURFACE_MAP.Lacquer;

                  return (
                    <div key={material.id} className="flex flex-col items-center text-center">
                      <motion.button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${material.name} (${material.category})`}
                        onClick={() => handleMaterialSelect(material)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative w-16 h-16 rounded-full overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                          isSelected
                            ? 'ring-2 ring-brand-red ring-offset-2 ring-offset-ivory shadow-lg'
                            : 'ring-1 ring-carbon/20 hover:ring-bronze hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: material.color,
                          backgroundImage: surfaceTexture,
                        }}
                      >
                        {!swatchImgError[material.id] && (
                          <img
                            src={material.image}
                            alt=""
                            aria-hidden="true"
                            onError={() =>
                              setSwatchImgError((prev) => ({
                                ...prev,
                                [material.id]: true,
                              }))
                            }
                            className="w-full h-full object-cover"
                          />
                        )}

                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            className={`absolute inset-0 flex items-center justify-center rounded-full bg-carbon/15 ${
                              lightSwatch ? 'text-carbon' : 'text-pure-white'
                            }`}
                          >
                            <Check className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
                          </motion.span>
                        )}
                      </motion.button>

                      <span
                        className={`mt-2.5 text-xs font-body leading-snug transition-colors duration-200 ${
                          isSelected ? 'text-carbon font-semibold' : 'text-carbon/70 font-normal'
                        }`}
                      >
                        {material.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Material Details Panel */}
            <div className="bg-pure-white border border-light-gray p-6 sm:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMaterial.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="inline-block eyebrow text-brand-red mb-2">
                        {selectedMaterial.category}
                      </span>
                      <h3 className="font-heading heading-md text-3xl text-carbon">
                        {selectedMaterial.name}
                      </h3>
                    </div>

                    <div
                      aria-hidden="true"
                      className="w-12 h-12 rounded-full overflow-hidden border border-carbon/15 shrink-0 shadow-inner"
                      style={{
                        backgroundColor: selectedMaterial.color,
                        backgroundImage: activeSurfaceGradient,
                      }}
                    >
                      {!swatchImgError[selectedMaterial.id] && (
                        <img
                          src={selectedMaterial.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <p className="body-text text-carbon/80 text-sm sm:text-base mb-6">
                    {selectedMaterial.description}
                  </p>

                  <div className="pt-5 border-t border-light-gray flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs font-body text-warm-gray">
                      Showroom Samples:{' '}
                      <span className="text-carbon font-medium">
                        Available for Consultation
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleConsultationClick}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-carbon text-pure-white text-xs eyebrow tracking-[0.15em] hover:bg-brand-red transition-colors duration-300 cursor-pointer"
                    >
                      Enquire About Finish
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="flex items-start gap-2.5 text-xs font-body text-warm-gray leading-relaxed">
              <Info className="w-4 h-4 text-bronze shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Presented as design inspiration. Exact material finishes and slab stocks
                are confirmed during showroom consultation.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MaterialExplorer;
