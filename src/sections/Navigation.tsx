import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const leftLinks = [
    { label: t('nav.servicii') as string, href: '#servicii' },
    { label: t('nav.portofoliu') as string, href: '#portofoliu' },
  ];

  const rightLinks = [
    { label: t('nav.despre') as string, href: '#despre' },
    { label: t('nav.recenzii') as string, href: '#recenzii' },
    { label: t('nav.contact') as string, href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[100px] flex items-center transition-all duration-400 ${
          scrolled
            ? 'bg-[rgba(5,5,5,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-center">
          {/* Left links */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-end pr-8">
            {leftLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative px-4 py-2 text-sm font-medium uppercase tracking-[0.05em] text-white/80 overflow-hidden group"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {link.label}
                </span>
                <span className="absolute inset-0 bg-[#8B00FF] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            ))}
          </div>

          {/* Center Logo - doubled size */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-shrink-0 mx-4"
          >
            <img
              src="/images/logo.png"
              alt="Designer-Web.ro"
              className="h-32 w-auto object-contain"
            />
          </button>

          {/* Right links + Language Switcher */}
          <div className="hidden lg:flex items-center gap-6 flex-1 pl-8">
            {rightLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative px-4 py-2 text-sm font-medium uppercase tracking-[0.05em] text-white/80 overflow-hidden group"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {link.label}
                </span>
                <span className="absolute inset-0 bg-[#8B00FF] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            ))}
            {/* Language Switcher - now part of right section for balanced layout */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors ml-4"
              title={language === 'ro' ? 'Switch to English' : 'Schimbă în Română'}
            >
              <Globe size={18} />
              <span className="uppercase tracking-wider">{language}</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 absolute right-6"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#8B00FF] flex flex-col items-center justify-center gap-6">
          <button
            className="absolute top-5 right-6 text-white p-2"
            onClick={() => setMobileOpen(false)}
          >
            <X size={28} />
          </button>
          
          {/* Language Switcher for Mobile */}
          <button
            onClick={() => {
              setLanguage(language === 'ro' ? 'en' : 'ro');
              setMobileOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-lg font-medium text-white/90 hover:text-white transition-colors"
          >
            <Globe size={20} />
            <span className="uppercase tracking-wider">{language === 'ro' ? 'English' : 'Română'}</span>
          </button>

          {[...leftLinks, ...rightLinks].map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-semibold text-white uppercase tracking-wider hover:text-white/70 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://wa.me/40767494319"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-8 py-3 bg-[#25D366] text-white font-semibold rounded-full flex items-center gap-2"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      )}
    </>
  );
}