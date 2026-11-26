import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import KitchenBlueprint from './KitchenBlueprint';
import LogoReveal from './LogoReveal';
import { createPreloaderTimeline } from '../../animations/preloaderTimeline';
import './Preloader.css';

const SESSION_KEY = 'kraft_preloader_seen';
const HARD_TIMEOUT_MS = 3200;

export function shouldSkipPreloader() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (window.location.hash && window.location.hash !== '#home') return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default function Preloader({ onHeroReveal, onComplete }) {
  const [shouldRender, setShouldRender] = useState(() => !shouldSkipPreloader());
  const [assetProgress, setAssetProgress] = useState(0.25);

  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const finishedRef = useRef(false);

  const finalizePreloader = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore storage failures in restricted browsing modes
    }

    document.body.style.overflow = '';
    setShouldRender(false);
    if (typeof onHeroReveal === 'function') onHeroReveal();
    if (typeof onComplete === 'function') onComplete();
  }, [onHeroReveal, onComplete]);

  // If skipped on initial load (return visit in same session, reduced motion, or deep hash)
  useEffect(() => {
    if (!shouldRender) {
      if (typeof onHeroReveal === 'function') onHeroReveal();
      if (typeof onComplete === 'function') onComplete();
    }
  }, [shouldRender, onHeroReveal, onComplete]);

  // Monitor actual hero image & essential logo asset readiness (never fake progress)
  useEffect(() => {
    if (!shouldRender) return undefined;

    const preloadHref =
      document.querySelector('link[rel="preload"][as="image"]')?.getAttribute('href') ||
      document.querySelector('#home img')?.getAttribute('src');

    const assetsToCheck = [
      '/logo/kraft-homes-wordmark-dark.png',
      '/logo/kraft-homes-tagline-dark.png',
      ...(preloadHref ? [preloadHref] : []),
    ];

    let loadedCount = 0;
    const total = assetsToCheck.length;
    let active = true;

    const markLoaded = () => {
      if (!active) return;
      loadedCount += 1;
      setAssetProgress(Math.min(1, 0.25 + (loadedCount / total) * 0.75));
    };

    assetsToCheck.forEach((src) => {
      const img = new Image();
      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = src;
    });

    return () => {
      active = false;
    };
  }, [shouldRender]);

  // Lock body scroll & execute coordinated GSAP preloader timeline
  useEffect(() => {
    if (!shouldRender || !rootRef.current) return undefined;

    finishedRef.current = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      timelineRef.current = createPreloaderTimeline({
        root: rootRef.current,
        onStartHeroReveal: () => {
          if (typeof onHeroReveal === 'function') onHeroReveal();
        },
        onComplete: finalizePreloader,
      });
    }, rootRef);

    // Safe hard fallback timeout so visitors are never delayed or stuck
    const safetyTimer = setTimeout(() => {
      finalizePreloader();
    }, HARD_TIMEOUT_MS);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [shouldRender, finalizePreloader, onHeroReveal]);

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.seek(1.8);
    } else {
      finalizePreloader();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Kraft Homes"
      className="kh-preloader-overlay"
    >
      {/* Left & Right Vertical Cabinet Doors */}
      <div className="kh-preloader-door kh-preloader-door-left" aria-hidden="true">
        <div className="kh-preloader-grid" />
      </div>
      <div className="kh-preloader-door kh-preloader-door-right" aria-hidden="true">
        <div className="kh-preloader-grid" />
      </div>

      {/* Centered Architectural Blueprint & Brand Reveal Stage */}
      <div className="relative z-20 flex h-full w-full items-center justify-center">
        <KitchenBlueprint />
        <LogoReveal progress={assetProgress} />
      </div>

      {/* Subtle Skip Control for Paid-Ad Visitors */}
      <button
        type="button"
        onClick={handleSkip}
        className="fixed bottom-6 right-6 z-30 font-body text-[10px] sm:text-xs uppercase tracking-[0.22em] text-carbon/55 hover:text-brand-red transition-colors duration-200 px-3 py-1.5 border border-bronze/30 bg-ivory/80 backdrop-blur-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
      >
        Skip Intro
      </button>
    </div>
  );
}
