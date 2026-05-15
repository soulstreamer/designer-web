import { Instagram, Facebook, Music } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const serviceLinks = [
    { label: t('footer.optimizare_seo') as string || 'Optimizare SEO', href: '/optimizare-seo' },
    { label: t('footer.mentenanta') as string || 'Mentenanta', href: '/mentenanta' },
  ];

  const companyLinks = [
    { label: t('nav.despre') as string, href: '#despre' },
    { label: t('nav.portofoliu') as string, href: '#portofoliu' },
    { label: t('nav.recenzii') as string, href: '#recenzii' },
    { label: t('nav.contact') as string, href: '#contact' },
  ];

  const supportLinks = [
    { label: t('footer.faq') as string || 'FAQ', href: '/faq' },
    { label: t('footer.terms') as string || 'Termeni si Conditii', href: '/termeni-si-conditii' },
    { label: t('footer.privacy') as string || 'Politica de Confidentialitate', href: '/politica-de-confidentialitate' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'TikTok', icon: Music, href: '#' },
  ];

  return (
    <footer className="w-full bg-[#0a0a0a] pt-16 pb-8 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Logo - Centered and Large */}
        <div className="flex justify-center mb-12">
          <img
            src="/images/logo.png"
            alt="Designer-Web.ro"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Social Links with Icons */}
        <div className="flex justify-center items-center gap-8 mb-12">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                className="flex items-center gap-2 text-[#888] hover:text-[#8B00FF] transition-colors cursor-pointer"
              >
                <Icon size={20} />
                <span className="text-sm">{social.name}</span>
              </a>
            );
          })}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('footer.services') as string}</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-[#888] text-sm hover:text-[#8B00FF] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('footer.company') as string}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[#888] text-sm hover:text-[#8B00FF] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('footer.support') as string}</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-[#888] text-sm hover:text-[#8B00FF] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('footer.contact') as string}</h4>
            <ul className="space-y-2.5">
              <li className="text-[#888] text-sm">Alexandria, Teleorman</li>
              <li className="text-[#888] text-sm">{language === 'en' ? '+40 767 494 319' : '0767 494 319'}</li>
              <li className="text-[#888] text-sm">contact@designer-web.ro</li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#888] text-[13px]">
            {t('footer.copyright') as string}
          </p>
          <p className="text-[#888] text-[13px]">
            {t('footer.developed') as string}
          </p>
        </div>
      </div>
    </footer>
  );
}