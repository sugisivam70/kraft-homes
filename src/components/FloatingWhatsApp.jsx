import { MessageCircle } from 'lucide-react';
import { WHATSAPP_CHAT_URL } from '../utils/whatsapp';
import { trackEvent, events } from '../config/tracking';

export default function FloatingWhatsApp() {
  const handleClick = () => {
    trackEvent(events.WHATSAPP_CLICK, {
      location: 'floating_whatsapp',
    });
  };

  return (
    <a
      href={WHATSAPP_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat with Kraft Homes on WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-pure-white shadow-2xl transition-all duration-300 ease-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-ivory group"
    >
      <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
