import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['gsap', 'framer-motion', 'lenis'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          ui: ['swiper', 'lucide-react', 'react-lite-youtube-embed'],
        },
      },
    },
  },
});
