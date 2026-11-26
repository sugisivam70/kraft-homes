import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Staggered text reveal animation
export function animateTextReveal(elements, trigger, options = {}) {
  return gsap.from(elements, {
    y: 80,
    opacity: 0,
    duration: options.duration || 1,
    stagger: options.stagger || 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      toggleActions: 'play none none none',
    },
  });
}

// Image reveal with clip-path
export function animateImageReveal(element, trigger, options = {}) {
  return gsap.from(element, {
    clipPath: 'inset(100% 0 0 0)',
    duration: options.duration || 1.2,
    ease: 'power4.inOut',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 75%',
      toggleActions: 'play none none none',
    },
  });
}

// Parallax effect
export function animateParallax(element, trigger, options = {}) {
  return gsap.to(element, {
    y: options.y || -50,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: options.scrub || 1,
    },
  });
}

// Scale-up animation
export function animateScaleIn(element, trigger, options = {}) {
  return gsap.from(element, {
    scale: options.from || 0.9,
    opacity: 0,
    duration: options.duration || 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

// Horizontal line animation
export function animateLine(element, trigger, options = {}) {
  return gsap.from(element, {
    scaleX: 0,
    transformOrigin: options.origin || 'left center',
    duration: options.duration || 1,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

// Fade in with y offset
export function animateFadeInUp(elements, trigger, options = {}) {
  return gsap.from(elements, {
    y: options.y || 40,
    opacity: 0,
    duration: options.duration || 0.8,
    stagger: options.stagger || 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger,
      start: options.start || 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}
