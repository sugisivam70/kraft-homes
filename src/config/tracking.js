// Tracking & Analytics Configuration
// All IDs are injected safely via environment variables (never hardcoded secrets)
import { captureAttribution, getStoredAttribution } from '../utils/attribution';

export const tracking = {
  gtmId: import.meta.env.VITE_GTM_ID || '',
  ga4Id: import.meta.env.VITE_GA4_ID || '',
  googleAdsId: import.meta.env.VITE_GOOGLE_ADS_ID || '',
  googleAdsConversionLabel: import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL || '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
};

export const events = {
  WHATSAPP_CLICK: 'whatsapp_click',
  PHONE_CLICK: 'phone_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  ENQUIRY_CONFIRMED: 'enquiry_confirmed',
  WHATSAPP_HANDOFF: 'whatsapp_handoff_opened',
  PROJECT_VIEW: 'project_gallery_view',
  VIDEO_PLAY: 'testimonial_video_play',
  PRODUCT_SELECT: 'product_category_select',
  SHOWROOM_DIRECTIONS: 'showroom_directions_click',
  CONSULTATION_CLICK: 'consultation_click',
  COLLECTION_ENQUIRY: 'collection_enquiry_click',
};

let initialized = false;

// Defer third-party tag injection after initial paint for strong Core Web Vitals
export function initTracking() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  captureAttribution();
  window.dataLayer = window.dataLayer || [];

  const inject = () => {
    // 1. Google Tag Manager
    if (tracking.gtmId && !document.getElementById('kraft-gtm-script')) {
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const s = document.createElement('script');
      s.id = 'kraft-gtm-script';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(tracking.gtmId)}`;
      document.head.appendChild(s);
    }

    // 2. Google Analytics 4 / Google Ads gtag
    const primaryGtagId = tracking.ga4Id || tracking.googleAdsId;
    if (primaryGtagId && !document.getElementById('kraft-gtag-script')) {
      const s = document.createElement('script');
      s.id = 'kraft-gtag-script';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryGtagId)}`;
      document.head.appendChild(s);

      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      if (tracking.ga4Id) window.gtag('config', tracking.ga4Id);
      if (tracking.googleAdsId) window.gtag('config', tracking.googleAdsId);
    }

    // 3. Meta Pixel
    if (tracking.metaPixelId && !window.fbq) {
      /* eslint-disable */
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', tracking.metaPixelId);
      window.fbq('track', 'PageView');
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(inject, { timeout: 2500 });
  } else {
    setTimeout(inject, 1200);
  }
}

// Track non-PII conversion & engagement events
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;
  const attribution = getStoredAttribution();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
    ...attribution,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, { ...params, ...attribution });
    if (
      eventName === events.ENQUIRY_CONFIRMED &&
      tracking.googleAdsId &&
      tracking.googleAdsConversionLabel
    ) {
      window.gtag('event', 'conversion', {
        send_to: `${tracking.googleAdsId}/${tracking.googleAdsConversionLabel}`,
      });
    }
  }

  if (typeof window.fbq === 'function') {
    if (eventName === events.ENQUIRY_CONFIRMED) {
      window.fbq('track', 'Lead', { content_category: params.product_category || 'Kitchen' });
    } else if (eventName === events.WHATSAPP_CLICK) {
      window.fbq('track', 'Contact', { source: params.source || 'whatsapp' });
    } else {
      window.fbq('trackCustom', eventName, params);
    }
  }
}
