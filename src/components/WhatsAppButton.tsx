import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/40767494319"
      target="_blank"
      rel="noopener noreferrer"
      className={`lg:hidden fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:scale-110 transition-all duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ transition: 'opacity 0.4s, transform 0.3s' }}
    >
      <MessageCircle size={28} className="text-white fill-white" />
    </a>
  );
}
