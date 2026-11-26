// WhatsApp click-to-chat utility & enquiry prefill helper

export function generateWhatsAppUrl(formData) {
  const message = `Hello Kraft Homes,

I am interested in your products and services.

Name: ${formData.name || ''}
Mobile Number: ${formData.mobile || ''}
Email: ${formData.email || 'Not provided'}
Location: ${formData.location || ''}
Interested Product: ${formData.product || ''}
Estimated Budget: ${formData.budget || 'Not specified'}
Requirements: ${formData.message || ''}

Please contact me regarding my enquiry.
Thank you.`;

  return `https://wa.me/919042834479?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(formData) {
  const url = generateWhatsAppUrl(formData);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function navigateToEnquiry(category, note = '') {
  window.dispatchEvent(
    new CustomEvent('kraft:select-enquiry-category', {
      detail: { category, note },
    })
  );
  const contactEl = document.getElementById('contact');
  if (contactEl) {
    contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export const WHATSAPP_CHAT_URL = 'https://wa.me/919042834479';
