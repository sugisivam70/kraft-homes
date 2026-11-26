import { Phone, MessageCircle } from 'lucide-react';
import { company } from '../data/company';
import { WHATSAPP_CHAT_URL } from '../utils/whatsapp';
import { trackEvent, events } from '../config/tracking';

export default function StickyMobileBar() {
  const handleCallClick = () => {
    trackEvent(events.PHONE_CLICK, {
      location: 'sticky_mobile_bar',
    });
  };

  const handleWhatsAppClick = () => {
    trackEvent(events.WHATSAPP_CLICK, {
      location: 'sticky_mobile_bar',
    });
  };

  return (
    <nav
      aria-label="Quick contact actions"
      className="block lg:hidden fixed bottom-0 left-0 w-full z-50 shadow-[0_-4px_24px_rgba(20,20,20,0.18)]"
    >
      <div className="grid grid-cols-2 w-full">
        <a
          href={`tel:+${company.contact.phoneClean}`}
          onClick={handleCallClick}
          aria-label={`Call Kraft Homes at ${company.contact.phone}`}
          className="flex items-center justify-center gap-2.5 py-3 bg-carbon text-pure-white font-body text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-dark-surface active:opacity-90"
        >
          <Phone className="w-4 h-4 text-bronze" aria-hidden="true" />
          <span>Call</span>
        </a>

        <a
          href={WHATSAPP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          aria-label="Chat with Kraft Homes on WhatsApp"
          className="flex items-center justify-center gap-2.5 py-3 bg-[#25D366] text-pure-white font-body text-xs font-semibold uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-95 active:opacity-90"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
