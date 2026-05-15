import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const reviews = language === 'ro' ? [
    {
      quote: 'Am primit pagina de prezentare in doar 24 de ore. Design-ul este exact ce imi doream, iar comunicarea cu echipa a fost excelenta.',
      author: 'Maria I.',
      company: 'Studio de Arhitectura',
      stars: 5,
    },
    {
      quote: 'Magazinul online functioneaza perfect. Sistemul de plati, facturarea, totul a fost configurat profesional. Recomand cu incredere!',
      author: 'Andrei P.',
      company: 'Boutique Online',
      stars: 5,
    },
    {
      quote: 'Colaborare fara griji. Designerul a inteles exact ce aveam nevoie si a livrat un produs final peste asteptari.',
      author: 'Elena D.',
      company: 'Cabinet Medical',
      stars: 5,
    },
  ] : [
    {
      quote: 'I received the landing page in just 24 hours. The design is exactly what I wanted, and communication with the team was excellent.',
      author: 'Maria I.',
      company: 'Architecture Studio',
      stars: 5,
    },
    {
      quote: 'The online store works perfectly. The payment system, invoicing, everything was configured professionally. Highly recommended!',
      author: 'Andrei P.',
      company: 'Online Boutique',
      stars: 5,
    },
    {
      quote: 'Worry-free collaboration. The designer understood exactly what I needed and delivered a final product beyond expectations.',
      author: 'Elena D.',
      company: 'Medical Clinic',
      stars: 5,
    },
  ];

  return (
    <section id="recenzii" ref={sectionRef} className="w-full py-24 bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white mb-4 underline underline-offset-4 decoration-2 decoration-white">
            {t('reviews.subtitle') as string}
          </p>
          <h2
            className="text-white font-bold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1.2,
            }}
          >
            {t('reviews.title') as string}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="review-card bg-white/[0.1] border border-white/20 rounded-xl p-8 hover:-translate-y-1 hover:border-[#8B00FF]/50 hover:bg-white/[0.15] transition-all duration-300"
            >
              <Quote size={24} className="text-[#8B00FF] mb-4" />
              <p className="text-white text-base italic leading-relaxed mb-6">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.stars }).map((_, si) => (
                  <Star key={si} size={16} className="text-[#FFD700] fill-[#FFD700]" />
                ))}
              </div>
              <p className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {review.author}
              </p>
              <p className="text-white/60 text-sm">{review.company}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="section-divider mt-16" style={{ background: 'linear-gradient(90deg, transparent, #8B00FF, transparent)' }} />
    </section>
  );
}