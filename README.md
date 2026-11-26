# Kraft Homes — Salem Luxury Kitchen, Appliances & Architectural Hardware

Single-page luxury architectural web application built for **Kraft Homes** (an extension of **Sri Lakshmi Groups**, Salem, Tamil Nadu) using React, Vite, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, Framer Motion, Swiper, React Hook Form, Zod, and Lucide React.

---

## Quick Start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

---

## Asset & Content Replacement Guide

All website media and business data are separated into dedicated data files under `src/data/` and organized folders under `public/` so future photographs and videos can be replaced without modifying UI components or layout logic.

### 1. Brand Logos & Kraft Homes Identity
- **Kraft Homes Logo Variants**: `public/logo/`
  - `kraft-homes-header-light.png` & `kraft-homes-header-dark.png`
  - `kraft-homes-logo-light.png` & `kraft-homes-logo-dark.png`
  - `kraft-homes-monogram-light.png` & `kraft-homes-monogram-dark.png`
- **Partner Brand Logos**: `public/images/brands/` & `src/data/brands.js`
  - Drop additional official brand SVG/PNG files (e.g., `terra.svg`, `acs-aluminium.svg`) into `public/images/brands/` and set their `logo` path in `src/data/brands.js`.

### 2. Hero & Section Photography
- **Hero Slides**: Replace `public/images/hero/hero-1.webp` through `hero-4.webp` (or update `HERO_SLIDES` in `src/sections/Hero.jsx`).
- **About Section**: Replace `public/images/about/about-studio.webp` (configured in `src/data/company.js`).
- **Collections**: Replace images under `public/images/kitchens/`, `wardrobes/`, `appliances/`, `hardware/`, `quartz/`, and `aluminium/` (configured in `src/data/collections.js`).
- **Interactive Kitchen Experience**: Update image/hotspot coordinates in `src/data/kitchenHotspots.js`.
- **Material & Finish Explorer**: Update swatches or kitchen base visualization in `src/data/materials.js`.

### 3. Completed Projects (`src/data/projects.js`)
Replace placeholder entries with actual Kraft Homes client projects:
- Save project photos under `public/images/projects/<project-slug>/`.
- Set `cover`, `images`, `name`, `location`, `category`, `description`, `brands`, and `isPlaceholder: false`.
- Optional before-and-after slider: provide both `beforeImage` and `afterImage` paths.

### 4. Customer Video Testimonials (`src/data/testimonials.js`)
- Save approved video files under `public/videos/testimonials/` and thumbnails under `public/images/testimonials/` (or supply a `youtubeId` for lazy-loaded `react-lite-youtube-embed` playback).
- Set `aspect: 'portrait'` for vertical Instagram Reel-style clips or `'landscape'` for 16:9 interviews, and set `isPlaceholder: false`.

### 5. Showroom & Infrastructure (`src/data/showroom.js`)
- Replace conceptual entries with actual Salem showroom, manufacturing unit, and warehouse photos under `public/images/showroom/`, setting `isConceptual: false`.

---

## Analytics, Ad Tracking & Lead Capture

Copy `.env.example` to `.env` and supply your tracking IDs:

```env
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX
VITE_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXXXXXXX
VITE_API_URL=/.netlify/functions/submit-enquiry
```

### Server-Side Lead Capture (`netlify/functions/submit-enquiry.js`)
- Validates enquiry payloads server-side and forwards leads securely to `LEAD_WEBHOOK_URL` (CRM, Google Sheets webhook, etc.) using server-side environment secrets (never exposed in the React client).
- When `VITE_API_URL` is set, the form persists the enquiry before opening the prefilled WhatsApp message (`https://wa.me/919042834479?text=...`).
- `WHATSAPP_CLICK` / `WHATSAPP_HANDOFF` events are tracked independently from confirmed backend `ENQUIRY_CONFIRMED` leads.

---

## Deployment (Netlify / Static Hosting)

1. Push the repository to GitHub/GitLab or deploy directly via Netlify CLI (`netlify deploy --prod`).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure environment variables (`VITE_*` for client IDs, `LEAD_WEBHOOK_URL` for serverless lead forwarding) in your hosting dashboard.
