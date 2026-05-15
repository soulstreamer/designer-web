import Marquee from 'react-fast-marquee';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrustedBy() {
  const { t, language } = useLanguage();

  const partners = language === 'ro' ? [
    'Studio Arhitectura',
    'Boutique Fashion',
    'Cabinet Medical',
    'Restaurant Local',
    'Agentie Imobiliara',
    'Salon Infrumusetare',
    'Firmă Constructii',
    'Magazin Online',
  ] : [
    'Architecture Studio',
    'Fashion Boutique',
    'Medical Clinic',
    'Local Restaurant',
    'Real Estate Agency',
    'Beauty Salon',
    'Construction Company',
    'Online Store',
  ];

  return (
    <section className="w-full py-10 bg-[#050505] border-y border-[rgba(255,255,255,0.06)]">
      <p
        className="text-center text-xs font-medium uppercase tracking-[0.1em] text-[#888] mb-6"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {t('trusted.title') as string}
      </p>
      <Marquee speed={40} pauseOnHover gradient={false}>
        {partners.map((name, i) => (
          <span
            key={i}
            className="mx-12 text-white/40 text-sm font-medium uppercase tracking-wider whitespace-nowrap hover:text-white/70 transition-colors"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}