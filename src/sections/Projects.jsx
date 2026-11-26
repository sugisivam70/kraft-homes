import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Image as ImageIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { projects, projectCategories } from '../data/projects';
import { navigateToEnquiry } from '../utils/whatsapp';
import { events, trackEvent } from '../config/tracking';

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_GRADIENTS = [
  'radial-gradient(circle at 22% 24%, rgba(179, 154, 125, 0.28) 0%, transparent 55%), radial-gradient(circle at 82% 78%, rgba(215, 25, 32, 0.16) 0%, transparent 50%), linear-gradient(135deg, #1E1C1A 0%, #141414 52%, #241F1B 100%)',
  'radial-gradient(circle at 78% 25%, rgba(179, 154, 125, 0.24) 0%, transparent 55%), radial-gradient(circle at 18% 82%, rgba(215, 25, 32, 0.12) 0%, transparent 45%), linear-gradient(145deg, #181818 0%, #121212 50%, #221D18 100%)',
  'radial-gradient(circle at 50% 20%, rgba(179, 154, 125, 0.22) 0%, transparent 60%), linear-gradient(160deg, #1D1B18 0%, #141414 60%, #1B1917 100%)',
];

function ArchitecturalFallback({ index = 0, category, isFeatured = false }) {
  const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ background: gradient }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #B39A7D 1px, transparent 1px), linear-gradient(to bottom, #B39A7D 1px, transparent 1px)',
          backgroundSize: isFeatured ? '56px 56px' : '40px 40px',
        }}
      />

      <div className="absolute inset-6 md:inset-10 border border-bronze/15 pointer-events-none flex flex-col justify-between p-4 md:p-6">
        <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-bronze/55 font-body">
          <span>Kraft Homes · Client Archive</span>
          <span>{category}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 opacity-35">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-bronze/45 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 md:w-7 md:h-7 text-bronze" strokeWidth={1} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/60">
            Actual Project Photos Coming Soon
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-warm-gray/45 font-body">
          <span>Salem, Tamil Nadu</span>
          <span>Portfolio Slot</span>
        </div>
      </div>
    </div>
  );
}

function ProjectImage({ src, alt, index, category, isFeatured, className = '' }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-dark-surface ${className}`}>
      <ArchitecturalFallback index={index} category={category} isFeatured={isFeatured} />
      {src && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`relative z-10 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

function BeforeAfterComparison({ beforeSrc, afterSrc, projectName }) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <img
        src={afterSrc}
        alt={`${projectName} completed view`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={`${projectName} before transformation`}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="absolute inset-y-0 w-0.5 bg-pure-white shadow-lg pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-carbon border border-pure-white flex items-center justify-center text-pure-white shadow-xl">
          <SlidersHorizontal className="w-4 h-4" />
        </span>
      </div>
      <input
        type="range"
        min={5}
        max={95}
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        aria-label="Slide to compare before and after transformation"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
      <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-carbon/80 text-[10px] uppercase tracking-widest text-pure-white">
        Before
      </span>
      <span className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-brand-red/90 text-[10px] uppercase tracking-widest text-pure-white">
        After
      </span>
    </div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const selectedProjectIndex = filteredProjects.findIndex(
    (project) => project.id === selectedProjectId
  );
  const activeProject =
    selectedProjectIndex >= 0 ? filteredProjects[selectedProjectIndex] : null;

  const projectImages = activeProject?.images?.length
    ? activeProject.images
    : activeProject?.cover
      ? [activeProject.cover]
      : [];

  const hasBeforeAfter =
    Boolean(activeProject?.beforeImage) && Boolean(activeProject?.afterImage);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.querySelectorAll('.projects-header-reveal'), {
          y: 44,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (filterRef.current) {
        gsap.from(filterRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: filterRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.project-card-reveal');
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 56,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openLightbox = useCallback((project) => {
    setSelectedProjectId(project.id);
    setActiveImageIndex(0);
    setSlideDirection(1);
    setShowBeforeAfter(false);
    trackEvent(events.PROJECT_VIEW, {
      project_id: project.id,
      project_category: project.category,
      is_placeholder: Boolean(project.isPlaceholder),
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedProjectId(null);
    setActiveImageIndex(0);
    setShowBeforeAfter(false);
  }, []);

  const handleNextProject = useCallback(() => {
    if (filteredProjects.length <= 1 || selectedProjectIndex < 0) return;
    setSlideDirection(1);
    const nextIdx = (selectedProjectIndex + 1) % filteredProjects.length;
    setSelectedProjectId(filteredProjects[nextIdx].id);
    setActiveImageIndex(0);
    setShowBeforeAfter(false);
  }, [filteredProjects, selectedProjectIndex]);

  const handlePrevProject = useCallback(() => {
    if (filteredProjects.length <= 1 || selectedProjectIndex < 0) return;
    setSlideDirection(-1);
    const prevIdx =
      (selectedProjectIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProjectId(filteredProjects[prevIdx].id);
    setActiveImageIndex(0);
    setShowBeforeAfter(false);
  }, [filteredProjects, selectedProjectIndex]);

  const handleNextSlide = useCallback(() => {
    if (!activeProject) return;
    if (projectImages.length > 1) {
      setSlideDirection(1);
      setActiveImageIndex((prev) => (prev + 1) % projectImages.length);
    } else if (filteredProjects.length > 1) {
      handleNextProject();
    }
  }, [activeProject, projectImages.length, filteredProjects.length, handleNextProject]);

  const handlePrevSlide = useCallback(() => {
    if (!activeProject) return;
    if (projectImages.length > 1) {
      setSlideDirection(-1);
      setActiveImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    } else if (filteredProjects.length > 1) {
      handlePrevProject();
    }
  }, [activeProject, projectImages.length, filteredProjects.length, handlePrevProject]);

  useEffect(() => {
    if (!activeProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeProject, closeLightbox, handleNextSlide, handlePrevSlide]);

  const handleTouchStart = (e) => {
    if (!e.touches?.length) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || !e.changedTouches?.length) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current ?? 0);

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleEnquireClick = () => {
    const category = activeProject?.category || 'Modular Kitchen';
    const name = activeProject?.name || 'Completed Project';
    closeLightbox();
    navigateToEnquiry(category, `Planning a similar space to ${name}.`);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-carbon text-pure-white py-24 md:py-32 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[520px] h-[520px] rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #B39A7D 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-12 border-b border-pure-white/10"
        >
          <div className="max-w-2xl">
            <div className="projects-header-reveal flex items-center gap-3 mb-5">
              <span className="inline-block w-8 h-[1px] bg-brand-red" />
              <span className="eyebrow text-bronze">Completed Portfolio</span>
            </div>
            <h2 className="projects-header-reveal font-heading text-4xl md:text-6xl font-light tracking-tight leading-[1.08] text-pure-white">
              Spaces We Have Brought to Life.
            </h2>
          </div>

          <p className="projects-header-reveal body-text text-sm md:text-base text-warm-gray max-w-md">
            Actual residential project photographs and project documentation supplied by
            Kraft Homes are published directly in this portfolio.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          ref={filterRef}
          className="mt-10 mb-12 flex flex-wrap items-center justify-between gap-4"
        >
          <div
            role="tablist"
            aria-label="Filter completed projects by category"
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >
            {projectCategories.map((category) => {
              const isActive = activeCategory === category;
              const count =
                category === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 py-2.5 text-xs sm:text-sm font-body tracking-wide transition-colors duration-300 border cursor-pointer ${
                    isActive
                      ? 'text-pure-white border-bronze bg-dark-surface'
                      : 'text-warm-gray border-pure-white/10 hover:text-pure-white hover:border-pure-white/25 bg-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeProjectFilterAccent"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{category}</span>
                    <span
                      className={`text-[11px] font-mono ${
                        isActive ? 'text-bronze' : 'text-warm-gray/60'
                      }`}
                    >
                      {String(count).padStart(2, '0')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-body tracking-widest uppercase text-warm-gray/80">
            Showing {filteredProjects.length}{' '}
            {filteredProjects.length === 1 ? 'Project' : 'Projects'}
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div ref={gridRef}>
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start"
              >
                {filteredProjects.map((project, index) => {
                  const isFeatured = index === 0;
                  const isStaggeredOffset = !isFeatured && index % 2 === 0;

                  return (
                    <motion.article
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      onClick={() => openLightbox(project)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightbox(project);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View project: ${project.name}`}
                      className={`project-card-reveal group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze bg-dark-surface border border-pure-white/10 hover:border-bronze/50 transition-colors duration-500 overflow-hidden ${
                        isFeatured
                          ? 'md:col-span-12'
                          : `md:col-span-6 ${isStaggeredOffset ? 'md:mt-12' : ''}`
                      }`}
                    >
                      <div
                        className={`relative w-full overflow-hidden ${
                          isFeatured
                            ? 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[21/9]'
                            : index % 2 === 1
                              ? 'aspect-[4/4] sm:aspect-[4/3]'
                              : 'aspect-[4/5] sm:aspect-[4/4]'
                        }`}
                      >
                        <ProjectImage
                          src={project.cover}
                          alt={project.name}
                          index={index}
                          category={project.category}
                          isFeatured={isFeatured}
                        />

                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-carbon via-carbon/45 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                        <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-30 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-body uppercase tracking-[0.16em] bg-carbon/80 backdrop-blur-md text-bronze border border-bronze/30">
                              <Layers className="w-3 h-3" />
                              {project.category}
                            </span>

                            {isFeatured && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-body uppercase tracking-[0.16em] bg-brand-red/90 text-pure-white">
                                <Sparkles className="w-3 h-3" />
                                Featured Space
                              </span>
                            )}
                          </div>

                          {project.isPlaceholder && (
                            <span className="inline-flex items-center px-3 py-1 text-[10px] font-body uppercase tracking-[0.18em] bg-carbon/90 backdrop-blur-md text-pure-white/90 border border-pure-white/25">
                              Development Placeholder
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 z-30 p-5 sm:p-7 lg:p-9 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                          <div className={isFeatured ? 'max-w-2xl' : 'max-w-md'}>
                            <div className="flex items-center gap-2 text-xs font-body text-bronze mb-2.5 tracking-wide">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span>{project.location}</span>
                            </div>

                            <h3
                              className={`font-heading font-normal text-pure-white leading-tight group-hover:text-ivory transition-colors ${
                                isFeatured ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
                              }`}
                            >
                              {project.name}
                            </h3>

                            <p
                              className={`mt-2.5 text-xs sm:text-sm font-body text-pure-white/75 line-clamp-2 ${
                                isFeatured ? 'max-w-xl' : 'max-w-sm'
                              }`}
                            >
                              {project.description}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center">
                            <span className="inline-flex items-center gap-2 px-5 py-3 text-xs font-body uppercase tracking-[0.18em] bg-pure-white text-carbon group-hover:bg-brand-red group-hover:text-pure-white transition-all duration-300 opacity-100 lg:opacity-0 lg:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
                              <span>View Project Gallery</span>
                              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-projects"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="py-20 px-6 text-center border border-pure-white/10 bg-dark-surface/60"
              >
                <p className="eyebrow text-bronze mb-3">Portfolio Curating</p>
                <h3 className="font-heading text-3xl sm:text-4xl text-pure-white mb-4">
                  Upcoming {activeCategory} Showcases
                </h3>
                <p className="body-text text-sm sm:text-base text-warm-gray max-w-lg mx-auto mb-8">
                  Actual photographs and architectural documentation for this category will
                  appear here once verified by Kraft Homes.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-body uppercase tracking-[0.18em] border border-bronze text-bronze hover:bg-bronze hover:text-carbon transition-colors duration-300 cursor-pointer"
                >
                  View All Projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Full-Screen Project Lightbox */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="project-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeProject.name} gallery`}
            className="fixed inset-0 z-50 bg-carbon/95 backdrop-blur-xl flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-pure-white/10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow text-bronze">{activeProject.category}</span>
                {activeProject.isPlaceholder && (
                  <span className="px-2.5 py-1 text-[10px] font-body uppercase tracking-[0.18em] border border-pure-white/25 text-pure-white/90 bg-dark-surface">
                    Development Placeholder
                  </span>
                )}
                {hasBeforeAfter && (
                  <button
                    type="button"
                    onClick={() => setShowBeforeAfter((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] border cursor-pointer transition-colors ${
                      showBeforeAfter
                        ? 'bg-brand-red border-brand-red text-pure-white'
                        : 'border-bronze/50 text-bronze hover:bg-bronze hover:text-carbon'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{showBeforeAfter ? 'Gallery View' : 'Before & After'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block text-xs font-body tracking-widest text-warm-gray">
                  {projectImages.length > 1
                    ? `Image ${String(activeImageIndex + 1).padStart(2, '0')} / ${String(
                        projectImages.length
                      ).padStart(2, '0')}`
                    : `Project ${String(selectedProjectIndex + 1).padStart(2, '0')} / ${String(
                        filteredProjects.length
                      ).padStart(2, '0')}`}
                </span>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close project gallery"
                  className="p-2.5 border border-pure-white/15 text-pure-white hover:border-brand-red hover:bg-brand-red transition-colors duration-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Swipeable Stage */}
            <div
              className="relative flex-1 flex items-center justify-center px-4 sm:px-14 py-4 sm:py-8 overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {(projectImages.length > 1 || filteredProjects.length > 1) && !showBeforeAfter && (
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label={projectImages.length > 1 ? 'Previous image' : 'Previous project'}
                  className="hidden sm:flex absolute left-4 lg:left-8 z-30 w-12 h-12 items-center justify-center border border-pure-white/15 bg-carbon/80 text-pure-white hover:border-bronze hover:text-bronze transition-colors duration-300 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div className="relative w-full max-w-5xl h-full max-h-[62vh] sm:max-h-[68vh] border border-pure-white/10 bg-dark-surface overflow-hidden">
                {showBeforeAfter && hasBeforeAfter ? (
                  <BeforeAfterComparison
                    beforeSrc={activeProject.beforeImage}
                    afterSrc={activeProject.afterImage}
                    projectName={activeProject.name}
                  />
                ) : (
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.div
                      key={`${activeProject.id}-${activeImageIndex}`}
                      custom={slideDirection}
                      initial={{ opacity: 0, x: slideDirection * 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: slideDirection * -40 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="w-full h-full"
                    >
                      <ProjectImage
                        src={projectImages[activeImageIndex] || ''}
                        alt={`${activeProject.name} view ${activeImageIndex + 1}`}
                        index={selectedProjectIndex + activeImageIndex}
                        category={activeProject.category}
                        isFeatured
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {(projectImages.length > 1 || filteredProjects.length > 1) && !showBeforeAfter && (
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label={projectImages.length > 1 ? 'Next image' : 'Next project'}
                  className="hidden sm:flex absolute right-4 lg:right-8 z-30 w-12 h-12 items-center justify-center border border-pure-white/15 bg-carbon/80 text-pure-white hover:border-bronze hover:text-bronze transition-colors duration-300 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bottom Info */}
            <div className="relative z-20 border-t border-pure-white/10 bg-carbon/95 px-4 sm:px-8 py-5 sm:py-6">
              <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-body text-bronze">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeProject.location}
                    </span>
                    {activeProject.brands?.length > 0 && (
                      <span className="text-warm-gray">
                        &middot; Brands: {activeProject.brands.join(', ')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-pure-white">
                    {activeProject.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-warm-gray leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4">
                  {(projectImages.length > 1 || filteredProjects.length > 1) && (
                    <div className="flex sm:hidden items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        aria-label="Previous"
                        className="p-2.5 border border-pure-white/15 text-pure-white hover:border-bronze cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        aria-label="Next"
                        className="p-2.5 border border-pure-white/15 text-pure-white hover:border-bronze cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleEnquireClick}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs font-body uppercase tracking-[0.18em] bg-brand-red text-pure-white hover:bg-pure-white hover:text-carbon transition-colors duration-300 cursor-pointer"
                  >
                    <span>Plan a Similar Space</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
