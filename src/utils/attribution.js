// UTM & Campaign Attribution Capture Utility
// Preserves UTM parameters, gclid, and fbclid across the landing page session without storing PII.

const ATTRIBUTION_STORAGE_KEY = 'kraft_homes_attribution';
const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
];

export function captureAttribution() {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const incoming = {};
    let hasNew = false;

    ATTRIBUTION_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        incoming[key] = value.slice(0, 150);
        hasNew = true;
      }
    });

    if (hasNew) {
      const enriched = {
        ...incoming,
        landing_path: window.location.pathname,
        captured_at: new Date().toISOString(),
      };
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(enriched));
      return enriched;
    }

    return getStoredAttribution();
  } catch {
    return {};
  }
}

export function getStoredAttribution() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
