import { forwardRef } from 'react';
import { company } from '../../data/company';

// Renders the exact pixel-traced Kraft Homes KH Monogram (drawn stroke-by-stroke via GSAP)
// followed by the exact official KRAFT HOMES wordmark (with original Red H) and tagline.
const LogoReveal = forwardRef(function LogoReveal({ progress }, ref) {
  return (
    <div
      ref={ref}
      className="kh-logo-stage relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto"
    >
      {/* Monogram Container with Champagne Bronze Architectural Alignment Guides */}
      <div className="kh-monogram-wrap relative flex items-center justify-center py-4 px-8">
        {/* Dashed Construction Frame (matches reference concept #2) */}
        <div
          className="kh-monogram-guides pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <span className="absolute top-3 left-0 right-0 border-t border-dashed border-bronze/55" />
          <span className="absolute bottom-3 left-0 right-0 border-b border-dashed border-bronze/55" />
          <span className="absolute top-0 bottom-0 left-3 border-l border-dashed border-bronze/55" />
          <span className="absolute top-0 bottom-0 right-3 border-r border-dashed border-bronze/55" />
        </div>

        {/* Exact Pixel-Traced Official KH Monogram SVG (viewBox 0 0 124 278) */}
        <svg
          viewBox="0 0 124 278"
          className="kh-kh-svg h-24 sm:h-28 md:h-32 w-auto overflow-visible"
          role="img"
          aria-label="Kraft Homes Architectural Monogram"
        >
          <defs>
            {/* Exact chamfered stick silhouettes as clip paths so centerline draw preserves crisp official bevels */}
            <clipPath id="kh-clip-v1">
              <path d="M29 57 L39 66 L39 278 L29 270 Z" />
            </clipPath>
            <clipPath id="kh-clip-v2">
              <path d="M71 0 L81 8 L81 173 L71 165 Z" />
            </clipPath>
            <clipPath id="kh-clip-diag-up">
              <path d="M104 56 L115 56 L11 179 L0 179 Z" />
            </clipPath>
            <clipPath id="kh-clip-diag-down">
              <path d="M0 102 L124 248 L112 248 L0 115 Z" />
            </clipPath>
          </defs>

          {/* 1. Primary Left Vertical Architectural Stick */}
          <g clipPath="url(#kh-clip-v1)">
            <path
              className="kh-stroke-draw kh-stroke-1"
              d="M34 55 L34 280"
              stroke="#141414"
              strokeWidth="16"
              strokeLinecap="butt"
              fill="none"
            />
          </g>

          {/* 2. Secondary Right Vertical Architectural Stick */}
          <g clipPath="url(#kh-clip-v2)">
            <path
              className="kh-stroke-draw kh-stroke-2"
              d="M76 -2 L76 176"
              stroke="#141414"
              strokeWidth="16"
              strokeLinecap="butt"
              fill="none"
            />
          </g>

          {/* 3. Ascending Diagonal Intersecting Bar */}
          <g clipPath="url(#kh-clip-diag-up)">
            <path
              className="kh-stroke-draw kh-stroke-3"
              d="M3 182 L112 53"
              stroke="#141414"
              strokeWidth="18"
              strokeLinecap="butt"
              fill="none"
            />
          </g>

          {/* 4. Descending Diagonal Leg */}
          <g clipPath="url(#kh-clip-diag-down)">
            <path
              className="kh-stroke-draw kh-stroke-4"
              d="M-3 105 L122 252"
              stroke="#141414"
              strokeWidth="18"
              strokeLinecap="butt"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* Complete Official Wordmark, Tagline & Supporting Line */}
      <div className="kh-brand-lockup mt-4 sm:mt-5 flex flex-col items-center">
        {/* Official KRAFT HOMES Wordmark with Brand Red H */}
        <div className="kh-wordmark-reveal kh-mask-reveal overflow-hidden">
          <img
            src="/logo/kraft-homes-wordmark-dark.png"
            alt={company.name}
            className="h-7 sm:h-9 md:h-10 w-auto object-contain select-none"
          />
        </div>

        {/* Official Tagline */}
        <div className="kh-tagline-reveal kh-mask-reveal mt-2.5 sm:mt-3 overflow-hidden">
          <img
            src="/logo/kraft-homes-tagline-dark.png"
            alt={company.tagline}
            className="h-3 sm:h-3.5 md:h-4 w-auto object-contain select-none"
          />
        </div>

        {/* Supporting Brand Message */}
        <p className="kh-subtitle-reveal mt-3 sm:mt-4 font-heading italic text-base sm:text-xl text-carbon/75 tracking-wide opacity-0">
          Crafting Spaces. Elevating Lifestyles.
        </p>

        {/* Minimal Architectural Red Loading Progress Line (no fake percentages) */}
        <div
          className="kh-progress-track mt-4 sm:mt-5 w-48 sm:w-64 h-[2px] bg-bronze/25 overflow-hidden opacity-0"
          role="progressbar"
          aria-label="Preparing Kraft Homes experience"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="kh-progress-fill h-full bg-brand-red origin-left transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${Math.max(0.08, Math.min(1, progress))})` }}
          />
        </div>
      </div>
    </div>
  );
});

export default LogoReveal;
