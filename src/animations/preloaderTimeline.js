import gsap from 'gsap';

/**
 * Coordinates the 5-phase "From Blueprint to Luxury" Kraft Homes preloader timeline.
 * Total maximum runtime: ~2.3 seconds.
 *
 * Phase 1 (0.00s - 0.60s): Architectural Blueprint Drawing
 * Phase 2 (0.60s - 1.15s): Modular Kitchen Assembly & Center Convergence
 * Phase 3 (0.85s - 1.35s): Original Black Stick KH Monogram Assembly
 * Phase 4 (1.20s - 1.80s): Complete Kraft Homes Brand Reveal
 * Phase 5 (1.80s - 2.30s): Cinematic Cabinet-Door Opening -> Website Hero
 */
export function createPreloaderTimeline({
  root,
  onStartHeroReveal,
  onComplete,
}) {
  const q = gsap.utils.selector(root);

  // Measure and initialize SVG stroke lengths for progressive blueprint + monogram draw
  const blueprintLines = q('.kh-draw-line');
  blueprintLines.forEach((el) => {
    if (typeof el.getTotalLength === 'function') {
      const len = Math.ceil(el.getTotalLength());
      gsap.set(el, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
    }
  });

  const monogramStrokes = q('.kh-stroke-draw');
  monogramStrokes.forEach((el) => {
    if (typeof el.getTotalLength === 'function') {
      const len = Math.ceil(el.getTotalLength()) + 4;
      gsap.set(el, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
    }
  });

  // Initial pre-animation states
  gsap.set(q('.kh-cad-upper'), { y: -16, opacity: 0.9 });
  gsap.set(q('.kh-cad-base'), { y: 16, opacity: 0.9 });
  gsap.set(q('.kh-cad-countertop'), { scaleX: 0.88, transformOrigin: 'center center' });
  gsap.set(q('.kh-cad-island'), { y: 20, opacity: 0 });
  gsap.set(q('.kh-cad-appliance'), { opacity: 0 });
  gsap.set(q('.kh-monogram-wrap'), { y: 42 });
  gsap.set(q('.kh-monogram-guides'), { opacity: 0, scale: 1.18 });
  gsap.set(q('.kh-brand-lockup'), { opacity: 1 });
  gsap.set(q('.kh-wordmark-reveal'), { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
  gsap.set(q('.kh-tagline-reveal'), { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
  gsap.set(q('.kh-subtitle-reveal'), { y: 10, opacity: 0 });
  gsap.set(q('.kh-progress-track'), { opacity: 0, scaleX: 0.6 });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete,
  });

  // ------------------------------------------------------------------
  // PHASE 1 (0.00s - 0.60s): Architectural Blueprint Drawing
  // ------------------------------------------------------------------
  tl.to(
    q('.kh-cad-caption'),
    { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
    0
  )
    .to(
      q('.kh-cad-dimensions .kh-draw-line, .kh-cad-shell .kh-draw-line'),
      {
        strokeDashoffset: 0,
        duration: 0.45,
        stagger: 0.025,
        ease: 'sine.inOut',
      },
      0.04
    )
    .to(
      q('.kh-cad-upper .kh-draw-line, .kh-cad-base .kh-draw-line, .kh-cad-countertop .kh-draw-line'),
      {
        strokeDashoffset: 0,
        duration: 0.42,
        stagger: 0.02,
        ease: 'power2.inOut',
      },
      0.14
    )
    .to(
      q('.kh-cad-island .kh-draw-line'),
      {
        strokeDashoffset: 0,
        duration: 0.36,
        stagger: 0.025,
        ease: 'power2.out',
      },
      0.24
    );

  // ------------------------------------------------------------------
  // PHASE 2 (0.60s - 1.15s): Modular Kitchen Assembly & Center Convergence
  // ------------------------------------------------------------------
  tl.to(
    q('.kh-cad-upper'),
    { y: 0, opacity: 1, duration: 0.42, ease: 'power4.out' },
    0.58
  )
    .to(
      q('.kh-cad-base'),
      { y: 0, opacity: 1, duration: 0.42, ease: 'power4.out' },
      0.58
    )
    .to(
      q('.kh-cad-countertop'),
      { scaleX: 1, duration: 0.38, ease: 'power3.out' },
      0.62
    )
    .to(
      q('.kh-cad-island'),
      { y: 0, opacity: 1, duration: 0.42, ease: 'power3.out' },
      0.62
    )
    .to(
      q('.kh-cad-appliance'),
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
      0.72
    )
    // Blueprint lines converge toward the center & dissolve smoothly
    .to(
      q('.kh-blueprint-stage'),
      {
        scale: 0.72,
        opacity: 0,
        duration: 0.42,
        ease: 'power3.inOut',
      },
      0.90
    )
    .to(
      q('.kh-monogram-guides'),
      {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: 'power3.out',
      },
      0.86
    );

  // ------------------------------------------------------------------
  // PHASE 3 (0.85s - 1.35s): Original Black Stick KH Monogram Assembly
  // ------------------------------------------------------------------
  tl.to(
    q('.kh-stroke-1'),
    { strokeDashoffset: 0, duration: 0.28, ease: 'power3.out' },
    0.88
  )
    .to(
      q('.kh-stroke-2'),
      { strokeDashoffset: 0, duration: 0.26, ease: 'power3.out' },
      0.96
    )
    .to(
      q('.kh-stroke-3'),
      { strokeDashoffset: 0, duration: 0.28, ease: 'power3.inOut' },
      1.04
    )
    .to(
      q('.kh-stroke-4'),
      { strokeDashoffset: 0, duration: 0.28, ease: 'power3.inOut' },
      1.12
    );

  // ------------------------------------------------------------------
  // PHASE 4 (1.20s - 1.80s): Complete Kraft Homes Brand Reveal
  // ------------------------------------------------------------------
  tl.to(
    q('.kh-monogram-wrap'),
    { y: 0, duration: 0.45, ease: 'power3.inOut' },
    1.22
  )
    .to(
      q('.kh-monogram-guides'),
      { opacity: 0, duration: 0.32, ease: 'power2.out' },
      1.26
    )
    .to(
      q('.kh-wordmark-reveal'),
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.42,
        ease: 'power3.out',
      },
      1.32
    )
    .to(
      q('.kh-tagline-reveal'),
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.38,
        ease: 'power3.out',
      },
      1.44
    )
    .to(
      q('.kh-subtitle-reveal'),
      {
        y: 0,
        opacity: 1,
        duration: 0.34,
        ease: 'power2.out',
      },
      1.52
    )
    .to(
      q('.kh-progress-track'),
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.32,
        ease: 'power2.out',
      },
      1.54
    );

  // ------------------------------------------------------------------
  // PHASE 5 (1.80s - 2.30s): Cinematic Cabinet-Door Opening -> Hero
  // ------------------------------------------------------------------
  tl.to(
    q('.kh-logo-stage'),
    {
      opacity: 0,
      scale: 0.96,
      duration: 0.24,
      ease: 'power2.in',
    },
    1.78
  )
    .call(() => {
      if (typeof onStartHeroReveal === 'function') {
        onStartHeroReveal();
      }
    }, null, 1.82)
    .to(
      q('.kh-preloader-door-left'),
      {
        xPercent: -102,
        rotateY: 14,
        duration: 0.52,
        ease: 'expo.inOut',
      },
      1.82
    )
    .to(
      q('.kh-preloader-door-right'),
      {
        xPercent: 102,
        rotateY: -14,
        duration: 0.52,
        ease: 'expo.inOut',
      },
      1.82
    );

  return tl;
}
