import { useEffect, useState, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import Preloader, { shouldSkipPreloader } from './components/Preloader';
import Header from './components/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Collections from './sections/Collections';
import Brands from './sections/Brands';
import KitchenExperience from './sections/KitchenExperience';
import MaterialExplorer from './sections/MaterialExplorer';
import HardwareShowcase from './sections/HardwareShowcase';
import Process from './sections/Process';
import Showroom from './sections/Showroom';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import Enquiry from './sections/Enquiry';
import Footer from './components/Footer';
import BrandDivider from './components/BrandDivider';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import StickyMobileBar from './components/StickyMobileBar';
import ScrollProgress from './components/ScrollProgress';
import { initTracking } from './config/tracking';

function App() {
  const [heroRevealed, setHeroRevealed] = useState(() => shouldSkipPreloader());
  const [preloaderDone, setPreloaderDone] = useState(() => shouldSkipPreloader());
  const lenisRef = useRef(null);

  const handleHeroReveal = useCallback(() => {
    setHeroRevealed(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  useEffect(() => {
    initTracking();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    if (!preloaderDone) {
      lenis.stop();
    }

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (preloaderDone && lenisRef.current) {
      lenisRef.current.start();
    }
  }, [preloaderDone]);

  return (
    <div className="relative">
      <Preloader
        onHeroReveal={handleHeroReveal}
        onComplete={handlePreloaderComplete}
      />

      <ScrollProgress />
      <Header revealReady={heroRevealed} />

      <main>
        <Hero revealReady={heroRevealed} />
        <About />
        <Collections />
        <Brands />
        <KitchenExperience />
        <MaterialExplorer />
        <HardwareShowcase />
        <BrandDivider theme="light" label="Process & Craftsmanship" />
        <Process />
        <Showroom />
        <Projects />
        <Testimonials />
        <BrandDivider theme="light" label="Begin Your Project" />
        <Enquiry />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <StickyMobileBar />
    </div>
  );
}

export default App;
