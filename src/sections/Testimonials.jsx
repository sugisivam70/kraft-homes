import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Play, X, ArrowLeft, ArrowRight, Film, Clock } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { testimonials } from '../data/testimonials';
import { events, trackEvent } from '../config/tracking';

gsap.registerPlugin(ScrollTrigger);

const GRADIENT_FALLBACKS = [
  'bg-gradient-to-br from-[#1C1C1C] via-[#2A241E] to-[#141414]',
  'bg-gradient-to-br from-[#231F1B] via-[#3A3026] to-[#141414]',
  'bg-gradient-to-br from-[#181818] via-[#2C2520] to-[#0F0F0F]',
];

function TestimonialCard({ item, index, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);
  const gradientClass = GRADIENT_FALLBACKS[index % GRADIENT_FALLBACKS.length];
  const showImage = Boolean(item.thumbnailUrl) && !imgFailed;
  const isPortrait = item.aspect === 'portrait';

  return (
    <article className="testimonial-card group relative flex flex-col bg-pure-white border border-light-gray/80 overflow-hidden transition-colors duration-500 hover:border-bronze/60 h-full">
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-label={`Play ${item.customerName} — ${item.projectCategory}`}
        className={`relative w-full ${
          isPortrait ? 'aspect-[4/5]' : 'aspect-[4/3]'
        } overflow-hidden text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${gradientClass}`}
      >
        {showImage && (
          <img
            src={item.thumbnailUrl}
            alt={`${item.customerName} — ${item.projectCategory}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(179,154,125,0.22),transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-carbon/85 via-carbon/25 to-carbon/15 transition-opacity duration-500 group-hover:opacity-90"
        />

        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-carbon/65 backdrop-blur-md border border-pure-white/15 text-[10px] font-body font-medium uppercase tracking-[0.18em] text-ivory">
            {item.projectCategory}
          </span>

          {item.duration && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-carbon/75 backdrop-blur-md border border-pure-white/15 text-[11px] font-body font-medium tracking-wider text-pure-white">
              <Clock className="w-3 h-3 text-bronze" aria-hidden="true" />
              {item.duration}
            </span>
          )}
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="relative flex items-center justify-center w-16 h-16 rounded-full">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-bronze/60 animate-ping opacity-30 group-hover:opacity-60"
              style={{ animationDuration: '2.6s' }}
            />
            <span
              aria-hidden="true"
              className="absolute -inset-2 rounded-full border border-pure-white/20 scale-90 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
            />
            <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-pure-white/95 text-carbon shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-pure-white">
              <Play
                className="w-5 h-5 fill-current translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
          <span className="text-[10px] font-body uppercase tracking-[0.22em] text-ivory/75">
            {String(index + 1).padStart(2, '0')} &mdash; Client Story
          </span>
          {item.isPlaceholder && (
            <span className="text-[10px] font-body uppercase tracking-[0.16em] text-bronze">
              Video Pending
            </span>
          )}
        </div>
      </button>

      {/* Card Footer */}
      <div className="flex items-center justify-between gap-4 px-6 py-5 bg-pure-white mt-auto">
        <div className="min-w-0">
          <h3 className="font-heading text-2xl font-medium text-carbon tracking-tight truncate">
            {item.customerName}
          </h3>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.16em] text-bronze font-medium">
            {item.projectCategory}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(item)}
          aria-label={`Watch ${item.customerName} video`}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-body font-medium uppercase tracking-[0.16em] text-carbon/80 hover:text-brand-red transition-colors cursor-pointer"
        >
          <span>Watch</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function TestimonialModal({ testimonial, onClose }) {
  useEffect(() => {
    if (!testimonial) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [testimonial, onClose]);

  const hasLocalVideo = Boolean(testimonial?.videoUrl) && !testimonial?.isPlaceholder;
  const hasYouTube = Boolean(testimonial?.youtubeId) && !testimonial?.isPlaceholder;
  const isPortrait = testimonial?.aspect === 'portrait';

  return (
    <AnimatePresence>
      {testimonial && (
        <motion.div
          key="testimonial-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-carbon/85 backdrop-blur-md"
        >
          <motion.div
            key="testimonial-modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${
              isPortrait && (hasLocalVideo || hasYouTube) ? 'max-w-md' : 'max-w-4xl'
            } bg-dark-surface border border-pure-white/15 shadow-2xl overflow-hidden`}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7 border-b border-pure-white/10">
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.2em] text-bronze">
                  {testimonial.projectCategory}
                  {testimonial.duration ? ` • ${testimonial.duration}` : ''}
                </p>
                <h3
                  id="testimonial-modal-title"
                  className="font-heading text-2xl sm:text-3xl font-normal text-pure-white mt-0.5"
                >
                  {testimonial.customerName}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close video modal"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-pure-white/20 text-ivory hover:border-brand-red hover:bg-brand-red hover:text-pure-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div
              className={`relative ${
                isPortrait && (hasLocalVideo || hasYouTube)
                  ? 'aspect-[9/16]'
                  : 'aspect-video'
              } w-full bg-carbon flex items-center justify-center`}
            >
              {hasLocalVideo ? (
                <video
                  src={testimonial.videoUrl}
                  poster={testimonial.thumbnailUrl || undefined}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain bg-carbon"
                >
                  {testimonial.captionsUrl && (
                    <track
                      kind="captions"
                      src={testimonial.captionsUrl}
                      label="English captions"
                      default
                    />
                  )}
                </video>
              ) : hasYouTube ? (
                <div className="w-full h-full">
                  <LiteYouTubeEmbed
                    id={testimonial.youtubeId}
                    title={testimonial.customerName}
                    poster="maxresdefault"
                  />
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center text-center px-6 py-12 max-w-lg">
                  <div
                    aria-hidden="true"
                    className="mb-5 flex items-center justify-center w-16 h-16 rounded-full border border-bronze/40 bg-bronze/10 text-bronze"
                  >
                    <Film className="w-7 h-7" />
                  </div>
                  <p className="font-body text-[11px] uppercase tracking-[0.22em] text-bronze mb-2">
                    Video Coming Soon
                  </p>
                  <h4 className="font-heading text-2xl sm:text-3xl text-pure-white font-light mb-3">
                    {testimonial.customerName} &mdash; {testimonial.projectCategory}
                  </h4>
                  <p className="font-body text-sm text-warm-gray leading-relaxed">
                    Actual customer feedback videos supplied by Kraft Homes will play here
                    with full audio, portrait reel framing, and subtitle support.
                  </p>
                </div>
              )}
            </div>

            {testimonial.captions && (
              <div className="px-6 py-4 bg-carbon/80 border-t border-pure-white/10">
                <p className="font-body text-xs sm:text-sm text-ivory/80 italic">
                  &ldquo;{testimonial.captions}&rdquo;
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

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

      if (carouselRef.current) {
        gsap.from(carouselRef.current, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelectTestimonial = (item) => {
    setSelectedTestimonial(item);
    trackEvent(events.VIDEO_PLAY, {
      testimonial_id: item.id,
      project_category: item.projectCategory,
      is_placeholder: Boolean(item.isPlaceholder),
    });
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative bg-ivory text-carbon py-24 md:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-16"
        >
          <div className="max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-3 text-bronze mb-4">
              <span className="h-px w-8 bg-bronze" aria-hidden="true" />
              Client Stories
            </span>
            <h2 className="heading-lg font-heading text-4xl sm:text-5xl lg:text-6xl text-carbon">
              Beautiful Spaces. Happier Customers.
            </h2>
            <p className="body-text mt-4 text-sm sm:text-base text-carbon/70 max-w-xl">
              Real homeowner video walkthroughs and feedback stories from Kraft Homes
              clients will appear here as approved by our customers.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              ref={setPrevEl}
              type="button"
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-carbon/20 bg-pure-white text-carbon transition-all duration-300 hover:border-carbon hover:bg-carbon hover:text-pure-white disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              ref={setNextEl}
              type="button"
              aria-label="Next testimonial"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-carbon/20 bg-pure-white text-carbon transition-all duration-300 hover:border-carbon hover:bg-carbon hover:text-pure-white disabled:opacity-40 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div ref={carouselRef}>
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            loop={testimonials.length > 3}
            autoplay={
              selectedTestimonial
                ? false
                : {
                    delay: 5500,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                  }
            }
            navigation={{
              prevEl,
              nextEl,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="w-full"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={item.id} className="h-auto">
                <TestimonialCard
                  item={item}
                  index={index}
                  onSelect={handleSelectTestimonial}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-light-gray flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-body text-xs tracking-wide text-warm-gray">
            Supports both Instagram Reel-style vertical video and widescreen client interviews.
          </p>
          <span className="font-body text-[11px] uppercase tracking-[0.2em] text-bronze">
            Salem &bull; Tamil Nadu
          </span>
        </div>
      </div>

      {/* Video Modal */}
      <TestimonialModal
        testimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </section>
  );
}
